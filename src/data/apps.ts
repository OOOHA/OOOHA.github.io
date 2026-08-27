import {
  Filter,
  Gauge,
  Languages,
  LayoutDashboard,
  MapPin,
  Minimize2,
  Music,
  ReceiptText,
  Settings,
  Shield,
  ShieldCheck,
  ScrollText,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AppFeature {
  titleKey: string;
  descriptionKey: string;
  icon: LucideIcon;
}

export interface AppData {
  id: string;
  nameKey: string;
  taglineKey: string;
  descriptionKey: string;
  color: string;
  colorLight: string;
  gradient: string;
  icon: LucideIcon;
  // App Store URL — when set, shows the "Download on the App Store" badge
  appStoreUrl?: string;
  // Path to custom app icon in public/icons/ (e.g. "/icons/mozii.png")
  // Falls back to Lucide icon if not provided or image fails to load
  iconPath?: string;
  // Optional dark mode variant of the icon
  iconPathDark?: string;
  features: AppFeature[];
  guideSteps: string[];
  issueLabels: string[];
}

// App definitions
// Translation keys reference: src/i18n/locales/{lang}/common.json
// To add a new app: add entry here + add translations in all locale files
export const apps: AppData[] = [
  {
    id: "mozii",
    nameKey: "mozii.name",             // → locales/{lang}/common.json → mozii.name
    taglineKey: "mozii.tagline",       // → locales/{lang}/common.json → mozii.tagline
    descriptionKey: "mozii.description",
    color: "var(--color-mozii)",
    colorLight: "var(--color-mozii-light)",
    gradient: "from-violet-500 to-purple-600",
    icon: Music,
    appStoreUrl: "https://apps.apple.com/us/app/mozii-local-music-player/id6759807227",
    iconPath: "/icons/mozii-light.png",
    iconPathDark: "/icons/mozii-dark.png",
    features: [
      { titleKey: "mozii.features.playback.title", descriptionKey: "mozii.features.playback.description", icon: Languages },
      { titleKey: "mozii.features.library.title", descriptionKey: "mozii.features.library.description", icon: Minimize2 },
      { titleKey: "mozii.features.ui.title", descriptionKey: "mozii.features.ui.description", icon: Settings },
    ],
    guideSteps: [
      "mozii.guide.step1",
      "mozii.guide.step2",
      "mozii.guide.step3",
    ],
    issueLabels: ["mozii"],
  },
  {
    id: "map-memory",
    nameKey: "mapMemory.name",
    taglineKey: "mapMemory.tagline",
    descriptionKey: "mapMemory.description",
    color: "var(--color-mapmemory)",
    colorLight: "var(--color-mapmemory-light)",
    gradient: "from-sky-500 to-cyan-500",
    icon: MapPin,
    appStoreUrl: "https://apps.apple.com/us/app/map-memory-map-timeline/id6759832315",
    iconPath: "/icons/map-memory-light.png",
    iconPathDark: "/icons/map-memory-dark.png",
    features: [
      { titleKey: "mapMemory.features.timeline.title", descriptionKey: "mapMemory.features.timeline.description", icon: MapPin },
      { titleKey: "mapMemory.features.map.title", descriptionKey: "mapMemory.features.map.description", icon: MapPin },
      { titleKey: "mapMemory.features.privacy.title", descriptionKey: "mapMemory.features.privacy.description", icon: MapPin },
    ],
    guideSteps: [
      "mapMemory.guide.step1",
      "mapMemory.guide.step2",
      "mapMemory.guide.step3",
    ],
    issueLabels: ["map-memory"],
  },
  {
    id: "gphones",
    nameKey: "gphones.name",
    taglineKey: "gphones.tagline",
    descriptionKey: "gphones.description",
    color: "var(--color-gphones)",
    colorLight: "var(--color-gphones-light)",
    gradient: "from-emerald-500 to-teal-500",
    icon: Gauge,
    appStoreUrl: "https://apps.apple.com/us/app/gphones/id6760122780",
    iconPath: "/icons/gphones-light.png",
    iconPathDark: "/icons/gphones-dark.png",
    features: [
      { titleKey: "gphones.features.speed.title", descriptionKey: "gphones.features.speed.description", icon: Gauge },
      { titleKey: "gphones.features.tracking.title", descriptionKey: "gphones.features.tracking.description", icon: Gauge },
      { titleKey: "gphones.features.history.title", descriptionKey: "gphones.features.history.description", icon: Gauge },
    ],
    guideSteps: [
      "gphones.guide.step1",
      "gphones.guide.step2",
      "gphones.guide.step3",
    ],
    issueLabels: ["gphones"],
  },
  {
    id: "adguard-dns",
    nameKey: "adguardDns.name",
    taglineKey: "adguardDns.tagline",
    descriptionKey: "adguardDns.description",
    color: "var(--color-adguard)",
    colorLight: "var(--color-adguard-light)",
    gradient: "from-blue-400 to-blue-600",
    icon: Shield,
    appStoreUrl: "https://apps.apple.com/us/app/agd-remote/id6760930980",
    iconPath: "/icons/AdGuardDNSDashboard_Light.png",
    iconPathDark: "/icons/AdGuardDNSDashboard_Dark.png",
    features: [
      { titleKey: "adguardDns.features.dashboard.title", descriptionKey: "adguardDns.features.dashboard.description", icon: LayoutDashboard },
      { titleKey: "adguardDns.features.queryLog.title", descriptionKey: "adguardDns.features.queryLog.description", icon: ScrollText },
      { titleKey: "adguardDns.features.filters.title", descriptionKey: "adguardDns.features.filters.description", icon: Filter },
    ],
    guideSteps: [
      "adguardDns.guide.step1",
      "adguardDns.guide.step2",
      "adguardDns.guide.step3",
    ],
    issueLabels: ["AGD Remote"],
  },
  {
    id: "money",
    nameKey: "money.name",
    taglineKey: "money.tagline",
    descriptionKey: "money.description",
    color: "var(--color-money)",
    colorLight: "var(--color-money-light)",
    gradient: "from-indigo-500 to-violet-600",
    icon: Wallet,
    iconPath: "/icons/money-light.png",
    iconPathDark: "/icons/money-dark.png",
    features: [
      { titleKey: "money.features.privacy.title", descriptionKey: "money.features.privacy.description", icon: ShieldCheck },
      { titleKey: "money.features.collaboration.title", descriptionKey: "money.features.collaboration.description", icon: Users },
      { titleKey: "money.features.tracking.title", descriptionKey: "money.features.tracking.description", icon: ReceiptText },
    ],
    guideSteps: [
      "money.guide.step1",
      "money.guide.step2",
      "money.guide.step3",
    ],
    issueLabels: ["Money"],
  },
];

export function getAppById(id: string): AppData | undefined {
  return apps.find((app) => app.id === id);
}
