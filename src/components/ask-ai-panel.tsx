import { SparklesIcon } from "lucide-react";

import type { RightPanelContent } from "@components/right-panel";
import { Button } from "@components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@components/ui/field";
import { Textarea } from "@components/ui/textarea";

const suggestions = [
  "Summarize this week's schedule",
  "Who is over 40 hours?",
  "Draft a shift-swap message",
];

function AskAi() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs font-medium">
          Suggestions
        </span>
        <div className="flex flex-col gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              className="h-auto justify-start whitespace-normal py-2 text-left"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="ask-ai-prompt">Ask anything</FieldLabel>
          <Textarea
            id="ask-ai-prompt"
            rows={4}
            placeholder="What would you like to know?"
          />
        </Field>
      </FieldGroup>

      <Button className="self-start">
        <SparklesIcon data-icon="inline-start" />
        Ask
      </Button>
    </div>
  );
}

export const askAiPanel: RightPanelContent = {
  title: "Ask A.I.",
  description: "Answers scoped to your workspace",
  children: <AskAi />,
};
