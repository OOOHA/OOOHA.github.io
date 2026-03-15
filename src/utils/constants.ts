export const REPO_OWNER = "OOOHA";
export const REPO_NAME = "OOOHA.github.io";
export const GITHUB_REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

// Cloudflare Worker URL for feedback form submissions
// After deploying the worker, replace this with your actual worker URL
export const WORKER_URL = "https://oooha-feedback.bigd1ck.workers.dev";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "zh-CN", label: "简体中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
] as const;
