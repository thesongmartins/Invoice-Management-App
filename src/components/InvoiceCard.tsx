import { Link } from "react-router-dom";
import { Invoice } from "../types";
import { formatDate, formatCurrency } from "../utils";
import StatusBadge from "./StatusBadge";

interface InvoiceCardProps {
  invoice: Invoice;
}

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    <Link
      to={`/invoices/${invoice.id}`}
      className="
        grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr_1fr_auto_auto_auto]
        items-center gap-x-3 md:gap-x-4
        bg-white dark:bg-navy-medium rounded-card
        px-4 sm:px-6 py-4 md:py-5
        border border-transparent hover:border-purple transition-colors
        shadow-card dark:shadow-none cursor-pointer
        focus:outline-none focus:border-purple
      "
      aria-label={`View invoice ${invoice.id}, ${invoice.clientName}, ${formatCurrency(invoice.total)}, due ${formatDate(invoice.paymentDue)}, status ${invoice.status}`}
    >
      {/* ID */}
      <span className="font-bold text-[12px] md:text-[15px] w-[60px] md:w-[80px] shrink-0">
        <span className="text-blue-soft">#</span>
        <span className="text-navy dark:text-white">{invoice.id}</span>
      </span>

      {/* Due date  */}
      <span className="text-blue-soft dark:text-blue-gray text-[11px] md:text-[13px] font-semibold truncate">
        Due {formatDate(invoice.paymentDue)}
      </span>

      {/* Client name  */}
      <span className="text-blue-soft dark:text-blue-gray text-[11px] md:text-[13px] font-semibold hidden md:block truncate">
        {invoice.clientName}
      </span>

      {/* Amount */}
      <span className="font-bold text-[13px] md:text-[15px] text-right text-navy dark:text-white shrink-0">
        {formatCurrency(invoice.total)}
      </span>

      {/* Status */}
      <StatusBadge status={invoice.status} />

      {/* Arrow */}
      <span className="hidden md:block text-purple shrink-0" aria-hidden="true">
        <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 1l4 4-4 4"
            stroke="#7C5DFA"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
