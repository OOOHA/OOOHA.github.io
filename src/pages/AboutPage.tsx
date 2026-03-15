import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Github, Briefcase } from "lucide-react";
import { GITHUB_REPO_URL } from "../utils/constants";
import JobOfferForm from "../components/feedback/JobOfferForm";

export default function AboutPage() {
  const { t } = useTranslation();
  const [jobFormOpen, setJobFormOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
          {t("about.title")}
        </h1>

        <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>{t("about.education")}</p>
        </div>

        {/* Links */}
        <div className="mt-12 flex items-center gap-4">
          <a
            href={GITHUB_REPO_URL.replace("/OOOHA.github.io", "")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <button
            onClick={() => setJobFormOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors text-sm font-medium"
          >
            <Briefcase className="w-4 h-4" />
            {t("jobOffer.button")}
          </button>
        </div>
      </motion.div>

      <JobOfferForm
        isOpen={jobFormOpen}
        onClose={() => setJobFormOpen(false)}
      />
    </div>
  );
}
