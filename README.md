# React + TypeScript + Vite

## The A.I. filter on Employees

The Filter menu on the roster ends in **Filter with A.I.**, which turns a
sentence into conditions over the whole employee record -- permits,
certificates, pay, hours, reviews -- and shows them as ordinary chips you can
edit or drop.

Reading the prompt happens on the dev server (`src/server/ai-filter.ts`), which
takes the first of these it finds:

1. **An API key.** Put `ANTHROPIC_API_KEY=sk-ant-...` in `.env.local`, or run
   `ant auth login`. This is the path a deployed version would use, and the
   only one that survives `npm run build`.
2. **The `claude` CLI**, if it is installed and signed in. Nothing to set up,
   nothing to bill -- it runs on the Claude subscription already on the
   machine. About four seconds a question, and local only.
3. **Neither**, in which case the page reads the prompt itself. It knows the
   shapes the examples in the dialog use and says so plainly when a question
   is past it.

What the model may answer with is generated from the field list in
`src/features/employees/query.ts`, so adding a field there teaches the filter
about it without touching the prompt or the UI. Everything that comes back is
validated against that same list before it reaches the table.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
