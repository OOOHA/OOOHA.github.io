import { Bug } from "lucide-react";
import { useTranslation } from "react-i18next";
import { buildIssueUrl } from "../../utils/github";

interface BugReportButtonProps {
  appLabels: string[];
}

export default function BugReportButton({ appLabels }: BugReportButtonProps) {
  const { t } = useTranslation();
  const url = buildIssueUrl({
    template: "bug_report.yml",
    labels: ["bug", ...appLabels],
  });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Bug className="w-5 h-5 text-red-600 dark:text-red-400" />
      </div>
      <div className="text-left">
        <div className="font-medium text-gray-900 dark:text-white text-sm">
          {t("feedback.bugReport")}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t("feedback.bugDescription")}
        </div>
      </div>
    </a>
  );
}
