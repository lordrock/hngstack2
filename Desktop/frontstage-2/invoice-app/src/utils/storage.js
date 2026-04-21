const INVOICES_STORAGE_KEY = "invoice_app_invoices";

export function loadInvoices() {
  const savedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);

  if (!savedInvoices) {
    return null;
  }

  try {
    return JSON.parse(savedInvoices);
  } catch (error) {
    console.error("Failed to parse invoices from localStorage:", error);
    return null;
  }
}

export function saveInvoices(invoices) {
  localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
}