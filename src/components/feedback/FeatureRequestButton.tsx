import { Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";
import { buildIssueUrl } from "../../utils/github";

interface FeatureRequestButtonProps {
  appLabels: string[];
}

export default function FeatureRequestButton({ appLabels }: FeatureRequestButtonProps) {
  const { t } = useTranslation();
  const url = buildIssueUrl({
    template: "feature_request.yml",
    labels: ["enhancement", ...appLabels],
  });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="text-left">
        <div className="font-medium text-gray-900 dark:text-white text-sm">
          {t("feedback.featureRequest")}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t("feedback.featureDescription")}
        </div>
      </div>
    </a>
  );
}
