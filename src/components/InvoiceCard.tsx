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
        flex items-center bg-white dark:bg-navy-medium rounded-card px-6 py-4
        border border-transparent hover:border-purple transition-colors
        shadow-card dark:shadow-none cursor-pointer group
        focus:outline-none focus:border-purple
      "
      aria-label={`View invoice ${invoice.id}, ${invoice.clientName}, ${formatCurrency(invoice.total)}, due ${formatDate(invoice.paymentDue)}, status ${invoice.status}`}
    >
      {/* ID */}
      <span className="font-bold text-[15px] w-[80px] shrink-0 text-[#7C5DFA] dark:text-white">
        <span className="text-blue-soft">#</span>
        {invoice.id}
      </span>

      {/* Due date */}
      <span className="text-blue-soft dark:text-blue-gray text-[13px] font-semibold flex-1">
        Due {formatDate(invoice.paymentDue)}
      </span>

      {/* Client name */}
      <span className="text-blue-soft dark:text-blue-gray text-[13px] font-semibold flex-1 text-center hidden sm:block">
        {invoice.clientName}
      </span>

      {/* Amount */}
      <span className="font-bold text-[15px] flex-1 text-right mr-8 md:mr-10 text-navy dark:text-white">
        {formatCurrency(invoice.total)}
      </span>

      {/* Status */}
      <StatusBadge status={invoice.status} />

      {/* Arrow */}
      <span className="ml-4 hidden md:block text-purple" aria-hidden="true">
        <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" />
        </svg>
      </span>
    </Link>
  );
}
