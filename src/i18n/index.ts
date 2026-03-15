import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/common.json";
import zhTW from "./locales/zh-TW/common.json";
import zhCN from "./locales/zh-CN/common.json";
import ja from "./locales/ja/common.json";
import ko from "./locales/ko/common.json";
import de from "./locales/de/common.json";
import fr from "./locales/fr/common.json";
import es from "./locales/es/common.json";
import ru from "./locales/ru/common.json";
import ar from "./locales/ar/common.json";

const resources = {
  en: { translation: en },
  "zh-TW": { translation: zhTW },
  "zh-CN": { translation: zhCN },
  ja: { translation: ja },
  ko: { translation: ko },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  ru: { translation: ru },
  ar: { translation: ar },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "zh-TW", "zh-CN", "ja", "ko", "de", "fr", "es", "ru", "ar"],
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
