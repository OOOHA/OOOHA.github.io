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

const MAX_ATTACHMENT_SIZE = 50 * 1024;
const ATTACHMENT_EXTENSIONS = [".log", ".txt", ".json", ".crash", ".md", ".csv"];
const ATTACHMENT_ACCEPT = ATTACHMENT_EXTENSIONS.join(",");
const ATTACHMENT_TYPES_LABEL = ATTACHMENT_EXTENSIONS.join(", ");
const ATTACHMENT_CODE_FENCE = "````";

function isSupportedAttachment(fileName: string) {
  const normalizedName = fileName.toLowerCase();
  return ATTACHMENT_EXTENSIONS.some((extension) => normalizedName.endsWith(extension));
}

function sanitizeAttachmentName(fileName: string) {
  return Array.from(fileName, (character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint < 32 || codePoint === 127 || character === "`" ? " " : character;
  })
    .join("")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 255) || "attachment";
}

function formatAttachment(
  type: FeedbackType,
  fileName: string,
  content: string,
) {
  const heading = type === "bug" ? "Log" : "Attachment";
  const safeFileName = sanitizeAttachmentName(fileName);
  const safeContent = content.replace(/^( {0,3})(`{4,})/gm, "    $1$2");

  return `### ${heading}\n\n**File:** \`${safeFileName}\`\n\n${ATTACHMENT_CODE_FENCE}text\n${safeContent}\n${ATTACHMENT_CODE_FENCE}`;
}

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
  const [attachmentContent, setAttachmentContent] = useState("");
  const [attachmentFileName, setAttachmentFileName] = useState("");
  const [attachmentError, setAttachmentError] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [issueUrl, setIssueUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAttachmentContent("");
    setAttachmentFileName("");
    setAttachmentError("");
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

    if (!isSupportedAttachment(file.name)) {
      setAttachmentError(t("feedback.attachmentUnsupported"));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_ATTACHMENT_SIZE) {
      setAttachmentError(t("feedback.attachmentTooLarge"));
      e.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      setAttachmentContent(text);
      setAttachmentFileName(file.name);
      setAttachmentError("");
    } catch {
      setAttachmentError(t("feedback.attachmentReadError"));
      e.target.value = "";
    }
  };

  const removeAttachment = () => {
    setAttachmentContent("");
    setAttachmentFileName("");
    setAttachmentError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    let fullDescription = description.trim();
    if (attachmentFileName) {
      fullDescription += `\n\n${formatAttachment(type, attachmentFileName, attachmentContent)}`;
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
                type="button"
                onClick={handleClose}
                aria-label={t("feedback.formClose")}
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
                  <div className="mt-6 flex flex-col gap-3">
                    {issueUrl && (
                      <a
                        href={issueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border-2 font-medium text-sm transition-all hover:opacity-80"
                        style={{ borderColor: color, color }}
                      >
                        {t("feedback.viewOnGithub")}
                      </a>
                    )}
                    <button
                      onClick={handleClose}
                      className="px-6 py-2.5 rounded-xl text-white font-medium text-sm transition-opacity hover:opacity-90"
                      style={{ backgroundColor: color }}
                    >
                      {t("feedback.formClose")}
                    </button>
                  </div>
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

                  {/* Optional text attachment for bug reports and feature requests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("feedback.attachmentLabel")}{" "}
                      <span className="text-gray-400 dark:text-gray-500 font-normal">
                        ({t("feedback.attachmentOptional")})
                      </span>
                    </label>
                    {attachmentFileName ? (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                          {attachmentFileName}
                        </span>
                        <button
                          type="button"
                          onClick={removeAttachment}
                          aria-label={t("feedback.attachmentRemove")}
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
                        {t("feedback.attachmentSelect")}
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ATTACHMENT_ACCEPT}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                      {t("feedback.attachmentHint", { types: ATTACHMENT_TYPES_LABEL })}
                    </p>
                    {attachmentError && (
                      <p
                        role="alert"
                        className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {attachmentError}
                      </p>
                    )}
                  </div>

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
