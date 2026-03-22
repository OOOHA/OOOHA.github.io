import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  const sections = [
    { title: t("privacy.dataCollection.title"), body: t("privacy.dataCollection.body") },
    { title: t("privacy.inAppPurchases.title"), body: t("privacy.inAppPurchases.body") },
    { title: t("privacy.thirdParty.title"), body: t("privacy.thirdParty.body") },
    { title: t("privacy.analytics.title"), body: t("privacy.analytics.body") },
    { title: t("privacy.contact.title"), body: t("privacy.contact.body") },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          {t("privacy.title")}
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-12">
          {t("privacy.lastUpdated")}
        </p>

        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-12">
          {t("privacy.intro")}
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {section.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
