import { useRef, useEffect, useState } from "react";
import { FilterStatus, InvoiceStatus } from "../types";

interface FilterDropdownProps {
  selected: FilterStatus[];
  onChange: (statuses: FilterStatus[]) => void;
}

const OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

function FilterDropdown({ selected, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const toggleStatus = (status: InvoiceStatus) => {
    const next = selected.includes(status)
      ? selected.filter((s) => s !== status)
      : [...selected, status];
    onChange(next as FilterStatus[]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 text-navy dark:text-white font-bold text-xs hover:text-purple transition-colors px-2 py-2 rounded-lg"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="hidden text-[15px] sm:inline">Filter by status</span>
        <span className="sm:hidden">Filter</span>
        <svg
          className={`transition-transform ${open ? "rotate-180" : ""}`}
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

      {open && (
        <div
          className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 bg-white dark:bg-navy-light rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.5)] min-w-[176px] p-6 z-50"
          role="listbox"
          aria-label="Filter by status"
          aria-multiselectable="true"
        >
          {OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-3 py-1 cursor-pointer group"
              role="option"
              aria-selected={selected.includes(value)}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border transition-colors cursor-pointer
                  ${
                    selected.includes(value)
                      ? "bg-purple border-purple"
                      : "border-blue-gray dark:border-navy-light bg-white dark:bg-navy-medium group-hover:border-purple"
                  }`}
                onClick={() => toggleStatus(value)}
              >
                {selected.includes(value) && (
                  <svg
                    width="10"
                    height="8"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M1.5 4.5l2.124 2.124L8.97 1"
                      stroke="#fff"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={selected.includes(value)}
                onChange={() => toggleStatus(value)}
                aria-label={label}
              />
              <span className="font-bold text-xs text-navy dark:text-white">
                {label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
