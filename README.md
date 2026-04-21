# Invoice App

A fully-featured Invoice Management application built with **React**, **TypeScript**, and **Tailwind CSS**, based on the [HNG INTERNSHIP](https://hng.tech/internship) task.

---

## Live Demo

> Deploy to Vercel or Netlify — see [Deployment](#deployment) below.

---

## Features

- **Full CRUD** — Create, Read, Update, Delete invoices
- **Three statuses** — Draft, Pending, Paid
- **Save as Draft** — partial saves without validation
- **Mark as Paid** — status promotion flow
- **Send & Publish** — promote draft → pending
- **Filter by status** — checkbox-based multi-filter
- **Dark / Light mode** — persisted to `localStorage`
- **LocalStorage persistence** — survives page refresh
- **Full form validation** — required fields, email format, item rules
- **Responsive design** — mobile (320px+), tablet (768px+), desktop (1024px+)
- **Accessible** — semantic HTML, ARIA labels, focus trap in modals, ESC to close, keyboard navigation
- **Seed data** — 6 example invoices pre-loaded on first run

---

## Tech Stack

| Tool            | Purpose                 |
| --------------- | ----------------------- |
| React 18        | UI framework            |
| TypeScript      | Type safety             |
| Tailwind CSS 3  | Utility-first styling   |
| React Router v6 | Client-side routing     |
| Vite            | Build tool & dev server |
| uuid            | Unique ID generation    |

---

## Architecture

```
src/
├── components/         # Reusable UI components
│   ├── DeleteModal.tsx     # Accessible confirmation modal
│   ├── EmptyState.tsx      # Empty list illustration
│   ├── FilterDropdown.tsx  # Multi-select status filter
│   ├── FormField.tsx       # Reusable labeled input/select
│   ├── InvoiceCard.tsx     # List item card
│   ├── InvoiceForm.tsx     # Slide-in create/edit form
│   ├── Sidebar.tsx         # Fixed navigation sidebar
│   └── StatusBadge.tsx     # Colored status pill
│
├── contexts/           # Global state via React Context + useReducer
│   ├── InvoiceContext.tsx  # Invoice CRUD, filtering, persistence
│   └── ThemeContext.tsx    # Dark/light mode
│
├── hooks/              # Custom React hooks
│   ├── useFocusTrap.ts     # Modal focus trapping
│   └── useFormValidation.ts # Form error state management
│
├── pages/              # Route-level page components
│   ├── InvoiceDetail.tsx   # Single invoice view + actions
│   └── InvoiceList.tsx     # Invoice listing + filter header
│
├── types/              # TypeScript interfaces
│   └── index.ts
│
├── utils/              # Pure helper functions
│   └── index.ts            # date, currency, form-invoice conversion
│
├── data/
│   └── seedData.ts         # Initial invoice data
│
├── App.tsx             # Root layout with sidebar + routes
├── main.tsx            # React entry point
└── index.css           # Tailwind base + global styles
```

### State Management

- **InvoiceContext**: Uses `useReducer` for predictable state transitions. All CRUD actions dispatch typed actions. State is synced to `localStorage` on every change via `useEffect`.
- **ThemeContext**: Simple `useState` with `useEffect` to apply/remove `.dark` class on `<html>` and persist to `localStorage`.
- No external state library needed — Context + Reducer handles this app's complexity well.

### Routing

Two routes via React Router v6:

- `/` — Invoice list page
- `/invoices/:id` — Invoice detail page

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9

### Install & Run

```bash
# Clone the repository
git clone https://github.com/thesongmartins/invoice-management-app.git
cd invoice-management-app

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
pnpm build
pnpm preview   # preview the production build locally
```

---

## Deployment

### Vercel (recommended)

```bash
pnpm install -g vercel
vercel
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).

### Netlify

```bash
pnpm build
# Drag the 'dist' folder to app.netlify.com/drop
```

Or connect your GitHub repo and set:

- **Build command**: `pnpm build`
- **Publish directory**: `dist`

---

## Trade-offs

| Decision                        | Rationale                                                                                                        |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Context + useReducer over Redux | App state is scoped to invoices only — Redux would add unnecessary boilerplate                                   |
| localStorage over IndexedDB     | Simple key/value storage is sufficient; no binary data or large datasets                                         |
| localStorage over backend       | Keeps the app fully client-side, deployable as a static site with zero backend cost                              |
| Tailwind over CSS Modules       | Faster iteration; utility classes map naturally to Figma design tokens                                           |
| No date picker library          | Native `<input type="date">` avoids bundle weight; sufficient for this scope                                     |
| uuid for IDs                    | Generates proper RFC 4122 UUIDs for items; 2-letter+4-digit IDs use a custom generator to match the Figma design |

---

## Accessibility Notes

- All interactive elements are `<button>` or `<a>` — no `div` click handlers in the invoice list
- Form fields use `<label>` elements with `htmlFor` matching input `id`
- Delete modal implements full **focus trap** (`useFocusTrap` hook) — tab cycles inside the modal
- Both modals (delete + form overlay) close on **ESC** keypress
- Status badges include a color-coded dot + text (not color-only distinction)
- Empty state uses a decorative SVG with `aria-hidden`
- Sidebar has `role="navigation"` with an `aria-label`
- Invoice table uses `role="table"`, `role="row"`, `role="columnheader"`, `role="cell"` ARIA semantics
- Filter checkboxes use `aria-label` and `role="option"` / `aria-multiselectable`
- Back button and all icon buttons have `aria-label`
- `sr-only` utility class available for screen-reader-only text
- Color contrast meets WCAG AA in both light and dark modes

---

## Improvements Beyond Requirements

- **Seed data** — 6 realistic invoices pre-populated so the app isn't empty on first visit
- **Mobile action bar** — on small screens the Edit/Delete/Mark Paid buttons appear in a fixed bottom bar (matching the Figma mobile design)
- **Animated form panel** — the create/edit form slides in with a CSS animation
- **Custom scrollbar** — subtle styled scrollbar matching the theme
- **Select arrow** — native select overridden with the Figma-matching purple chevron icon
- **Keyboard navigation** — invoice cards are focusable and activatable via Enter key
- **System theme detection** — on first visit, respects `prefers-color-scheme` before the user sets a preference
- **TypeScript strict mode** — all types are explicitly defined, no `any`
- **ESLint configured** — enforces hooks rules and TypeScript best practices
