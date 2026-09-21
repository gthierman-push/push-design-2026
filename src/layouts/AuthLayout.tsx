import { Outlet } from "react-router";

import { AuthShowcase } from "@components/auth-showcase";

/**
 * Follows the two-column shape of the shadcn login-02 block: form centred in
 * the left column, a full-height panel on the right from lg up. The CLI skips
 * a block's page.tsx in a Vite project (no app router to put it in), so this
 * layout stands in for it. The block's brand mark is dropped -- the login form
 * carries the Push logo itself -- and its placeholder photo gives way to a
 * product shot on a primary-alt field.
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
      <div className="bg-primary-alt hidden items-center justify-center p-10 lg:flex">
        <AuthShowcase />
      </div>
    </div>
  );
}
