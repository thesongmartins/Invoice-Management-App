import { useState, useRef, useEffect } from "react";
import type { DatePickerProps } from "../types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDisplay(value: string): string {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1]} ${year}`;
}

function parseValue(value: string): {
  year: number;
  month: number;
  day: number;
} {
  if (!value) {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  }
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export default function DatePicker({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = parseValue(value);
  const [viewYear, setViewYear] = useState(parsed.year);
  const [viewMonth, setViewMonth] = useState(parsed.month);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  // Sync view when value changes externally
  useEffect(() => {
    const p = parseValue(value);
    setViewYear(p.year);
    setViewMonth(p.month);
  }, [value]);

  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const selectDay = (day: number) => {
    const mm = String(viewMonth).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const selectedParsed = value ? parseValue(value) : null;
  const isSelected = (day: number) =>
    selectedParsed?.year === viewYear &&
    selectedParsed?.month === viewMonth &&
    selectedParsed?.day === day;

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
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`
          w-full flex items-center justify-between
          bg-white dark:bg-navy-light
          border rounded px-5 py-3.5
          font-bold text-[13px] text-navy dark:text-white
          outline-none transition-colors text-left
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            hasError
              ? "border-danger"
              : "border-blue-gray dark:border-navy-light hover:border-purple focus:border-purple"
          }
          ${open ? "border-purple" : ""}
        `}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{value ? formatDisplay(value) : "Select date"}</span>
        {/* Calendar icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="shrink-0"
        >
          <path
            d="M14 2h-1V0h-2v2H5V0H3v2H2C.9 2 0 2.9 0 4v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 13H2V6h12v9zM4 8h2v2H4zm5 0h2v2H9zm-5 3h2v2H4zm5 0h2v2H9z"
            fill="#7C5DFA"
          />
        </svg>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div
          className="
            absolute top-[calc(100%+8px)] left-0 z-[300]
            bg-white dark:bg-navy-medium
            rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.5)]
            p-6 w-[240px]
          "
          role="dialog"
          aria-label="Date picker calendar"
        >
          {/* Month / Year nav */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={prevMonth}
              className="text-purple hover:opacity-70 transition-opacity p-1"
              aria-label="Previous month"
            >
              <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 1L2 5l4 4"
                  stroke="#7C5DFA"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <span className="font-bold text-[13px] text-navy dark:text-white">
              {MONTHS[viewMonth - 1]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="text-purple hover:opacity-70 transition-opacity p-1"
              aria-label="Next month"
            >
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
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <span
                key={d}
                className="text-center text-[10px] font-bold text-blue-muted"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: totalCells }).map((_, i) => {
              const dayNum = i - firstDay + 1;
              const isValid = dayNum >= 1 && dayNum <= daysInMonth;
              const selected = isValid && isSelected(dayNum);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={!isValid}
                  onClick={() => isValid && selectDay(dayNum)}
                  className={`
                    w-full aspect-square flex items-center justify-center
                    text-[13px] font-bold rounded transition-colors
                    ${!isValid ? "invisible" : ""}
                    ${
                      selected
                        ? "text-purple"
                        : "text-navy dark:text-white hover:text-purple"
                    }
                  `}
                  aria-label={
                    isValid
                      ? `${dayNum} ${MONTHS[viewMonth - 1]} ${viewYear}`
                      : undefined
                  }
                  aria-pressed={selected}
                >
                  {isValid ? dayNum : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
