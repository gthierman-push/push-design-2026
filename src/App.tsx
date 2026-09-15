import { RouterProvider } from "react-router";

import { ThemePanel } from "@components/theme-panel";
import { ThemeProvider } from "@components/theme-provider";

import { AuthProvider } from "./auth";
import { router } from "./routes";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ThemePanel />
    </ThemeProvider>
  );
}

export default App;
