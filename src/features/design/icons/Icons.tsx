import * as AppIcons from "@components/icons";
import { IconPicker } from "@components/theme-panel";
import { useTheme } from "@components/theme-provider";
import { DesignPage, Example } from "@features/design/example";

/**
 * Everything `@components/icons` publishes, which is every icon the app is
 * allowed to draw. Reading the module rather than listing the names again
 * means an icon added there turns up here on its own.
 */
const roster = Object.entries(AppIcons)
  .filter((entry): entry is [string, AppIcons.IconComponent] =>
    entry[0].endsWith("Icon"),
  )
  .sort(([a], [b]) => a.localeCompare(b));

const sizes = [
  { label: "12px", className: "size-3" },
  { label: "14px", className: "size-3.5" },
  { label: "16px", className: "size-4" },
  { label: "20px", className: "size-5" },
  { label: "24px", className: "size-6" },
];

export function Icons() {
  const { icons } = useTheme();

  return (
    <DesignPage title="Icons">
      <Example
        title="The set"
        description="Two libraries are installed, and the whole app wears one of them at a
          time. Lucide draws with an even 2px stroke; Phosphor draws the same
          ideas a little rounder and offers six weights, from thin up to a
          solid fill. Switching here is the same switch as the one in the theme
          panel — press t anywhere to reach it."
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-56">
            <IconPicker />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              AppIcons.CalendarCheckIcon,
              AppIcons.UsersIcon,
              AppIcons.ClockIcon,
              AppIcons.SearchIcon,
              AppIcons.BellIcon,
              AppIcons.SettingsIcon,
            ].map((Icon, index) => (
              <Icon key={index} className="size-8" />
            ))}
          </div>
        </div>
      </Example>

      <Example
        title="Sizes"
        description="Icons are sized by class, never by a size prop, so a button or a badge
          can set the size for whatever is dropped inside it. 16px is the
          default an icon takes when nothing says otherwise."
      >
        <div className="flex flex-wrap items-end justify-center gap-10">
          {sizes.map((size) => (
            <div key={size.label} className="flex flex-col items-center gap-2">
              <AppIcons.CalendarCheckIcon className={size.className} />
              <span className="text-muted-foreground font-mono text-[11px]">
                {size.label}
              </span>
            </div>
          ))}
        </div>
      </Example>

      <Example
        title={`Every icon (${roster.length})`}
        description={`The names are Lucide's, whichever set is showing — importing
          CheckIcon from @components/icons gets you the ${icons.set} drawing of
          it. Anything the app needs that isn't here gets added to that module,
          in both sets, rather than imported from a library directly.`}
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2">
          {roster.map(([name, Icon]) => (
            <div
              key={name}
              className="hover:bg-muted flex flex-col items-center gap-2 rounded-md p-3 text-center"
            >
              <Icon className="size-5" />
              <span
                className="text-muted-foreground w-full truncate font-mono text-[10px]"
                title={name}
              >
                {name.replace(/Icon$/, "")}
              </span>
            </div>
          ))}
        </div>
      </Example>
    </DesignPage>
  );
}
