import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X, Send, CheckCircle, AlertCircle, Bug, Lightbulb, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WORKER_URL } from "../../utils/constants";

interface FeedbackFormProps {
  appId: string;
  appName: string;
  color: string;
  isOpen: boolean;
  onClose: () => void;
  defaultType: "bug" | "feature";
}

type FeedbackType = "bug" | "feature";
type FormStatus = "idle" | "submitting" | "success" | "error";

const MAX_LOG_SIZE = 50 * 1024; // 50KB

export default function FeedbackForm({
  appId,
  appName,
  color,
  isOpen,
  onClose,
  defaultType,
}: FeedbackFormProps) {
  const { t } = useTranslation();
  const [type, setType] = useState<FeedbackType>(defaultType);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [logContent, setLogContent] = useState("");
  const [logFileName, setLogFileName] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [issueUrl, setIssueUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLogContent("");
    setLogFileName("");
    setStatus("idle");
    setIssueUrl("");
    setErrorMsg("");
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  // Sync defaultType when modal opens with a different type
  const handleOpen = () => {
    setType(defaultType);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_LOG_SIZE) {
      setErrorMsg(t("feedback.logTooLarge"));
      return;
    }

    try {
      const text = await file.text();
      setLogContent(text);
      setLogFileName(file.name);
      setErrorMsg("");
    } catch {
      setErrorMsg(t("feedback.logReadError"));
    }
  };

  const removeLog = () => {
    setLogContent("");
    setLogFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    // Build full description with log appended
    let fullDescription = description.trim();
    if (logContent) {
      fullDescription += `\n\n### Log (${logFileName})\n\`\`\`\n${logContent}\n\`\`\``;
    }

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app: appId,
          type,
          title: title.trim(),
          description: fullDescription,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setIssueUrl(data.issueUrl || "");
      } else {
        setStatus("error");
        setErrorMsg(data.error || t("feedback.formError"));
      }
    } catch {
      setStatus("error");
      setErrorMsg(t("feedback.formError"));
    }
  };

  return (
    <AnimatePresence onExitComplete={resetForm}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationStart={handleOpen}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between text-white flex-shrink-0"
              style={{ backgroundColor: color }}
            >
              <h3 className="text-lg font-semibold">
                {t("feedback.title")} — {appName}
              </h3>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {status === "success" ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t("feedback.formSuccess")}
                  </p>
                  {issueUrl && (
                    <a
                      href={issueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline hover:opacity-80 transition-opacity"
                      style={{ color }}
                    >
                      View on GitHub
                    </a>
                  )}
                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: color }}
                  >
                    {t("feedback.formClose")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Type selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("feedback.formType")}
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setType("bug")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                          type === "bug"
                            ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <Bug className="w-4 h-4" />
                        {t("feedback.formTypeBug")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setType("feature")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                          type === "feature"
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <Lightbulb className="w-4 h-4" />
                        {t("feedback.formTypeFeature")}
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("feedback.formTitle")}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("feedback.formTitlePlaceholder")}
                      maxLength={200}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ "--tw-ring-color": color } as React.CSSProperties}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("feedback.formDescription")}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t("feedback.formDescriptionPlaceholder")}
                      maxLength={5000}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                      style={{ "--tw-ring-color": color } as React.CSSProperties}
                    />
                  </div>

                  {/* Log file upload (bug reports only) */}
                  {type === "bug" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("feedback.logAttachment")}{" "}
                        <span className="text-gray-400 dark:text-gray-500 font-normal">
                          ({t("feedback.logOptional")})
                        </span>
                      </label>
                      {logFileName ? (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                            {logFileName}
                          </span>
                          <button
                            type="button"
                            onClick={removeLog}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                        >
                          <Paperclip className="w-4 h-4" />
                          {t("feedback.logSelect")}
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".log,.txt,.json,.crash"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                        {t("feedback.logHint")}
                      </p>
                    </div>
                  )}

                  {/* Error message */}
                  {status === "error" && (
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "submitting" || !title.trim() || !description.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: color }}
                  >
                    {status === "submitting" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("feedback.formSubmitting")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t("feedback.formSubmit")}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
