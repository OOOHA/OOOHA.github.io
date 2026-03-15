import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WORKER_URL } from "../../utils/constants";

interface JobOfferFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function JobOfferForm({ isOpen, onClose }: JobOfferFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [workType, setWorkType] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const resetForm = () => {
    setEmail("");
    setName("");
    setCompany("");
    setPosition("");
    setWorkType("");
    setMessage("");
    setStatus("idle");
    setErrorMsg("");
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "job-offer",
          email: email.trim(),
          name: name.trim() || undefined,
          company: company.trim() || undefined,
          position: position.trim() || undefined,
          workType: workType || undefined,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error || t("jobOffer.error"));
      }
    } catch {
      setStatus("error");
      setErrorMsg(t("jobOffer.error"));
    }
  };

  const accentColor = "#6366f1"; // indigo

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

  return (
    <AnimatePresence onExitComplete={resetForm}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
              style={{ backgroundColor: accentColor }}
            >
              <h3 className="text-lg font-semibold">{t("jobOffer.title")}</h3>
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
                    {t("jobOffer.success")}
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: accentColor }}
                  >
                    {t("jobOffer.close")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email (required) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t("jobOffer.email")} *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("jobOffer.emailPlaceholder")}
                      required
                      maxLength={200}
                      className={inputClass}
                    />
                  </div>

                  {/* Name (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t("jobOffer.name")}{" "}
                      <span className="text-gray-400 dark:text-gray-500 font-normal">
                        ({t("jobOffer.optional")})
                      </span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("jobOffer.namePlaceholder")}
                      maxLength={100}
                      className={inputClass}
                    />
                  </div>

                  {/* Company (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t("jobOffer.company")}{" "}
                      <span className="text-gray-400 dark:text-gray-500 font-normal">
                        ({t("jobOffer.optional")})
                      </span>
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={t("jobOffer.companyPlaceholder")}
                      maxLength={100}
                      className={inputClass}
                    />
                  </div>

                  {/* Position + Work Type row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {t("jobOffer.position")}{" "}
                        <span className="text-gray-400 dark:text-gray-500 font-normal">
                          ({t("jobOffer.optional")})
                        </span>
                      </label>
                      <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder={t("jobOffer.positionPlaceholder")}
                        maxLength={100}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {t("jobOffer.workType")}{" "}
                        <span className="text-gray-400 dark:text-gray-500 font-normal">
                          ({t("jobOffer.optional")})
                        </span>
                      </label>
                      <select
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                        className={inputClass}
                      >
                        <option value="">—</option>
                        <option value="full-time">
                          {t("jobOffer.workTypeFullTime")}
                        </option>
                        <option value="part-time">
                          {t("jobOffer.workTypePartTime")}
                        </option>
                        <option value="contract">
                          {t("jobOffer.workTypeContract")}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Message (required) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t("jobOffer.message")} *
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("jobOffer.messagePlaceholder")}
                      maxLength={5000}
                      required
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
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
                    disabled={
                      status === "submitting" ||
                      !email.trim() ||
                      !message.trim()
                    }
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: accentColor }}
                  >
                    {status === "submitting" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("jobOffer.submitting")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t("jobOffer.submit")}
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
