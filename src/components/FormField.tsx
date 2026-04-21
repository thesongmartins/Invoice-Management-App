import { InputHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react'

interface BaseProps {
  label: string
  error?: string
  id: string
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { as?: 'input' }
type SelectProps = BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { as: 'select'; children: React.ReactNode }

type FormFieldProps = InputProps | SelectProps

const inputClass = (hasError: boolean) =>
  `w-full bg-white dark:bg-navy-light border rounded px-5 py-3.5
  font-bold text-xs text-navy dark:text-white outline-none
  transition-colors cursor-pointer
  ${
    hasError
      ? 'border-danger'
      : 'border-blue-gray dark:border-navy-light hover:border-purple focus:border-purple'
  }`

const FormField = forwardRef<HTMLInputElement | HTMLSelectElement, FormFieldProps>(
  ({ label, error, id, ...props }, _ref) => {
    const hasError = Boolean(error)

    return (
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className={`text-xs font-medium ${hasError ? 'text-danger' : 'text-blue-soft dark:text-blue-muted'}`}
          >
            {label}
          </label>
          {hasError && (
            <span className="text-[10px] text-danger font-medium" role="alert">
              {error}
            </span>
          )}
        </div>

        {'as' in props && props.as === 'select' ? (
          <select
            id={id}
            className={inputClass(hasError)}
            {...(props as SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {(props as SelectProps).children}
          </select>
        ) : (
          <input
            id={id}
            className={inputClass(hasError)}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

export default FormField
