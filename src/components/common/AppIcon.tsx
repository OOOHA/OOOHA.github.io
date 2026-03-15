import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface AppIconProps {
  iconPath?: string;
  iconPathDark?: string;
  fallbackIcon: LucideIcon;
  gradient: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-12 h-12 rounded-xl",
  md: "w-16 h-16 rounded-2xl",
  lg: "w-20 h-20 rounded-3xl",
};

const iconSizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

export default function AppIcon({ iconPath, iconPathDark, fallbackIcon: FallbackIcon, gradient, size = "md", className = "" }: AppIconProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const { theme } = useTheme();

  // Choose icon based on theme: dark icon if available and in dark mode, otherwise default
  const currentIconPath = theme === "dark" && iconPathDark ? iconPathDark : iconPath;

  if (currentIconPath && !imgFailed) {
    return (
      <img
        src={currentIconPath}
        alt=""
        onError={() => setImgFailed(true)}
        className={`${sizeClasses[size]} object-cover shadow-lg ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${className}`}>
      <FallbackIcon className={`${iconSizeClasses[size]} text-white`} />
    </div>
  );
}
