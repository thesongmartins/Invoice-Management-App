import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { Invoice, InvoiceStatus, FilterStatus } from "../types";
import { seedInvoices } from "../data/seedData";
import type { InvoiceState, Action } from "../types";

const STORAGE_KEY = "invoiceApp_invoices";

function reducer(state: InvoiceState, action: Action): InvoiceState {
  switch (action.type) {
    case "SET_INVOICES":
      return { ...state, invoices: action.payload };
    case "ADD_INVOICE":
      return { ...state, invoices: [action.payload, ...state.invoices] };
    case "UPDATE_INVOICE":
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.payload.id ? action.payload : inv,
        ),
      };
    case "DELETE_INVOICE":
      return {
        ...state,
        invoices: state.invoices.filter((inv) => inv.id !== action.payload),
      };
    case "MARK_PAID":
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.payload
            ? { ...inv, status: "paid" as InvoiceStatus }
            : inv,
        ),
      };
    case "SEND_INVOICE":
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.payload
            ? { ...inv, status: "pending" as InvoiceStatus }
            : inv,
        ),
      };
    case "SET_FILTER":
      return { ...state, filterStatus: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

function loadFromStorage(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Invoice[];
  } catch {
    console.error("Failed to load invoices from storage");
  }
  return [];
}

function saveToStorage(invoices: Invoice[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

interface InvoiceContextType {
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  filterStatus: FilterStatus[];
  isLoading: boolean;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  markPaid: (id: string) => void;
  sendInvoice: (id: string) => void;
  setFilter: (statuses: FilterStatus[]) => void;
  getInvoice: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    invoices: [],
    filterStatus: [],
    isLoading: true,
  });

  const isHydrated = useRef(false);

  useEffect(() => {
    let stored = loadFromStorage();
    if (stored.length === 0) {
      stored = seedInvoices;
    }
    saveToStorage(stored);
    dispatch({ type: "SET_INVOICES", payload: stored });
    dispatch({ type: "SET_LOADING", payload: false });
    isHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!isHydrated.current) return;
    if (state.invoices.length === 0) return;
    saveToStorage(state.invoices);
  }, [state.invoices]);

  const filteredInvoices =
    state.filterStatus.length === 0
      ? state.invoices
      : state.invoices.filter((inv) =>
          state.filterStatus.includes(inv.status as FilterStatus),
        );

  const addInvoice = useCallback(
    (invoice: Invoice) => dispatch({ type: "ADD_INVOICE", payload: invoice }),
    [],
  );
  const updateInvoice = useCallback(
    (invoice: Invoice) =>
      dispatch({ type: "UPDATE_INVOICE", payload: invoice }),
    [],
  );
  const deleteInvoice = useCallback(
    (id: string) => dispatch({ type: "DELETE_INVOICE", payload: id }),
    [],
  );
  const markPaid = useCallback(
    (id: string) => dispatch({ type: "MARK_PAID", payload: id }),
    [],
  );
  const sendInvoice = useCallback(
    (id: string) => dispatch({ type: "SEND_INVOICE", payload: id }),
    [],
  );
  const setFilter = useCallback(
    (statuses: FilterStatus[]) =>
      dispatch({ type: "SET_FILTER", payload: statuses }),
    [],
  );
  const getInvoice = useCallback(
    (id: string) => state.invoices.find((inv) => inv.id === id),
    [state.invoices],
  );

  return (
    <InvoiceContext.Provider
      value={{
        invoices: state.invoices,
        filteredInvoices,
        filterStatus: state.filterStatus,
        isLoading: state.isLoading,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markPaid,
        sendInvoice,
        setFilter,
        getInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices(): InvoiceContextType {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoices must be used within InvoiceProvider");
  return ctx;
}
