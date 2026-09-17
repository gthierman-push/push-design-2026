import * as React from "react";

/**
 * Stub session state. There is no backend yet: signIn() just flips a flag,
 * and no route is gated on it — every page renders signed in or out.
 * Swap the internals for a real token check when there is an API to call.
 */
type AuthContextValue = {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      signIn: () => setIsAuthenticated(true),
      signOut: () => setIsAuthenticated(false),
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
