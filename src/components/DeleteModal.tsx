import { useRef, useEffect } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface DeleteModalProps {
  invoiceId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({
  invoiceId,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-navy-medium rounded-card p-12 max-w-[480px] w-full"
      >
        <h2
          id="delete-modal-title"
          className="text-2xl font-bold text-[#0C0E16] dark:text-white mb-4 tracking-tight"
        >
          Confirm Deletion
        </h2>
        <p className="text-[#888EB0] dark:text-blue-muted text-[13px] leading-relaxed mb-6">
          Are you sure you want to delete invoice{" "}
          <strong className="text-[#888EB0] dark:text-white">
            #{invoiceId}
          </strong>
          ? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="
              px-6 py-4 rounded-btn font-bold text-[15px]
              bg-[#F9FAFE] dark:bg-navy-light
              text-[#7E88C3] dark:text-blue-gray
              hover:bg-[#DFE3F5] dark:hover:bg-navy
              transition-colors
            "
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="
              px-6 py-4 rounded-btn font-bold text-[15px]
              bg-[#EC5757] hover:bg-[#FF9797]
              text-white transition-colors
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
