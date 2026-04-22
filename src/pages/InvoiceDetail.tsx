import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInvoices } from "../contexts/InvoiceContext";
import StatusBadge from "../components/StatusBadge";
import DeleteModal from "../components/DeleteModal";
import InvoiceForm from "../components/InvoiceForm";
import { formatDate, formatCurrency } from "../utils";
import { Invoice } from "../types";

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoice, updateInvoice, deleteInvoice, markPaid, sendInvoice } =
    useInvoices();

  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const invoice = getInvoice(id!);

  if (!invoice) {
    return (
      <div className="max-w-[780px] mx-auto w-full text-center py-20">
        <p className="text-blue-soft dark:text-blue-muted text-sm">
          Invoice not found.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 text-purple font-bold text-xs hover:underline"
        >
          Go back to invoices
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    navigate("/");
  };

  const handleEdit = (updated: Invoice) => {
    updateInvoice(updated);
    setShowEdit(false);
  };

  const handleMarkPaid = () => markPaid(invoice.id);
  const handleSend = () => sendInvoice(invoice.id);

  return (
    <>
      <div className="max-w-[780px] mx-auto w-full">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-6 mb-8 font-bold text-[13px] text-[#0C0E16] dark:text-white hover:text-purple transition-colors group"
          aria-label="Go back to invoice list"
        >
          <svg
            width="7"
            height="10"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6 1L2 5l4 4"
              stroke="#7C5DFA"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          Go back
        </button>

        {/* Toolbar */}
        <div
          className="flex items-center justify-between bg-white dark:bg-navy-medium rounded-card px-6 md:px-8 py-5 shadow-card dark:shadow-none mb-6"
          role="toolbar"
          aria-label="Invoice actions"
        >
          <div className="flex items-center font-bold gap-4 text-[#858BB2] dark:text-blue-muted text-[13px]">
            <span>Status</span>
            <StatusBadge status={invoice.status} />
          </div>

          {/* Action buttons — hidden on mobile, shown in bottom bar */}
          <div className="hidden md:flex items-center gap-2">
            {invoice.status !== "paid" && (
              <button
                onClick={() => setShowEdit(true)}
                className="px-6 py-4 rounded-btn font-bold text-[15px] bg-[#F9FAFE] dark:bg-navy-light text-blue-soft dark:text-blue-gray hover:bg-[#DFE3FA] dark:hover:bg-[#FFFFFF] hover:dark:text-[#7E88C3] transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => setShowDelete(true)}
              className="px-6 py-4 rounded-btn font-bold text-[15px] bg-[#EC5757] hover:bg-[#FF9797] text-white transition-colors"
            >
              Delete
            </button>
            {invoice.status === "pending" && (
              <button
                onClick={handleMarkPaid}
                className="px-6 py-4 rounded-btn font-bold text-[15px] bg-purple hover:bg-[#9277FF] text-white transition-colors"
              >
                Mark as Paid
              </button>
            )}
            {invoice.status === "draft" && (
              <button
                onClick={handleSend}
                className="px-6 py-4 rounded-btn font-bold text-[15px] bg-purple hover:bg-[#9277FF] text-white transition-colors"
              >
                Send &amp; Publish
              </button>
            )}
          </div>
        </div>

        {/* Invoice body */}
        <article
          className="bg-white dark:bg-navy-medium rounded-card p-6 md:p-12 shadow-card dark:shadow-none"
          aria-label={`Invoice ${invoice.id} details`}
        >
          {/* ID + sender address */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-6 mb-10">
            <div>
              <p className="font-bold text-base mb-2 text-navy dark:text-white">
                <span className="text-[#7E88C3]">#</span>
                {invoice.id}
              </p>
              <p className="text-[#7E88C3] font-[500] dark:text-blue-muted text-[13px]">
                {invoice.description}
              </p>
            </div>
            <address className="text-[#7E88C3] font-[500] dark:text-blue-muted text-[13px] not-italic leading-relaxed sm:text-right">
              <p>{invoice.senderAddress.street}</p>
              <p>{invoice.senderAddress.city}</p>
              <p>{invoice.senderAddress.postCode}</p>
              <p>{invoice.senderAddress.country}</p>
            </address>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
            <div>
              <p className="text-[#7E88C3] font-[500] dark:text-blue-muted text-[13px] mb-3">
                Invoice Date
              </p>
              <p className="font-bold text-[#0C0E16] dark:text-white text-[15px]">
                {formatDate(invoice.createdAt)}
              </p>
              <p className="text-[#7E88C3] font-[500] dark:text-blue-muted text-[13px] mt-6 mb-3">
                Payment Due
              </p>
              <p className="font-bold text-[#0C0E16] dark:text-white text-[15px]">
                {formatDate(invoice.paymentDue)}
              </p>
            </div>

            <div>
              <p className="text-[#7E88C3] font-[500] dark:text-blue-muted text-[13px] mb-3">
                Bill To
              </p>
              <p className="font-bold text-[#0C0E16] dark:text-white text-[15px] mb-2">
                {invoice.clientName}
              </p>
              <address className="text-[#7E88C3] font-[500] dark:text-blue-muted text-[13px] not-italic leading-relaxed">
                <p>{invoice.clientAddress.street}</p>
                <p>{invoice.clientAddress.city}</p>
                <p>{invoice.clientAddress.postCode}</p>
                <p>{invoice.clientAddress.country}</p>
              </address>
            </div>

            <div className="col-span-2 md:col-span-1">
              <p className="text-[#7E88C3] font-[500] dark:text-blue-muted text-[13px] mb-3">
                Sent to
              </p>
              <p className="font-bold text-[#0C0E16] dark:text-white text-[15px] break-all">
                {invoice.clientEmail}
              </p>
            </div>
          </div>

          {/* Items table */}
          <div
            className="rounded-card overflow-hidden"
            role="table"
            aria-label="Invoice line items"
          >
            {/* Header */}
            <div
              className="bg-[#F9FAFE] dark:bg-navy-light px-6 md:px-8 py-4 grid grid-cols-[2fr_1fr_1fr_1fr]"
              role="row"
            >
              <span
                className="text-[#7E88C3] font-bold dark:text-blue-muted text-[13px]"
                role="columnheader"
              >
                Item Name
              </span>
              <span
                className="text-[#7E88C3] font-bold dark:text-blue-muted text-[13px] text-center"
                role="columnheader"
              >
                QTY.
              </span>
              <span
                className="text-[#7E88C3] font-bold dark:text-blue-muted text-[13px] text-right"
                role="columnheader"
              >
                Price
              </span>
              <span
                className="text-[#7E88C3] font-bold dark:text-blue-muted text-[13px] text-right"
                role="columnheader"
              >
                Total
              </span>
            </div>

            {/* Rows */}
            <div className="bg-[#F9FAFE] dark:bg-navy-light">
              {invoice.items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr] px-6 md:px-8 py-4 gap-2 items-center ${
                    idx < invoice.items.length - 1
                      ? "border-b border-[#DFE3FA] dark:border-navy-medium"
                      : ""
                  }`}
                  role="row"
                >
                  <span
                    className="font-bold text-[#0C0E16] dark:text-white text-[15px]"
                    role="cell"
                  >
                    {item.name}
                  </span>
                  <span
                    className="font-bold text-[#7E88C3] dark:text-white text-[15px] text-center"
                    role="cell"
                  >
                    {item.quantity}
                  </span>
                  <span
                    className="font-bold text-[#7E88C3] dark:text-white text-[15px] text-right"
                    role="cell"
                  >
                    {formatCurrency(item.price)}
                  </span>
                  <span
                    className="font-bold text-[#0C0E16] dark:text-white text-[15px] text-right"
                    role="cell"
                  >
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-[#373B53] dark:bg-navy rounded-b-card px-6 md:px-8 py-6 flex items-center justify-between">
              <span className="text-white font-bold dark:text-white text-[13px]">
                Amount Due
              </span>
              <span className="text-white font-bold text-2xl">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </article>
      </div>

      {/* Mobile action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-navy-medium px-6 py-5 flex items-center justify-center gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-50">
        {invoice.status !== "paid" && (
          <button
            onClick={() => setShowEdit(true)}
            className="px-10 py-4 gap-8 rounded-btn font-bold text-[15px] bg-[#F9FAFE] dark:bg-navy-light text-blue-soft dark:text-blue-gray hover:bg-[#DFE3FA] dark:hover:bg-[#FFFFFF] dark:hover:text-[#9277FF] transition-colors"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => setShowDelete(true)}
          className="px-10 py-4 rounded-btn font-bold text-[15px] bg-[#EC5757] hover:bg-[#FF9797] text-white transition-colors"
        >
          Delete
        </button>
        {invoice.status === "pending" && (
          <button
            onClick={handleMarkPaid}
            className="px-8 py-4 rounded-btn font-bold text-[15px] bg-purple hover:bg-[#9277FF] text-white transition-colors"
          >
            Mark as Paid
          </button>
        )}
        {invoice.status === "draft" && (
          <button
            onClick={handleSend}
            className="px-5 py-4 rounded-btn font-bold text-[15px] bg-purple hover:bg-purple-light text-white transition-colors"
          >
            Send
          </button>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDelete && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {/* Edit form */}
      {showEdit && (
        <InvoiceForm
          editingInvoice={invoice}
          onSave={handleEdit}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
}
