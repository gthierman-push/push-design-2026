/**
 * Every icon the app draws, in both sets it can wear.
 *
 * Nothing else imports `lucide-react` or `@phosphor-icons/react` directly:
 * components ask for `CheckIcon` here and get whichever library the theme
 * panel is pointed at, so the switch is one click rather than 50 files. The
 * table below is the whole mapping -- Lucide's name on the left, the nearest
 * Phosphor drawing on the right. The two libraries do not name things alike
 * (`ChevronDown` is a `CaretDown`, `Zap` is a `Lightning`), and a handful of
 * Lucide glyphs have no twin at all, so those take the closest reading of
 * what the icon is being used to say.
 */
import * as React from "react";
import * as Lucide from "lucide-react";
import * as Phosphor from "@phosphor-icons/react";

import { useIcons } from "@components/theme-provider";

/** What an icon accepts: the plain SVG props both libraries pass through. */
export type IconProps = React.ComponentProps<"svg">;

/** The shape nav tables and prop types refer to an icon by. */
export type IconComponent = React.FC<IconProps>;

/**
 * Pairs one drawing with the other. Phosphor is told the weight; Lucide has
 * only its single stroke, so it is handed the props untouched.
 */
function icon(
  lucide: React.ComponentType<Lucide.LucideProps>,
  phosphor: React.ComponentType<Phosphor.IconProps>,
): IconComponent {
  const Lucided = lucide;
  const Phosphored = phosphor;

  const Icon: IconComponent = (props) => {
    const { set, weight } = useIcons();
    return set === "phosphor" ? (
      <Phosphored weight={weight} {...props} />
    ) : (
      <Lucided {...props} />
    );
  };

  Icon.displayName = lucide.displayName ?? "Icon";
  return Icon;
}

/** The two sets, with one icon each so the picker can show the difference. */
export const iconSets = [
  { id: "lucide", label: "Lucide", sample: Lucide.SettingsIcon },
  { id: "phosphor", label: "Phosphor", sample: Phosphor.GearSix },
] as const;

