/**
 * The A.I. filter's back end, as a Vite dev-server route. It takes the prompt
 * somebody typed over the roster and hands back the conditions it means.
 *
 * It is a dev-server route rather than a fetch from the page for the usual
 * reason: an API key belongs on a machine, not in a bundle. Two ways in, in
 * this order --
 *
 *   1. An Anthropic API key (`ANTHROPIC_API_KEY` in `.env.local`, or an
 *      `ant auth login` profile). This is what a real deployment would do.
 *   2. The `claude` CLI, if it is installed and logged in. Nothing to set up
 *      and nothing to pay for beyond the Claude subscription already on the
 *      machine -- good for a prototype, no use at all once this is hosted.
 *
 * With neither, the route says so and the page falls back to reading the
 * prompt itself, which is enough for the handful of shapes a demo asks for.
 */

import { spawn } from "node:child_process";
import type { Plugin } from "vite";

import {
  asOf,
  operators,
  vocabulary,
  type Options,
} from "../features/employees/query";

export type Engine = "api" | "cli" | "none";

type Ask = { prompt: string; options: Options };

/** What the model is told the roster is, and what it may say back about it.
 *  Everything specific to this page comes from the field list, so the prompt
 *  never falls out of step with what the page can actually evaluate. */
const instructions = (
  options: Options,
) => `You turn a plain-language request about a restaurant group's staff roster into a filter over that roster.

Today is ${asOf()}.

The fields you can filter on:
${vocabulary(options)}

The operators, by the kind of field they work on:
${operators}

Answer with JSON and nothing else, in this shape:

{"conditions": [{"field": "...", "op": "...", ...}], "columns": ["..."], "summary": "..."}

Each condition carries the operand its operator needs:
- "is" / "is not": "values", an array of strings, spelled exactly as the field's list above spells them
- "contains": "text", a string
- "before" / "after": "date", as YYYY-MM-DD
- "between": "from" and "to", as YYYY-MM-DD, both ends included
- "at least" / "at most": "value", a number
- "is set" / "is not set": nothing else

"columns" is for fields the request asks to *see* rather than filter by -- "what are they paid" wants the wage column. Leave it empty unless the request asks to see something. The fields filtered on are shown anyway.

Rules:
- Conditions narrow together: a row has to clear all of them. There is no "or" -- a question that wants one of several values is one condition with several values.
- Work out any relative date ("in the next 3 months", "last year", "before the summer") against today's date above, and answer with real dates.
- "Expiring" or "expires in the next N" means between today and then. "Expired" or "lapsed" means before today.
- Prefer fewer conditions. Do not add one the request did not ask for.
- If the request cannot be expressed in these fields, return an empty conditions array and use the summary to say what you could not answer and -- where there is one -- how to ask for something close that you can. Nothing is filtered and no columns are added in that case; the summary is all the person sees, so write it to them.
- The summary is one short sentence, addressed to the person who asked, saying what you filtered to. No preamble.`;

/** The answer, trimmed of whatever a model wraps JSON in when it is feeling
 *  helpful. The page validates the contents; this only has to find them. */
function readJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = (fenced ? fenced[1] : text).trim();
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");

  if (start === -1 || end === -1)
    throw new Error(`No JSON in: ${text.slice(0, 200)}`);

  return JSON.parse(body.slice(start, end + 1)) as unknown;
}

/** An API key, or a profile left by `ant auth login`, which the SDK finds on
 *  its own. */
const hasKey = () =>
  Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

function run(command: string, args: string[], input?: string) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"] });
    let out = "";
    let err = "";

    child.stdout.on("data", (chunk) => (out += chunk));
    child.stderr.on("data", (chunk) => (err += chunk));
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? resolve(out)
        : reject(new Error(err.trim() || `exit ${code}`)),
    );

    if (input !== undefined) child.stdin.end(input);
    else child.stdin.end();
  });
}

/** Whether the Claude CLI is on the path, worked out once. */
let cli: Promise<boolean> | undefined;
const hasCli = () =>
  (cli ??= run("sh", ["-c", "command -v claude"]).then(
    () => true,
    () => false,
  ));

export async function engineInUse(): Promise<Engine> {
  if (hasKey()) return "api";
  return (await hasCli()) ? "cli" : "none";
}

/** The API, through the SDK, the way a deployed version of this would do it. */
async function askApi({ prompt, options }: Ask) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 2000,
    /* Low effort: this is a parse, not a problem. It keeps the wait at the
       length somebody will stand in front of a filter dialog. */
    output_config: { effort: "low" },
    system: instructions(options),
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return readJson(text);
}

/**
 * The Claude CLI in headless mode, which runs on whatever account is already
 * logged in on this machine. `--output-format json` wraps the reply in an
 * envelope; the reply itself is the `result` field.
 *
 * `--system-prompt` replaces Claude Code's own rather than adding to it, and
 * `--strict-mcp-config` leaves whatever MCP servers the machine is carrying
 * out of it: between them they take the wait from eight seconds to four, and
 * leave the model with nothing to think about but the roster.
 */
async function askCli({ prompt, options }: Ask) {
  const out = await run("claude", [
    "-p",
    prompt,
    "--system-prompt",
    instructions(options),
    "--output-format",
    "json",
    "--strict-mcp-config",
    "--disable-slash-commands",
  ]);

  const envelope = JSON.parse(out) as { result?: string; is_error?: boolean };
  if (!envelope.result)
    throw new Error(`No result from claude: ${out.slice(0, 200)}`);

  return readJson(envelope.result);
}

/** Reads a JSON body off a Node request. */
function body(request: {
  on: (event: string, listener: (chunk?: never) => void) => void;
}) {
  return new Promise<string>((resolve) => {
    let text = "";
    request.on("data", (chunk) => (text += chunk));
    request.on("end", () => resolve(text));
  });
}

/**
 * The route. Dev only -- it never runs in a built bundle, which is the point
 * of it holding the credentials.
 */
export function aiFilter(): Plugin {
  return {
    name: "ai-filter",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/ai-filter", (request, response, next) => {
        const send = (status: number, payload: unknown) => {
          response.statusCode = status;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify(payload));
        };

        /* A GET is the page asking which way in it has, so it can say so
           rather than leaving somebody wondering what answered them. */
        if (request.method === "GET") {
          engineInUse().then((engine) => send(200, { engine }));
          return;
        }

        if (request.method !== "POST") return next();

        void (async () => {
          try {
            const ask = JSON.parse(await body(request)) as Ask;
            const engine = await engineInUse();

            if (engine === "none") {
              send(503, {
                error:
                  "No Claude to ask: set ANTHROPIC_API_KEY in .env.local, or install the claude CLI.",
              });
              return;
            }

            const answer =
              engine === "api" ? await askApi(ask) : await askCli(ask);
            send(200, { engine, answer });
          } catch (error) {
            server.config.logger.error(`[ai-filter] ${String(error)}`);
            send(502, { error: String(error) });
          }
        })();
      });
    },
  };
}
