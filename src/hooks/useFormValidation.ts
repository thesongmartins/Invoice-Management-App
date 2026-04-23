import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { InvoiceFormData, InvoiceItemFormData, FormErrors } from "../types";
import { validateEmail } from "../utils";

export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = useCallback(
    (formData: InvoiceFormData, isDraft: boolean): boolean => {
      if (isDraft) {
        setErrors({});
        return true;
      }

      const newErrors: FormErrors = {};

      if (!formData.senderAddress.street.trim())
        newErrors.senderStreet = "can't be empty";
      if (!formData.senderAddress.city.trim())
        newErrors.senderCity = "can't be empty";
      if (!formData.senderAddress.postCode.trim())
        newErrors.senderPostCode = "can't be empty";
      if (!formData.senderAddress.country.trim())
        newErrors.senderCountry = "can't be empty";
      if (!formData.clientName.trim()) newErrors.clientName = "can't be empty";
      if (!formData.clientEmail.trim()) {
        newErrors.clientEmail = "can't be empty";
      } else if (!validateEmail(formData.clientEmail)) {
        newErrors.clientEmail = "must be a valid email";
      }
      if (!formData.clientAddress.street.trim())
        newErrors.clientStreet = "can't be empty";
      if (!formData.clientAddress.city.trim())
        newErrors.clientCity = "can't be empty";
      if (!formData.clientAddress.postCode.trim())
        newErrors.clientPostCode = "can't be empty";
      if (!formData.clientAddress.country.trim())
        newErrors.clientCountry = "can't be empty";
      if (!formData.createdAt) newErrors.createdAt = "can't be empty";
      if (!formData.description.trim())
        newErrors.description = "can't be empty";

      if (formData.items.length === 0) {
        newErrors.items = "An item must be added";
      } else {
        const itemErrors: FormErrors["itemErrors"] = {};
        formData.items.forEach((item: InvoiceItemFormData) => {
          const errs: { name?: string; quantity?: string; price?: string } = {};
          if (!item.name.trim()) errs.name = "can't be empty";
          if (item.quantity <= 0) errs.quantity = "must be > 0";
          if (item.price < 0) errs.price = "must be ≥ 0";
          if (Object.keys(errs).length > 0) itemErrors[item.id] = errs;
        });
        if (Object.keys(itemErrors).length > 0)
          newErrors.itemErrors = itemErrors;
      }

      setErrors(newErrors);

      const hasErrors = Object.keys(newErrors).length > 0;

      if (hasErrors) {
        const firstErrorKey = Object.keys(newErrors)[0];
        const firstErrorId = getFirstErrorId(
          newErrors,
          firstErrorKey,
          formData,
        );
        scrollToError(firstErrorId);
        toast.error("Please fix all errors before submitting", {
          toastId: "form-validation-error", // prevents duplicate toasts on rapid clicks
        });
        return false;
      }

      return true;
    },
    [],
  );

  const clearErrors = useCallback(() => setErrors({}), []);
  const clearFieldError = useCallback((field: keyof FormErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return { errors, validate, clearErrors, clearFieldError };
}

function getFirstErrorId(
  errors: FormErrors,
  firstKey: string,
  formData: InvoiceFormData,
): string {
  const keyToId: Record<string, string> = {
    senderStreet: "senderStreet",
    senderCity: "senderCity",
    senderPostCode: "senderPostCode",
    senderCountry: "senderCountry",
    clientName: "clientName",
    clientEmail: "clientEmail",
    clientStreet: "clientStreet",
    clientCity: "clientCity",
    clientPostCode: "clientPostCode",
    clientCountry: "clientCountry",
    createdAt: "invoiceDate",
    description: "projectDesc",
    items: "addItemBtn",
    itemErrors: "",
  };

  if (firstKey === "itemErrors" && errors.itemErrors) {
    const firstItemId = formData.items.find(
      (item) => errors.itemErrors![item.id],
    )?.id;

    if (firstItemId) {
      const itemErr = errors.itemErrors[firstItemId];
      if (itemErr.name) return `itemName_${firstItemId}`;
      if (itemErr.quantity) return `itemQty_${firstItemId}`;
      if (itemErr.price) return `itemPrice_${firstItemId}`;
    }
  }

  return keyToId[firstKey] ?? "";
}

function scrollToError(elementId: string) {
  if (!elementId) return;
  setTimeout(() => {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  }, 50);
}
