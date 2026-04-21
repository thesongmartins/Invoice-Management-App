import { useState } from "react";
import { useInvoices } from "../contexts/InvoiceContext";
import InvoiceCard from "../components/InvoiceCard";
import FilterDropdown from "../components/FilterDropdown";
import InvoiceForm from "../components/InvoiceForm";
import EmptyState from "../components/EmptyState";
import { Invoice, FilterStatus } from "../types";

export default function InvoiceList() {
  const {
    filteredInvoices,
    invoices,
    filterStatus,
    setFilter,
    addInvoice,
    isLoading,
  } = useInvoices();
  const [showForm, setShowForm] = useState(false);

  const handleSave = (invoice: Invoice) => {
    addInvoice(invoice);
  };

  const count = filteredInvoices.length;

  const countLabel = () => {
    if (invoices.length === 0) return "No invoices";
    if (filterStatus.length > 0) {
      return `${count} ${count === 1 ? "invoice" : "invoices"}`;
    }
    return `There are ${count} total ${count === 1 ? "invoice" : "invoices"}`;
  };

  return (
    <>
      <div className="max-w-[780px] mx-auto w-full">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-[-1px] text-[#0C0E16] dark:text-white mb-1">
              Invoices
            </h1>
            <p className="text-[#888EB0] dark:text-blue-muted text-[13px]">
              {countLabel()}
            </p>
          </div>

          <div className="flex items-center gap-6 md:gap-10">
            <FilterDropdown
              selected={filterStatus as FilterStatus[]}
              onChange={setFilter}
            />

            <button
              onClick={() => setShowForm(true)}
              className="
                flex items-center gap-4
                bg-purple hover:bg-purple-light
                text-white font-bold text-xs
                rounded-btn pl-2 pr-4 py-2
                transition-colors
              "
              aria-label="Create new invoice"
            >
              <span
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
                    fill="#7C5DFA"
                  />
                </svg>
              </span>
              <span className="hidden sm:inline">New Invoice</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>

        {/* Invoice list */}
        <main>
          {isLoading ? null : filteredInvoices.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="flex flex-col gap-4" aria-label="Invoice list">
              {filteredInvoices.map((invoice) => (
                <li key={invoice.id}>
                  <InvoiceCard invoice={invoice} />
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>

      {/* New invoice form */}
      {showForm && (
        <InvoiceForm onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
    </>
  );
}
