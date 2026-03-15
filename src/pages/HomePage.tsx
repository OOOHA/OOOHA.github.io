import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { apps } from "../data/apps";
import ScrollReveal from "../components/common/ScrollReveal";
import AppIcon from "../components/common/AppIcon";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Apps Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-20 sm:pb-28">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.appsSection.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("home.appsSection.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {apps.map((app, index) => {
            return (
              <ScrollReveal key={app.id} delay={index * 0.15}>
                <Link
                  to={`/${app.id}`}
                  className="block p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                >
                  <AppIcon
                    iconPath={app.iconPath}
                    iconPathDark={app.iconPathDark}
                    fallbackIcon={app.icon}
                    gradient={app.gradient}
                    size="md"
                    className="mb-6 group-hover:scale-110 transition-transform"
                  />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t(app.nameKey)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                    {t(app.taglineKey)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                    style={{ color: app.color }}
                  >
                    {t("learnMore")}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
