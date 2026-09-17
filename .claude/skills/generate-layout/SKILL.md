---
name: generate-layout
description: Scaffold a screen in this app from the existing example layouts. Use when the user asks to generate, create, scaffold or lay out a screen, page or view — or to replace an existing screen's layout. Walks through target, layout and tabs, then writes the feature, route and nav entry.
user-invocable: true
---

# Generate a layout

Scaffold a screen from the layouts this repo already demonstrates, rather than
inventing one. Ask the questions below **before** writing anything, one
`AskUserQuestion` call per step so the answers can steer the next question.

## 1. Replace or add

Ask whether this is replacing an existing screen or adding a new one.

- **Replacing** → ask which screen. Offer the real candidates, read from the nav
  data rather than guessed: `sections` in `src/layouts/AppLayout.tsx`, `sections`
  in `src/layouts/SettingsLayout.tsx`, and `designSections` in
  `src/components/design-nav.ts`. Keep the existing route, component name and nav
  entry; only the component body is rewritten.
- **Adding** → ask for the nav section and the screen title. Section options come
  from the same nav data; a new section is a valid answer.

## 2. Layout

Ask which layout to generate, sourced from the example pages. Read the
directories before asking — the list below is what exists today, not a fixed
menu:

- `src/features/design/examples-temp/horizontal-tabs` — tabs across the top, the
  title above them, panels holding cards, stat rows and tables.
- `src/features/design/examples-temp/vertical-tabs` — a settings shape: tab
  column on the left, title and panels to the right.
- `src/features/design/examples/*` — the same two shapes with placeholder panels,
  for when the content is not the point.
- A plain page with no tabs — a title and content, like `src/features/dashboard`.

Offer high-fidelity (cards, tables, fields — realistic fixture data) or
placeholder panels (`PlaceholderContent` from `@features/design/example`) as part
of this answer.

## 3. Tabs

If the chosen layout has tabs, ask which tabs the screen needs — labels in
order. Derive each `value` from its label as a kebab-case slug. Do not invent a
tab set without asking.

## Then build it

Follow the repo's existing structure exactly; copy an example page and adapt it
rather than writing a screen from scratch.

1. **Feature** — `src/features/<slug>/<ComponentName>.tsx` plus an
   `index.ts` barrel (`export { Name } from "./Name";`). Settings screens live
   under `src/features/settings/<slug>/`, design pages under
   `src/features/design/<slug>/`.
2. **Route** — add the import and the `{ path, element }` entry to
   `src/routes.tsx`, inside the layout block that matches the section.
3. **Nav** — add `{ title, url, icon }` to the right section. App and settings
   screens take a `lucide-react` icon; design pages take none.
4. Use the project's tab components (`@components/ui/tab-horizontal`,
   `tab-vertical`, `tab-default`) and the spacing the examples use: `pt-6` on
   each panel for horizontal tabs, `gap-8` on the root for vertical.
5. Match the surrounding code — semicolons in `src/features` and `src/layouts`,
   `@components` / `@features` aliases, design tokens over raw colors.

Finish by running `npx tsc --noEmit`, `npx eslint <the files>` and
`npx prettier --write <the files>`, then tell the user the route to visit.
