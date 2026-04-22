import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Invoice,
  InvoiceFormData,
  InvoiceItemFormData,
  InvoiceStatus,
} from "../types";
import {
  formDataToInvoice,
  invoiceToFormData,
  getTodayString,
  calculateItemTotal,
  formatCurrency,
} from "../utils";
import { useFormValidation } from "../hooks/useFormValidation";
import { useFocusTrap } from "../hooks/useFocusTrap";
import FormField from "./FormField";
import DatePicker from "./DatePicker";
import CustomSelect from "./CustomSelect";

const PAYMENT_TERMS_OPTIONS = [
  { value: 1, label: "Net 1 Day" },
  { value: 7, label: "Net 7 Days" },
  { value: 14, label: "Net 14 Days" },
  { value: 30, label: "Net 30 Days" },
];

interface InvoiceFormProps {
  editingInvoice?: Invoice;
  onSave: (invoice: Invoice) => void;
  onClose: () => void;
}

function emptyItem(): InvoiceItemFormData {
  return { id: uuidv4(), name: "", quantity: 1, price: 0 };
}

function emptyFormData(): InvoiceFormData {
  return {
    senderAddress: { street: "", city: "", postCode: "", country: "" },
    clientName: "",
    clientEmail: "",
    clientAddress: { street: "", city: "", postCode: "", country: "" },
    createdAt: getTodayString(),
    paymentTerms: 30,
    description: "",
    items: [emptyItem()],
  };
}

