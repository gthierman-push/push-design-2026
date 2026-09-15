/**
 * The CSS custom properties the theme panel can edit, plus the colour maths
 * needed to show them in a native colour picker.
 *
 * Values in `style.css` are authored as `oklch()`, so that is what we read,
 * write and copy back out. `<input type="color">` only speaks hex, so every
 * swatch converts on the way in and out.
 */

export type ThemeMode = "light" | "dark";

/** A parsed colour token: oklch components plus alpha (0-1). */
export type Oklch = { l: number; c: number; h: number; alpha: number };

export const colorGroups = [
  {
    label: "Surfaces",
    tokens: [
      { name: "--background", label: "Background" },
      { name: "--foreground", label: "Foreground" },
      { name: "--card", label: "Card" },
      { name: "--card-foreground", label: "Card foreground" },
      { name: "--popover", label: "Popover" },
      { name: "--popover-foreground", label: "Popover foreground" },
    ],
  },
  {
    label: "Brand",
    tokens: [
      { name: "--primary", label: "Primary" },
      { name: "--primary-foreground", label: "Primary foreground" },
      { name: "--primary-alt", label: "Primary alt" },
      { name: "--primary-alt-foreground", label: "Primary alt foreground" },
      { name: "--secondary", label: "Secondary" },
      { name: "--secondary-foreground", label: "Secondary foreground" },
      { name: "--accent", label: "Accent" },
      { name: "--accent-foreground", label: "Accent foreground" },
      { name: "--muted", label: "Muted" },
      { name: "--muted-foreground", label: "Muted foreground" },
    ],
  },
  {
    label: "Controls",
    tokens: [
      { name: "--border", label: "Border" },
      { name: "--input", label: "Input" },
      { name: "--ring", label: "Ring" },
      { name: "--destructive", label: "Destructive" },
    ],
  },
  {
    label: "Sidebar",
    tokens: [
      { name: "--sidebar", label: "Sidebar" },
      { name: "--sidebar-foreground", label: "Sidebar foreground" },
      { name: "--sidebar-primary", label: "Sidebar primary" },
      {
        name: "--sidebar-primary-foreground",
        label: "Sidebar primary foreground",
      },
      { name: "--sidebar-accent", label: "Sidebar accent" },
      {
        name: "--sidebar-accent-foreground",
        label: "Sidebar accent foreground",
      },
      { name: "--sidebar-border", label: "Sidebar border" },
      { name: "--sidebar-ring", label: "Sidebar ring" },
    ],
  },
  {
    label: "Charts",
    tokens: [
      { name: "--chart-1", label: "Chart 1" },
      { name: "--chart-2", label: "Chart 2" },
      { name: "--chart-3", label: "Chart 3" },
      { name: "--chart-4", label: "Chart 4" },
      { name: "--chart-5", label: "Chart 5" },
    ],
  },
] as const;

/** `--radius` drives every `--radius-*` step, so it gets its own control. */
export const RADIUS_TOKEN = "--radius";

export const colorTokenNames = colorGroups.flatMap((group) =>
  group.tokens.map((token) => token.name as string),
);

export const themeTokenNames = [...colorTokenNames, RADIUS_TOKEN];

/* -------------------------------------------------------------------------
 * oklch <-> sRGB
 * Björn Ottosson's Oklab matrices, with the usual sRGB transfer function.
 * ---------------------------------------------------------------------- */

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

function gammaEncode(channel: number) {
  return channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
}

function gammaDecode(channel: number) {
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

export function oklchToHex({ l, c, h }: Oklch) {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const lms = [
    l + 0.3963377774 * a + 0.2158037573 * b,
    l - 0.1055613458 * a - 0.0638541728 * b,
    l - 0.0894841775 * a - 1.291485548 * b,
  ].map((value) => value ** 3);

  const [long, medium, short] = lms;
  const rgb = [
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  ];

  return `#${rgb
    .map((channel) => {
      const byte = Math.round(clamp(gammaEncode(channel)) * 255);
      return byte.toString(16).padStart(2, "0");
    })
    .join("")}`;
}

export function hexToOklch(hex: string, alpha = 1): Oklch {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;

  const [r, g, b] = [0, 2, 4].map((offset) =>
    gammaDecode(parseInt(full.slice(offset, offset + 2), 16) / 255),
  );

  const [long, medium, short] = [
    0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b,
    0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
    0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b,
  ].map(Math.cbrt);

  const lightness =
    0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short;
  const a = 1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short;
  const bComponent =
    0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short;

  const chroma = Math.hypot(a, bComponent);
  const hue = chroma < 1e-6 ? 0 : (Math.atan2(bComponent, a) * 180) / Math.PI;

  return {
    l: lightness,
    c: chroma,
    h: hue < 0 ? hue + 360 : hue,
    alpha,
  };
}

/** Parses the `oklch(...)` and `#rrggbb` forms that appear in `style.css`. */
export function parseColor(input: string): Oklch | null {
  const value = input.trim();
  if (!value) return null;

  if (value.startsWith("#")) return hexToOklch(value);

  const match = value.match(/^oklch\(([^)]+)\)$/i);
  if (!match) return null;

  const [components, alphaPart] = match[1].split("/");
  const [l, c, h] = components.trim().split(/\s+/);
  if (l === undefined || c === undefined || h === undefined) return null;

  const percent = (raw: string) =>
    raw.endsWith("%") ? Number(raw.slice(0, -1)) / 100 : Number(raw);

  return {
    l: percent(l),
    c: Number(c),
    h: Number(h),
    alpha: alphaPart ? percent(alphaPart.trim()) : 1,
  };
}

const round = (value: number, places: number) =>
  Number(value.toFixed(places)).toString();

export function formatColor({ l, c, h, alpha }: Oklch) {
  const base = `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 3)}`;
  return alpha >= 1 ? `${base})` : `${base} / ${round(alpha * 100, 1)}%)`;
}
