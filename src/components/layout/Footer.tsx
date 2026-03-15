import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { GITHUB_REPO_URL } from "../../utils/constants";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200/50 dark:border-gray-800/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-center gap-6">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            GitHub
          </a>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <Link
            to="/about"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {t("footer.about")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
