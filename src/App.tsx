import { RouterProvider } from "react-router";

import { ActiveAccountProvider } from "@components/active-account";
import { ThemePanel } from "@components/theme-panel";
import { ThemeProvider } from "@components/theme-provider";
import { Toaster } from "@components/ui/toast";

import { AuthProvider } from "./auth";
import { router } from "./routes";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Which company and location the app is pointed at, beside the
            session: the account switcher and the command palette both set
            it, and it outlives any one page. */}
        <ActiveAccountProvider>
          <RouterProvider router={router} />
        </ActiveAccountProvider>
      </AuthProvider>
      <ThemePanel />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
