import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Delete", type = "danger" }) {
  const isDanger = type === "danger";

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all active:scale-95 shadow-lg ${
          isDanger ? "bg-red-500 hover:bg-red-600 shadow-red-200" : "bg-primary hover:bg-slate-800 shadow-slate-200"
        }`}
      >
        {confirmLabel}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full shrink-0 ${isDanger ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}>
          <AlertTriangle size={24} />
        </div>
        <div className="flex-1">
          <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
