import { Music, MapPin, Gauge, Languages, Minimize2, Settings } from "lucide-react";
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
    color: "var(--color-mozii)",
    colorLight: "var(--color-mozii-light)",
    gradient: "from-violet-500 to-purple-600",
    icon: Music,
    iconPath: "/icons/mozii.png",
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
    color: "var(--color-mapmemory)",
    colorLight: "var(--color-mapmemory-light)",
    gradient: "from-blue-500 to-cyan-500",
    icon: MapPin,
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
    color: "var(--color-gphones)",
    colorLight: "var(--color-gphones-light)",
    gradient: "from-emerald-500 to-teal-500",
    icon: Gauge,
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
];

export function getAppById(id: string): AppData | undefined {
  return apps.find((app) => app.id === id);
}
