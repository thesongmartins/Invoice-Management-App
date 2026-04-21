import { useState, useCallback } from 'react'
import { InvoiceFormData, InvoiceItemFormData } from '../types'
import { validateEmail } from '../utils'

export interface FormErrors {
  senderStreet?: string
  senderCity?: string
  senderPostCode?: string
  senderCountry?: string
  clientName?: string
  clientEmail?: string
  clientStreet?: string
  clientCity?: string
  clientPostCode?: string
  clientCountry?: string
  createdAt?: string
  description?: string
  items?: string
  itemErrors?: Record<string, { name?: string; quantity?: string; price?: string }>
}

export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = useCallback(
    (formData: InvoiceFormData, isDraft: boolean): boolean => {
      if (isDraft) {
        setErrors({})
        return true
      }

      const newErrors: FormErrors = {}

      if (!formData.senderAddress.street.trim())
        newErrors.senderStreet = "can't be empty"
      if (!formData.senderAddress.city.trim())
        newErrors.senderCity = "can't be empty"
      if (!formData.senderAddress.postCode.trim())
        newErrors.senderPostCode = "can't be empty"
      if (!formData.senderAddress.country.trim())
        newErrors.senderCountry = "can't be empty"
      if (!formData.clientName.trim())
        newErrors.clientName = "can't be empty"
      if (!formData.clientEmail.trim()) {
        newErrors.clientEmail = "can't be empty"
      } else if (!validateEmail(formData.clientEmail)) {
        newErrors.clientEmail = 'must be a valid email'
      }
      if (!formData.clientAddress.street.trim())
        newErrors.clientStreet = "can't be empty"
      if (!formData.clientAddress.city.trim())
        newErrors.clientCity = "can't be empty"
      if (!formData.clientAddress.postCode.trim())
        newErrors.clientPostCode = "can't be empty"
      if (!formData.clientAddress.country.trim())
        newErrors.clientCountry = "can't be empty"
      if (!formData.createdAt)
        newErrors.createdAt = "can't be empty"
      if (!formData.description.trim())
        newErrors.description = "can't be empty"

      if (formData.items.length === 0) {
        newErrors.items = 'An item must be added'
      } else {
        const itemErrors: FormErrors['itemErrors'] = {}
        formData.items.forEach((item: InvoiceItemFormData) => {
          const errs: { name?: string; quantity?: string; price?: string } = {}
          if (!item.name.trim()) errs.name = "can't be empty"
          if (item.quantity <= 0) errs.quantity = 'must be > 0'
          if (item.price < 0) errs.price = 'must be ≥ 0'
          if (Object.keys(errs).length > 0) itemErrors[item.id] = errs
        })
        if (Object.keys(itemErrors).length > 0) newErrors.itemErrors = itemErrors
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    },
    []
  )

  const clearErrors = useCallback(() => setErrors({}), [])
  const clearFieldError = useCallback((field: keyof FormErrors) => {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  return { errors, validate, clearErrors, clearFieldError }
}
