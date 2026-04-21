import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetail from "./pages/InvoiceDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8F8FB] dark:bg-navy font-spartan transition-colors duration-200">
      <Sidebar />

      {/* Main content  */}
      <div className="pt-[72px] lg:pt-0 lg:ml-[88px] min-h-screen">
        <main
          className="
            max-w-[780px] mx-auto
            px-6 md:px-12
            py-16 md:py-[72px]
            pb-24 md:pb-16
          "
          id="main-content"
        >
          <Routes>
            <Route path="/" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
