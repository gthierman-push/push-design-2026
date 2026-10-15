import { NavLink, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { useActiveAccount } from "@components/active-account";
import { Button } from "@components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@components/ui/empty";

import { employeeFor } from "./roster";

/** The way back to the list, above whatever the page turns out to be. */
function BackToPeople() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 self-start"
      render={<NavLink to="/employees" />}
    >
      <ArrowLeftIcon data-icon="inline-start" />
      People
    </Button>
  );
}

/**
 * One person's profile. For now it says who you clicked on and nothing else --
 * the page exists so the rows have somewhere to go, and the sections fill in
 * from here.
 */
export function EmployeeProfile() {
  const { account } = useActiveAccount();
  const { id } = useParams();

  const employee = id ? employeeFor(account, id) : undefined;

  /* An id that matches nobody is a link to someone this company does not
     employ -- a switched account, or a profile that has since gone. */
  if (!employee) {
    return (
      <div className="flex flex-col gap-6">
        <BackToPeople />
        <Empty className="border-border rounded-xl border border-dashed">
          <EmptyHeader>
            <EmptyTitle>No such employee</EmptyTitle>
            <EmptyDescription>
              Nobody on {account.name}'s roster has this profile.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <BackToPeople />
      <h1 className="text-2xl font-semibold tracking-tight">
        {employee.name}
      </h1>
    </div>
  );
}
