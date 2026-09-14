import { Outlet } from "react-router";

/**
 * Mirrors the page.tsx shipped with the shadcn login-02 block: form centred
 * in the left column, full-bleed image on the right from lg up. The CLI
 * skips a block's page.tsx in a Vite project (no app router to put it in),
 * so this layout stands in for it. The block's top-left brand mark is
 * dropped -- the login form carries the Push logo itself.
 */
export function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
