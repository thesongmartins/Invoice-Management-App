import { useState, useRef, useEffect } from "react";
import type { CustomSelectProps } from "../types";

export default function CustomSelect({
  id,
  label,
  value,
  onChange,
  options,
  error,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => String(o.value) === String(value));

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const hasError = Boolean(error);

  return (
    <div ref={wrapperRef} className="flex flex-col gap-2.5 relative">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className={`text-[13px] font-bold ${hasError ? "text-danger" : "text-blue-soft dark:text-blue-muted"}`}
        >
          {label}
        </label>
        {hasError && (
          <span className="text-[10px] text-danger font-medium" role="alert">
            {error}
          </span>
        )}
      </div>

      {/* Trigger button */}
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center justify-between
          bg-white dark:bg-navy-light
          border rounded px-5 py-3.5
          font-bold text-[13px] text-navy dark:text-white
          outline-none transition-colors text-left
          ${
            hasError
              ? "border-danger"
              : "border-blue-gray dark:border-navy-light hover:border-purple"
          }
          ${open ? "border-purple" : ""}
        `}
        aria-haspopup="listbox"
        aria-expanded={open}
        role="combobox"
        aria-controls={`${id}-listbox`}
      >
        <span>{selected?.label ?? "Select"}</span>
        {/* Chevron */}
        <svg
          className={`transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
          width="11"
          height="7"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1 1l4.228 4.228L9.456 1"
            stroke="#7C5DFA"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          aria-label={label}
          className="
            absolute top-[calc(100%+8px)] left-0 right-0 z-[300]
            bg-white dark:bg-navy-medium
            rounded-lg overflow-hidden
            shadow-[0_10px_20px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.5)]
          "
        >
          {options.map((option, idx) => {
            const isSelected = String(option.value) === String(value);
            const isLast = idx === options.length - 1;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(Number(option.value));
                  setOpen(false);
                }}
                className={`
                  px-5 py-3.5 font-bold text-[13px] cursor-pointer
                  transition-colors
                  ${!isLast ? "border-b border-blue-gray dark:border-navy-light" : ""}
                  ${
                    isSelected
                      ? "text-purple"
                      : "text-navy dark:text-white hover:text-purple"
                  }
                `}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
