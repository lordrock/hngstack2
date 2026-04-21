import { useEffect, useState } from "react";
import seedInvoices from "../data/seedInvoices";
import { loadInvoices, saveInvoices } from "./storage";

export default function useInvoices() {
  const [invoices, setInvoices] = useState(() => {
    const storedInvoices = loadInvoices();
    return storedInvoices || seedInvoices;
  });

  useEffect(() => {
    saveInvoices(invoices);
  }, [invoices]);

  return { invoices, setInvoices };
}