export default function InvoiceForm({
  editingInvoice,
  onSave,
  onClose,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(() =>
    editingInvoice ? invoiceToFormData(editingInvoice) : emptyFormData(),
  );
  const { errors, validate, clearFieldError } = useFormValidation();
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, true);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const updateField = useCallback(
    <K extends keyof InvoiceFormData>(field: K, value: InvoiceFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const updateSenderAddress = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        senderAddress: { ...prev.senderAddress, [field]: value },
      }));
      clearFieldError(
        `sender${field.charAt(0).toUpperCase() + field.slice(1)}` as never,
      );
    },
    [clearFieldError],
  );

  const updateClientAddress = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        clientAddress: { ...prev.clientAddress, [field]: value },
      }));
      clearFieldError(
        `client${field.charAt(0).toUpperCase() + field.slice(1)}` as never,
      );
    },
    [clearFieldError],
  );

  const addItem = () => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  };

  const removeItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItemFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleSubmit = (status: InvoiceStatus) => {
    const isDraft = status === "draft";
    if (!validate(formData, isDraft)) return;

    const existingStatus = editingInvoice?.status;
    const finalStatus = existingStatus === "paid" ? "paid" : status;

    const invoice = formDataToInvoice(
      formData,
      finalStatus,
      editingInvoice?.id,
    );
    onSave(invoice);
    onClose();
  };

  const isEditing = Boolean(editingInvoice);
  const hasFormErrors = Object.keys(errors).length > 0;
  const hasItemListError = Boolean(errors.items);

  return (
    <div
      className="fixed top-[72px] left-0 right-0 bottom-0 lg:top-0 lg:left-[88px] z-[200] flex"
      role="dialog"
      aria-modal="true"
      aria-label={
        isEditing ? `Edit invoice #${editingInvoice!.id}` : "New invoice"
      }
    >
      {/* Panel */}
      <div
        ref={panelRef}
        className="
          relative bg-white dark:bg-navy
          w-full max-w-[616px] h-full overflow-y-auto
          pl-6 md:pl-14
          pr-6 md:pr-14
          pt-14
          z-10
        "
        style={{ animation: "slideIn 0.3s ease" }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        <h2 className="text-2xl font-bold tracking-tight text-navy dark:text-white mb-10">
          {isEditing ? (
            <>
              Edit{" "}
              <span className="text-blue-muted">
                #
                <span className="text-navy dark:text-white">
                  {editingInvoice!.id}
                </span>
              </span>
            </>
          ) : (
            "New Invoice"
          )}
        </h2>

        {/* Bill From */}
        <p className="text-[15px] font-bold text-[#7C5DFA] mb-6">Bill From</p>

        <div className="mb-6">
          <FormField
            id="senderStreet"
            label="Street Address"
            value={formData.senderAddress.street}
            onChange={(e) => updateSenderAddress("street", e.target.value)}
            error={errors.senderStreet}
            autoComplete="street-address"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
          <FormField
            id="senderCity"
            label="City"
            value={formData.senderAddress.city}
            onChange={(e) => updateSenderAddress("city", e.target.value)}
            error={errors.senderCity}
          />
          <FormField
            id="senderPostCode"
            label="Post Code"
            value={formData.senderAddress.postCode}
            onChange={(e) => updateSenderAddress("postCode", e.target.value)}
            error={errors.senderPostCode}
          />
          <div className="col-span-2 sm:col-span-1">
            <FormField
              id="senderCountry"
              label="Country"
              value={formData.senderAddress.country}
              onChange={(e) => updateSenderAddress("country", e.target.value)}
              error={errors.senderCountry}
            />
          </div>
        </div>

        {/* Bill To */}
        <p className="text-[15px] font-bold text-[#7C5DFA] mb-6">Bill To</p>

        <div className="mb-6">
          <FormField
            id="clientName"
            label="Client's Name"
            value={formData.clientName}
            onChange={(e) => {
              updateField("clientName", e.target.value);
              clearFieldError("clientName");
            }}
            error={errors.clientName}
            autoComplete="name"
          />
        </div>
        <div className="mb-6">
          <FormField
            id="clientEmail"
            label="Client's Email"
            type="email"
            placeholder="e.g. email@example.com"
            value={formData.clientEmail}
            onChange={(e) => {
              updateField("clientEmail", e.target.value);
              clearFieldError("clientEmail");
            }}
            error={errors.clientEmail}
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <FormField
            id="clientStreet"
            label="Street Address"
            value={formData.clientAddress.street}
            onChange={(e) => updateClientAddress("street", e.target.value)}
            error={errors.clientStreet}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
          <FormField
            id="clientCity"
            label="City"
            value={formData.clientAddress.city}
            onChange={(e) => updateClientAddress("city", e.target.value)}
            error={errors.clientCity}
          />
          <FormField
            id="clientPostCode"
            label="Post Code"
            value={formData.clientAddress.postCode}
            onChange={(e) => updateClientAddress("postCode", e.target.value)}
            error={errors.clientPostCode}
          />
          <div className="col-span-2 sm:col-span-1">
            <FormField
              id="clientCountry"
              label="Country"
              value={formData.clientAddress.country}
              onChange={(e) => updateClientAddress("country", e.target.value)}
              error={errors.clientCountry}
            />
          </div>
        </div>

        {/* Invoice Details — DatePicker + CustomSelect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <DatePicker
            id="invoiceDate"
            label="Invoice Date"
            value={formData.createdAt}
            onChange={(val) => {
              updateField("createdAt", val);
              clearFieldError("createdAt");
            }}
            error={errors.createdAt}
            disabled={isEditing}
          />
          <CustomSelect
            id="paymentTerms"
            label="Payment Terms"
            value={formData.paymentTerms}
            onChange={(val) => updateField("paymentTerms", val)}
            options={PAYMENT_TERMS_OPTIONS}
          />
        </div>
        <div className="mb-10">
          <FormField
            id="projectDesc"
            label="Project Description"
            placeholder="e.g. Graphic Design Service"
            value={formData.description}
            onChange={(e) => {
              updateField("description", e.target.value);
              clearFieldError("description");
            }}
            error={errors.description}
          />
        </div>

        {/* Item List */}
        <p className="text-[15px] font-bold text-[#777F98] dark:text-blue-muted mb-4">
          Item List
        </p>

        <div className="flex flex-col gap-4 mb-4">
          {formData.items.map((item) => {
            const itemErr = errors.itemErrors?.[item.id];
            const total = calculateItemTotal(item.quantity, item.price);
            return (
              <div
                key={item.id}
                className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-4 items-end"
              >
                {/* Item Name */}
                <div className="col-span-4 sm:col-span-1 flex flex-col gap-2.5">
                  <label
                    htmlFor={`itemName_${item.id}`}
                    className={`text-[13px] font-bold ${
                      itemErr?.name
                        ? "text-danger"
                        : "text-blue-soft dark:text-blue-muted"
                    }`}
                  >
                    Item Name
                  </label>
                  <input
                    id={`itemName_${item.id}`}
                    className={`w-full bg-white dark:bg-navy-light border rounded px-4 py-3.5 font-bold text-[13px] text-navy dark:text-white outline-none transition-colors ${
                      itemErr?.name
                        ? "border-danger"
                        : "border-blue-gray dark:border-navy-light hover:border-purple focus:border-purple"
                    }`}
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, "name", e.target.value)
                    }
                  />
                  {itemErr?.name && (
                    <span
                      className="text-[10px] text-danger font-medium"
                      role="alert"
                    >
                      {itemErr.name}
                    </span>
                  )}
                </div>

                {/* Qty */}
                <div className="flex flex-col gap-2.5">
                  <label
                    htmlFor={`itemQty_${item.id}`}
                    className={`text-[13px] font-bold ${
                      itemErr?.quantity
                        ? "text-danger"
                        : "text-blue-soft dark:text-blue-muted"
                    }`}
                  >
                    Qty.
                  </label>
                  <input
                    id={`itemQty_${item.id}`}
                    type="number"
                    min={1}
                    className={`w-full bg-white dark:bg-navy-light border rounded px-3 py-3.5 font-bold text-[13px] text-navy dark:text-white outline-none transition-colors ${
                      itemErr?.quantity
                        ? "border-danger"
                        : "border-blue-gray dark:border-navy-light hover:border-purple focus:border-purple"
                    }`}
                    value={item.quantity === 0 ? "" : item.quantity}
                    onChange={(e) => {
                      const raw = e.target.value;
                      updateItem(
                        item.id,
                        "quantity",
                        raw === "" ? 0 : Math.max(1, Number(raw)),
                      );
                    }}
                    onBlur={(e) => {
                      if (!e.target.value || Number(e.target.value) < 1) {
                        updateItem(item.id, "quantity", 1);
                      }
                    }}
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2.5">
                  <label
                    htmlFor={`itemPrice_${item.id}`}
                    className={`text-[13px] font-bold ${
                      itemErr?.price
                        ? "text-danger"
                        : "text-blue-soft dark:text-blue-muted"
                    }`}
                  >
                    Price
                  </label>
                  <input
                    id={`itemPrice_${item.id}`}
                    type="number"
                    min={0}
                    step={0.01}
                    className={`w-full bg-white dark:bg-navy-light border rounded px-4 py-3.5 font-bold text-[13px] text-navy dark:text-white outline-none transition-colors ${
                      itemErr?.price
                        ? "border-danger"
                        : "border-blue-gray dark:border-navy-light hover:border-purple focus:border-purple"
                    }`}
                    value={item.price === 0 ? "" : item.price}
                    onChange={(e) => {
                      const raw = e.target.value;
                      updateItem(
                        item.id,
                        "price",
                        raw === "" ? 0 : Math.max(0, Number(raw)),
                      );
                    }}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        updateItem(item.id, "price", 0);
                      }
                    }}
                  />
                </div>

                {/* Total + Delete */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[13px] font-bold text-blue-soft dark:text-blue-muted">
                    Total
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-[13px] text-blue-muted min-w-[60px]">
                      {formatCurrency(total)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-blue-muted hover:text-danger transition-colors p-1 shrink-0"
                      aria-label={`Remove item ${item.name || "unnamed"}`}
                    >
                      <svg
                        width="13"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="
            w-full py-4 rounded-btn font-bold text-[13px]
            bg-[#F9FAFE] dark:bg-navy-light
            text-blue-soft dark:text-blue-gray
            hover:bg-blue-gray dark:hover:bg-navy
            transition-colors mb-6
          "
        >
          + Add New Item
        </button>

        {/* Error summary */}
        {hasFormErrors && (
          <div className="mb-6" role="alert">
            <p className="text-danger text-[13px] font-medium">
              All fields must be added
            </p>
            {hasItemListError && (
              <p className="text-danger text-[13px] font-medium mt-1">
                An item must be added
              </p>
            )}
          </div>
        )}

        <div className="h-24" />
      </div>

      {/* Sticky footer */}
      <div
        className="
          fixed bottom-0 left-0 lg:left-[88px] z-[201]
          bg-white dark:bg-navy
          shadow-[0_-8px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.4)]
          pl-6 md:pl-14
          pr-6 md:pr-14
          py-5
          flex items-center
          w-full max-w-[616px]
        "
      >
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 rounded-btn font-bold text-[13px] bg-[#F9FAFE] dark:bg-navy-light text-blue-soft dark:text-blue-gray hover:bg-blue-gray dark:hover:bg-navy transition-colors"
            >
              Cancel
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() =>
                handleSubmit(
                  editingInvoice!.status === "draft" ? "draft" : "pending",
                )
              }
              className="px-6 py-4 rounded-btn font-bold text-[13px] bg-purple hover:bg-purple-light text-white transition-colors"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 rounded-btn font-bold text-[13px] bg-[#F9FAFE] dark:bg-[#F9FAFE] text-[#7E88C3] dark:text-[#7E88C3] hover:bg-blue-gray dark:hover:bg-[#373B53] transition-colors"
            >
              Discard
            </button>
            <div className="flex-1" />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                className="px-4 py-4 rounded-btn font-bold text-[13px] bg-[#373B53] hover:bg-[#373B53] hover:dark:bg-[#1E2139] text-blue-muted dark:text-[#DFE3FA] hover:text-blue-gray transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("pending")}
                className="px-4 py-4 rounded-btn font-bold text-[13px] bg-purple hover:bg-purple-light text-white transition-colors"
              >
                Save &amp; Send
              </button>
            </div>
          </>
        )}
      </div>

      {/* Overlay backdrop */}
      <div
        className="flex-1 bg-black/50 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
}
