import {
  CalendarOffIcon,
  CircleCheckIcon,
  InfoIcon,
  LockIcon,
  TriangleAlertIcon,
} from "@components/icons";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@components/ui/alert";
import { Button } from "@components/ui/button";
import { DesignPage, Example } from "@features/design/example";

export function AlertPage() {
  return (
    <DesignPage title="Alert">
      <Example
        title="Variants"
        description="Two of them, and both keep the card's background and border. Default
          states a fact about the screen it sits on, its description in muted
          grey; destructive turns the title red and takes the description with
          it at 90%, so an error reads as serious without the whole row going
          red. Neither is a toast — an alert stays where it is and waits to be
          read."
      >
        <div className="flex w-full flex-col gap-3">
          <Alert>
            <AlertTitle>Payroll closes Friday at 5pm</AlertTitle>
            <AlertDescription>
              Timesheets left unapproved after that go onto the next run.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Three timesheets are missing a punch</AlertTitle>
            <AlertDescription>
              Payroll can't be submitted until each one has a clock-out.
            </AlertDescription>
          </Alert>
        </div>
      </Example>

      <Example
        title="With an icon"
        description="The two-column grid only appears when an svg is a direct child of the
          Alert, so the icon can't be wrapped. It spans both rows at 16px and is
          nudged half a step down to sit level with the title's cap height.
          Wrapping it in a div collapses the alert back to one column and the
          icon lands above the text."
      >
        <div className="flex w-full flex-col gap-3">
          <Alert>
            <InfoIcon />
            <AlertTitle>This schedule hasn't been published</AlertTitle>
            <AlertDescription>
              Nobody sees it until you publish, so draft shifts are safe to
              move.
            </AlertDescription>
          </Alert>
          <Alert>
            <CircleCheckIcon />
            <AlertTitle>Onboarding is complete</AlertTitle>
            <AlertDescription>
              Every form is signed and the record is ready for payroll.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <TriangleAlertIcon />
            <AlertTitle>Two shifts overlap on Tuesday</AlertTitle>
            <AlertDescription>
              Hana is on the floor twice between 2pm and 4pm.
            </AlertDescription>
          </Alert>
        </div>
      </Example>

      <Example
        title="Title only"
        description="The description is optional, and without it the alert is a single line
          36px tall. Worth reaching for when the sentence is short enough to be
          its own heading — a second line that only restates the first is wasted
          room."
      >
        <div className="flex w-full flex-col gap-3">
          <Alert>
            <AlertTitle>Draft saved a moment ago</AlertTitle>
          </Alert>
          <Alert>
            <CalendarOffIcon />
            <AlertTitle>No shifts fall in this date range</AlertTitle>
          </Alert>
        </div>
      </Example>

      <Example
        title="With an action"
        description="AlertAction pins a control to the top-right corner, and the Alert
          reserves 72px of right padding the moment one is present, so the text
          wraps before it reaches the button. Anything wider than that needs its
          own padding — the Performance prompt pushes to pr-32 to clear an
          Upgrade button."
      >
        <div className="flex w-full flex-col gap-3">
          <Alert>
            <AlertTitle>Six time-off requests are waiting on you</AlertTitle>
            <AlertDescription>
              The oldest has been open since Monday.
            </AlertDescription>
            <AlertAction>
              <Button size="xs" variant="outline">
                Review
              </Button>
            </AlertAction>
          </Alert>
          <Alert>
            <InfoIcon />
            <AlertTitle>Your clock settings changed yesterday</AlertTitle>
            <AlertDescription>
              Rounding is now to the nearest five minutes.
            </AlertDescription>
            <AlertAction>
              <Button size="xs" variant="ghost">
                Undo
              </Button>
            </AlertAction>
          </Alert>
        </div>
      </Example>

      <Example
        title="An icon in a tile"
        description="A prompt that has to carry weight can sit its icon in a 32px tile. The
          grid still wants a direct svg, so the tile is padding on the icon
          itself rather than a wrapper around it. Both the icon and the action
          are topped out against a one-line title, so a title that runs to two
          needs each of them centred against the pair instead."
      >
        <Alert className="pr-32 *:[svg]:translate-y-0 *:[svg]:self-center">
          <LockIcon className="bg-muted size-8 rounded-lg p-2" />
          <AlertTitle>
            You've reached your maximum of three free performance reviews
          </AlertTitle>
          <AlertDescription>
            Upgrade to run as many review cycles as your team needs.
          </AlertDescription>
          <AlertAction className="top-1/2 -translate-y-1/2">
            <Button size="sm">Upgrade</Button>
          </AlertAction>
        </Alert>
      </Example>

      <Example
        title="Links in the text"
        description="A link in either the title or the description comes underlined at a
          3px offset and settles on the foreground colour on hover, so it reads
          as part of the sentence rather than a button someone forgot to style.
          It's the
          lightest way to send a person on from an alert, and it doesn't take
          the corner that AlertAction wants."
      >
        <div className="flex w-full flex-col gap-3">
          <Alert>
            <InfoIcon />
            <AlertTitle>
              Statutory holiday pay is set per <a href="#">province</a>
            </AlertTitle>
            <AlertDescription>
              British Columbia is using the default. Check the{" "}
              <a href="#">labour guide</a> if this crew works across a border.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <TriangleAlertIcon />
            <AlertTitle>Two employees have no pay rate</AlertTitle>
            <AlertDescription>
              Set one on <a href="#">their profiles</a> before the run closes.
            </AlertDescription>
          </Alert>
        </div>
      </Example>
    </DesignPage>
  );
}
