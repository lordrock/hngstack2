import { Routes, Route } from "react-router-dom";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
import useInvoices from "./utils/useInvoices";
import useTheme from "./utils/useTheme";

export default function App() {
  const { invoices, setInvoices } = useInvoices();
  const { theme, toggleTheme } = useTheme();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <InvoicesPage
            invoices={invoices}
            setInvoices={setInvoices}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        }
      />
      <Route
        path="/invoice/:id"
        element={
          <InvoiceDetailsPage
            invoices={invoices}
            setInvoices={setInvoices}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        }
      />
    </Routes>
  );
}