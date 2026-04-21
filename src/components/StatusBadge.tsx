import { InvoiceStatus } from "../types";
import { getStatusLabel } from "../utils";

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const statusStyles: Record<InvoiceStatus, string> = {
  draft: "bg-[#F4F4F5] text-[#373B53] dark:bg-[#292C44] dark:text-[#DFE3FA]",
  pending: "bg-[#FF8F0026] text-[#FF8F00]",
  paid: "bg-[#33D69F26] text-[#33D69F]",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-badge px-4 py-2.5 text-[15px] font-bold min-w-[104px] justify-center ${statusStyles[status]}`}
    >
      <span className="w-2 h-2 rounded-full bg-current" aria-hidden="true" />
      {getStatusLabel(status)}
    </span>
  );
}
