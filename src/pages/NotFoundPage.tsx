import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("notFound.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t("notFound.description")}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          {t("notFound.backHome")}
        </Link>
      </div>
    </div>
  );
}
