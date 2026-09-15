import { RouterProvider } from "react-router";

import { ThemePanelProvider } from "@components/theme-panel";

import { AuthProvider } from "./auth";
import { router } from "./routes";

function App() {
  return (
    <ThemePanelProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemePanelProvider>
  );
}

export default App;