export const ActivityIcon = icon(Lucide.ActivityIcon, Phosphor.Pulse);
export const AlarmClockIcon = icon(Lucide.AlarmClockIcon, Phosphor.Alarm);
export const ArrowDownIcon = icon(Lucide.ArrowDownIcon, Phosphor.ArrowDown);
export const ArrowLeftIcon = icon(Lucide.ArrowLeftIcon, Phosphor.ArrowLeft);
export const ArrowRightIcon = icon(Lucide.ArrowRightIcon, Phosphor.ArrowRight);
export const BadgeDollarSignIcon = icon(
  Lucide.BadgeDollarSignIcon,
  Phosphor.CurrencyCircleDollar,
);
export const BellIcon = icon(Lucide.BellIcon, Phosphor.Bell);
export const BookmarkIcon = icon(Lucide.BookmarkIcon, Phosphor.Bookmark);
export const BrainCircuitIcon = icon(Lucide.BrainCircuitIcon, Phosphor.Brain);
export const BriefcaseBusinessIcon = icon(
  Lucide.BriefcaseBusinessIcon,
  Phosphor.BriefcaseMetal,
);
export const BriefcaseIcon = icon(Lucide.BriefcaseIcon, Phosphor.Briefcase);
export const BuildingIcon = icon(Lucide.BuildingIcon, Phosphor.Building);
export const CalendarCheckIcon = icon(
  Lucide.CalendarCheckIcon,
  Phosphor.CalendarCheck,
);
export const CalendarDaysIcon = icon(
  Lucide.CalendarDaysIcon,
  Phosphor.CalendarDots,
);
export const CalendarIcon = icon(Lucide.CalendarIcon, Phosphor.Calendar);
export const CalendarOffIcon = icon(
  Lucide.CalendarOffIcon,
  Phosphor.CalendarSlash,
);
export const CalendarRangeIcon = icon(
  Lucide.CalendarRangeIcon,
  Phosphor.CalendarBlank,
);
// Phosphor has no calendar wearing a sync arrow; the arrows alone say it.
export const CalendarSyncIcon = icon(
  Lucide.CalendarSyncIcon,
  Phosphor.ArrowsClockwise,
);
export const ChartPieIcon = icon(Lucide.ChartPieIcon, Phosphor.ChartPie);
export const CheckIcon = icon(Lucide.CheckIcon, Phosphor.Check);
export const ChevronDownIcon = icon(Lucide.ChevronDownIcon, Phosphor.CaretDown);
export const ChevronLeftIcon = icon(Lucide.ChevronLeftIcon, Phosphor.CaretLeft);
export const ChevronRightIcon = icon(
  Lucide.ChevronRightIcon,
  Phosphor.CaretRight,
);
export const ChevronUpIcon = icon(Lucide.ChevronUpIcon, Phosphor.CaretUp);
export const ChevronsLeftIcon = icon(
  Lucide.ChevronsLeftIcon,
  Phosphor.CaretDoubleLeft,
);
export const ChevronsRightIcon = icon(
  Lucide.ChevronsRightIcon,
  Phosphor.CaretDoubleRight,
);
export const ChevronsUpDownIcon = icon(
  Lucide.ChevronsUpDownIcon,
  Phosphor.CaretUpDown,
);
export const CircleCheckIcon = icon(
  Lucide.CircleCheckIcon,
  Phosphor.CheckCircle,
);
export const CircleDashedIcon = icon(
  Lucide.CircleDashedIcon,
  Phosphor.CircleDashed,
);
export const CircleHelpIcon = icon(Lucide.CircleHelpIcon, Phosphor.Question);
// Phosphor's clipboards come blank or lined, so the ticked one is a ticked box.
export const ClipboardCheckIcon = icon(
  Lucide.ClipboardCheckIcon,
  Phosphor.CheckSquareOffset,
);
export const ClipboardListIcon = icon(
  Lucide.ClipboardListIcon,
  Phosphor.ClipboardText,
);
export const ClockIcon = icon(Lucide.ClockIcon, Phosphor.Clock);
export const CoffeeIcon = icon(Lucide.CoffeeIcon, Phosphor.Coffee);
export const CoinsIcon = icon(Lucide.CoinsIcon, Phosphor.Coins);
export const CopyIcon = icon(Lucide.CopyIcon, Phosphor.Copy);
export const CopyPlusIcon = icon(Lucide.CopyPlusIcon, Phosphor.CopySimple);
export const CornerDownRightIcon = icon(
  Lucide.CornerDownRightIcon,
  Phosphor.ArrowElbowDownRight,
);
export const DownloadIcon = icon(Lucide.DownloadIcon, Phosphor.DownloadSimple);
export const EllipsisIcon = icon(Lucide.EllipsisIcon, Phosphor.DotsThree);
export const FileTextIcon = icon(Lucide.FileTextIcon, Phosphor.FileText);
export const FilesIcon = icon(Lucide.FilesIcon, Phosphor.Files);
export const FlagIcon = icon(Lucide.FlagIcon, Phosphor.Flag);
export const FolderTreeIcon = icon(
  Lucide.FolderTreeIcon,
  Phosphor.TreeStructure,
);
export const GaugeIcon = icon(Lucide.GaugeIcon, Phosphor.Gauge);
export const HashIcon = icon(Lucide.HashIcon, Phosphor.Hash);
export const HeartHandshakeIcon = icon(
  Lucide.HeartHandshakeIcon,
  Phosphor.Handshake,
);
export const HistoryIcon = icon(
  Lucide.HistoryIcon,
  Phosphor.ClockCounterClockwise,
);
export const IdCardIcon = icon(Lucide.IdCardIcon, Phosphor.IdentificationCard);
export const InfoIcon = icon(Lucide.InfoIcon, Phosphor.Info);
export const KeyRoundIcon = icon(Lucide.KeyRoundIcon, Phosphor.Key);
export const LandmarkIcon = icon(Lucide.LandmarkIcon, Phosphor.Bank);
export const LayoutDashboardIcon = icon(
  Lucide.LayoutDashboardIcon,
  Phosphor.SquaresFour,
);
export const LayoutTemplateIcon = icon(
  Lucide.LayoutTemplateIcon,
  Phosphor.Layout,
);
export const ListChecksIcon = icon(Lucide.ListChecksIcon, Phosphor.ListChecks);
export const ListFilterIcon = icon(
  Lucide.ListFilterIcon,
  Phosphor.FunnelSimple,
);
export const Loader2Icon = icon(Lucide.Loader2Icon, Phosphor.CircleNotch);
export const LockIcon = icon(Lucide.LockIcon, Phosphor.Lock);
export const LogOutIcon = icon(Lucide.LogOutIcon, Phosphor.SignOut);
export const MailIcon = icon(Lucide.MailIcon, Phosphor.Envelope);
export const MapPinIcon = icon(Lucide.MapPinIcon, Phosphor.MapPin);
export const MapPinnedIcon = icon(Lucide.MapPinnedIcon, Phosphor.MapPinArea);
export const MegaphoneIcon = icon(Lucide.MegaphoneIcon, Phosphor.Megaphone);
export const MessagesSquareIcon = icon(
  Lucide.MessagesSquareIcon,
  Phosphor.Chats,
);
export const MinusIcon = icon(Lucide.MinusIcon, Phosphor.Minus);
export const MoonIcon = icon(Lucide.MoonIcon, Phosphor.Moon);
export const MoreHorizontalIcon = icon(
  Lucide.MoreHorizontalIcon,
  Phosphor.DotsThree,
);
export const NetworkIcon = icon(Lucide.NetworkIcon, Phosphor.Graph);
export const NotebookTextIcon = icon(
  Lucide.NotebookTextIcon,
  Phosphor.Notebook,
);
export const OctagonXIcon = icon(Lucide.OctagonXIcon, Phosphor.WarningOctagon);
export const PalmtreeIcon = icon(Lucide.PalmtreeIcon, Phosphor.TreePalm);
export const PanelLeftIcon = icon(Lucide.PanelLeftIcon, Phosphor.SidebarSimple);
export const PencilIcon = icon(Lucide.PencilIcon, Phosphor.PencilSimple);
export const PhoneIcon = icon(Lucide.PhoneIcon, Phosphor.Phone);
export const PlaneIcon = icon(Lucide.PlaneIcon, Phosphor.AirplaneTilt);
export const PlugIcon = icon(Lucide.PlugIcon, Phosphor.Plug);
export const PlusIcon = icon(Lucide.PlusIcon, Phosphor.Plus);
export const ReceiptTextIcon = icon(Lucide.ReceiptTextIcon, Phosphor.Receipt);
export const ScanFaceIcon = icon(Lucide.ScanFaceIcon, Phosphor.ScanSmiley);
export const SearchIcon = icon(Lucide.SearchIcon, Phosphor.MagnifyingGlass);
export const SettingsIcon = icon(Lucide.SettingsIcon, Phosphor.GearSix);
export const ShieldAlertIcon = icon(
  Lucide.ShieldAlertIcon,
  Phosphor.ShieldWarning,
);
export const ShieldCheckIcon = icon(
  Lucide.ShieldCheckIcon,
  Phosphor.ShieldCheck,
);
export const SlidersHorizontalIcon = icon(
  Lucide.SlidersHorizontalIcon,
  Phosphor.Sliders,
);
export const SunIcon = icon(Lucide.SunIcon, Phosphor.Sun);
export const SwatchBookIcon = icon(Lucide.SwatchBookIcon, Phosphor.Swatches);
export const TableIcon = icon(Lucide.TableIcon, Phosphor.Table);
export const TagIcon = icon(Lucide.TagIcon, Phosphor.Tag);
export const TagsIcon = icon(Lucide.TagsIcon, Phosphor.TagChevron);
export const Trash2Icon = icon(Lucide.Trash2Icon, Phosphor.Trash);
export const TreePalmIcon = icon(Lucide.TreePalmIcon, Phosphor.TreePalm);
export const TrendingDownIcon = icon(
  Lucide.TrendingDownIcon,
  Phosphor.TrendDown,
);
export const TrendingUpIcon = icon(Lucide.TrendingUpIcon, Phosphor.TrendUp);
export const TriangleAlertIcon = icon(
  Lucide.TriangleAlertIcon,
  Phosphor.Warning,
);
export const TrophyIcon = icon(Lucide.TrophyIcon, Phosphor.Trophy);
export const Undo2Icon = icon(Lucide.Undo2Icon, Phosphor.ArrowUUpLeft);
export const UploadIcon = icon(Lucide.UploadIcon, Phosphor.UploadSimple);
export const UserCogIcon = icon(Lucide.UserCogIcon, Phosphor.UserGear);
export const UserIcon = icon(Lucide.UserIcon, Phosphor.User);
export const UserPlusIcon = icon(Lucide.UserPlusIcon, Phosphor.UserPlus);
export const UserRoundCheckIcon = icon(
  Lucide.UserRoundCheckIcon,
  Phosphor.UserCheck,
);
export const UserRoundIcon = icon(Lucide.UserRoundIcon, Phosphor.User);
// Phosphor crosses nobody out; taking someone off a list is the same thought.
export const UserRoundXIcon = icon(Lucide.UserRoundXIcon, Phosphor.UserMinus);
export const UserSearchIcon = icon(Lucide.UserSearchIcon, Phosphor.UserFocus);
export const UsersIcon = icon(Lucide.UsersIcon, Phosphor.Users);
export const XIcon = icon(Lucide.XIcon, Phosphor.X);
export const ZapIcon = icon(Lucide.ZapIcon, Phosphor.Lightning);
