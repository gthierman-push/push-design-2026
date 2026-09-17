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

Ask which layout to generate, sourced from the Page Layouts section of the
design system. Read those directories before asking — the list below is what
exists today, not a fixed menu:

- `src/features/design/examples-temp/horizontal-tabs` — tabs across the top, the
  title above them, panels holding cards, stat rows and tables.
- `src/features/design/examples-temp/vertical-tabs` — a settings shape: tab
  column on the left, title and panels to the right.
- `src/features/design/examples/*` — the same two shapes with placeholder panels,
  for when the content is not the point.
- A plain page with no tabs — a title and content, like `src/features/dashboard`.

The sidebar lists the first three under **Page Layouts** and **Page Layouts -
temp**; the directories are still named `examples` and `examples-temp`.

Offer high-fidelity (cards, tables, fields — realistic fixture data) or
placeholder panels (`PlaceholderContent` from `@features/design/example`) as part
of this answer.

## 3. Content width

Ask how wide the content area should be:

- **Full width** — no cap; the screen fills whatever the layout gives it.
- **`max-w-5xl`** (1024px) — the width the design system's example pages use.
- **Custom** — take the value the user gives, whether a Tailwind class
  (`max-w-3xl`), a pixel width or a rem width, and write it as
  `max-w-[<value>]` when no built-in class matches.

Apply it to the element that wraps the screen's content — the page's outermost
`div` for a plain or horizontal-tab page, the right-hand column for a vertical-
tab page, so the tab rail keeps its own width. Anything other than full width
also takes `w-full`, and `mx-auto` only if the user asks for it centered.

## 4. Tabs

If the chosen layout has tabs, ask which tabs the screen needs — labels in
order. Derive each `value` from its label as a kebab-case slug. Do not invent a
tab set without asking.

## 5. Buttons

Buttons always sit in a header action row beside the title — do not ask where
they go. Ask in two steps:

1. **Primary button** — the one main action, or none.
2. **Secondary buttons** — any others, labels in order, or none.

Use `Button` from `@components/ui/button`: the primary action is the `default`
variant, the secondary ones are `outline`, and anything that deletes is
`destructive`. The row is `<div className="flex items-center gap-2">` at the end
of the title row, secondary buttons first and the primary last, with the title's
wrapper set to `flex items-center justify-between`. An icon in a button is a
`lucide-react` icon marked `data-icon="inline-start"` or `"inline-end"`, which
tightens the padding on that side.

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
