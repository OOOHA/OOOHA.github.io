import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Bug, Lightbulb } from "lucide-react";
import type { AppData } from "../data/apps";
import AppIcon from "../components/common/AppIcon";
import FeatureCard from "../components/common/FeatureCard";
import ScrollReveal from "../components/common/ScrollReveal";
import FeedbackForm from "../components/feedback/FeedbackForm";
import { GITHUB_REPO_URL } from "../utils/constants";

interface AppPageProps {
  app: AppData;
}

export default function AppPage({ app }: AppPageProps) {
  const { t } = useTranslation();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"bug" | "feature">("bug");

  const openBugReport = () => {
    setFeedbackType("bug");
    setFeedbackOpen(true);
  };

  const openFeatureRequest = () => {
    setFeedbackType("feature");
    setFeedbackOpen(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            background: `radial-gradient(ellipse at center top, ${app.color}, transparent 70%)`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <AppIcon
              iconPath={app.iconPath}
              iconPathDark={app.iconPathDark}
              fallbackIcon={app.icon}
              gradient={app.gradient}
              size="lg"
              className="mx-auto mb-8 shadow-xl"
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {t(app.nameKey)}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              {t(app.taglineKey)}
            </p>
            {app.appStoreUrl && (
              <a
                href={app.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-8"
              >
                <img
                  src="/icons/app-store-badge.svg"
                  alt={t("appStore")}
                  className="h-12 mx-auto hover:opacity-80 transition-opacity"
                />
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <ScrollReveal>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 leading-relaxed">
            {t(`${app.id === "map-memory" ? "mapMemory" : app.id}.description`)}
          </p>
        </ScrollReveal>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("features")}
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {app.features.map((feature, index) => (
            <FeatureCard
              key={feature.titleKey}
              icon={feature.icon}
              title={t(feature.titleKey)}
              description={t(feature.descriptionKey)}
              color={app.color}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Usage Guide */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("guide")}
          </h2>
        </ScrollReveal>
        <div className="space-y-6">
          {app.guideSteps.map((stepKey, index) => (
            <ScrollReveal key={stepKey} delay={index * 0.1}>
              <div className="flex gap-5 items-start p-6 rounded-2xl bg-gray-50 dark:bg-gray-900">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: app.color }}
                >
                  {index + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1.5">
                  {t(stepKey)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Feedback */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 pb-24">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {t("feedback.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{t("feedback.subtitle")}</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          {/* Two direct entry buttons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={openBugReport}
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
            </button>
            <button
              onClick={openFeatureRequest}
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
            </button>
          </div>

          {/* No account needed + GitHub fallback */}
          <div className="text-center mt-4 space-y-1">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t("feedback.formNoAccount")}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              <a
                href={`${GITHUB_REPO_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {t("feedback.preferGithub")}
              </a>
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Feedback Modal */}
      <FeedbackForm
        appId={app.id}
        appName={t(app.nameKey)}
        color={app.color}
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        defaultType={feedbackType}
      />
    </div>
  );
}
