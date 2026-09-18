import * as React from "react";
import { useNavigate } from "react-router";
import { SearchIcon } from "lucide-react";

import { footerNavigation, home, sections } from "@layouts/app-nav";
import { sections as settingsSections } from "@layouts/settings-nav";
import { Button } from "@components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import { Kbd, KbdGroup } from "@components/ui/kbd";

/**
 * Every page ⌘K can reach, in the order it lists them. Settings groups keep
 * their own label so a search for "time off" tells the two pages apart.
 */
const groups = [
  { label: "Go to", items: [home, ...footerNavigation] },
  ...sections,
  ...settingsSections.map((section) => ({
    label: `Settings · ${section.label}`,
    items: section.items,
  })),
];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-muted-foreground w-44 justify-start font-normal"
        onClick={() => setOpen(true)}
      >
        <SearchIcon data-icon="inline-start" />
        Search pages
        <KbdGroup className="ml-auto">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search pages"
        description="Search for a page to jump to"
      >
        <Command>
          <CommandInput placeholder="Search pages..." />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.url}
                    value={`${item.title} ${group.label}`}
                    onSelect={() => {
                      setOpen(false);
                      navigate(item.url);
                    }}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
