import { useState, type FormEvent } from "react";

import type { Location } from "@components/accounts";
import { useActiveAccount } from "@components/active-account";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@components/ui/field";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { toast } from "@components/ui/toast";

/**
 * Where a location can sit. The switcher groups locations by region, so this
 * is the field that decides which heading the new one lands under -- spelled
 * out, the way the headings read.
 */
const regionOptions = [
  {
    country: "Canada",
    regions: [
      "Alberta",
      "British Columbia",
      "Manitoba",
      "New Brunswick",
      "Newfoundland and Labrador",
      "Northwest Territories",
      "Nova Scotia",
      "Nunavut",
      "Ontario",
      "Prince Edward Island",
      "Quebec",
      "Saskatchewan",
      "Yukon",
    ],
  },
  {
    country: "United States",
    regions: [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ],
  },
];

/** Clocks, schedules and payroll all run on the location's own clock. */
const timeZones = [
  "Pacific Time (PT)",
  "Mountain Time (MT)",
  "Central Time (CT)",
  "Eastern Time (ET)",
  "Atlantic Time (AT)",
  "Newfoundland Time (NT)",
];

/**
 * The form, as its own component so closing the dialog unmounts it: the next
 * visit starts empty without anything having to reset it.
 */
function AddLocationForm({
  onAdded,
}: {
  onAdded?: (location: Location) => void;
}) {
  const { account, addLocation, select } = useActiveAccount();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  // A region the company already runs in, since that is where a new location
  // usually opens; every other province and state is still in the list.
  const [region, setRegion] = useState(
    account.locations[0]?.region ?? regionOptions[0].regions[0],
  );
  const [postalCode, setPostalCode] = useState("");
  const [timeZone, setTimeZone] = useState(timeZones[0]);

  /* Two locations with the same name are indistinguishable in the switcher,
     which is the only place most people ever pick one. */
  const taken = account.locations.some(
    (item) => item.name.toLowerCase() === name.trim().toLowerCase(),
  );
  const canSubmit = name.trim() !== "" && !taken;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const added = addLocation(account, {
      name: name.trim(),
      region,
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      timeZone,
    });

    // Point the app at what was just created: the next thing anyone does is
    // set the location up, and every page is scoped to the open location.
    select(account, added);
    onAdded?.(added);

    toast.add({
      type: "success",
      title: `${added.name} added to ${account.name}`,
      description:
        "The app is now pointed at it. Its staff, schedule and pay settings are in Settings.",
    });
  };

  return (
    <form className="grid gap-8" onSubmit={submit}>
      <FieldGroup>
        <Field data-invalid={taken || undefined}>
          <FieldLabel htmlFor="location-name">Location name</FieldLabel>
          <Input
            id="location-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Mount Pleasant"
            aria-invalid={taken || undefined}
          />
          <FieldDescription>
            {taken
              ? `${account.name} already runs a location called ${name.trim()}.`
              : "What staff and managers will see in the location switcher."}
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="location-address">Street address</FieldLabel>
          <Input
            id="location-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="1055 Main Street"
          />
        </Field>

        {/* The short fields pair up on anything wider than a phone. */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="location-city">City</FieldLabel>
            <Input
              id="location-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Vancouver"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="location-postal-code">
              Postal or ZIP code
            </FieldLabel>
            <Input
              id="location-postal-code"
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              placeholder="V5T 3E7"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="location-region">Province or state</FieldLabel>
            <Select
              value={region}
              onValueChange={(value) => setRegion(value as string)}
            >
              <SelectTrigger id="location-region" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map((group) => (
                  <SelectGroup key={group.country}>
                    <SelectLabel>{group.country}</SelectLabel>
                    {group.regions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              Groups the location in the switcher.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="location-time-zone">Time zone</FieldLabel>
            <Select
              value={timeZone}
              onValueChange={(value) => setTimeZone(value as string)}
            >
              <SelectTrigger id="location-time-zone" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>Shifts and clock-ins run on it.</FieldDescription>
          </Field>
        </div>
      </FieldGroup>

      <DialogFooter>
        {/* Base UI buttons are type="button" unless told otherwise, so Cancel
            cannot submit the form it sits in. */}
        <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
        <Button type="submit" disabled={!canSubmit}>
          Add location
        </Button>
      </DialogFooter>
    </form>
  );
}

/**
 * Opening a location under the company the app is pointed at. Controlled, so
 * the account switcher -- and anything else that offers "Add location" --
 * owns when it shows.
 */
export function AddLocationDialog({
  open,
  onOpenChange,
  onAdded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Runs after the location is created and opened, for anything the caller
      needs to tidy up -- closing the mobile sidebar behind the dialog. */
  onAdded?: (location: Location) => void;
}) {
  const { account } = useActiveAccount();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add location</DialogTitle>
          <DialogDescription>
            A new location for {account.name}. It starts with no staff and no
            schedule, and everything here can be changed later in Settings.
          </DialogDescription>
        </DialogHeader>

        <AddLocationForm
          onAdded={(location) => {
            onAdded?.(location);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
