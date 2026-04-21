import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import InvoiceList from "../components/InvoiceList";
import InvoiceForm from "../components/InvoiceForm";

export default function InvoicesPage({
  invoices,
  setInvoices,
  theme,
  toggleTheme,
}) {
  <Sidebar theme={theme} toggleTheme={toggleTheme} />
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const filteredInvoices = useMemo(() => {
    if (selectedFilter === "all") {
      return invoices;
    }

    return invoices.filter((invoice) => invoice.status === selectedFilter);
  }, [invoices, selectedFilter]);

  function handleCreateInvoice(newInvoice) {
    setInvoices((prev) => [newInvoice, ...prev]);
    setShowForm(false);
  }

  function handleSaveDraft(draftInvoice) {
    setInvoices((prev) => [draftInvoice, ...prev]);
    setShowForm(false);
  }

  return (
    <div className="app-layout">
      <Sidebar theme={theme} toggleTheme={toggleTheme} />

      <main className="page-content">
        <section className="invoice-page-header">
          <div>
            <h1 className="invoice-page-header__title">Invoices</h1>
            <p className="invoice-page-header__count">
              There are {filteredInvoices.length} total invoices
            </p>
          </div>

          <div className="invoice-page-header__actions">
            <label className="filter-control">
              <span className="filter-control__label">Filter by status</span>
              <select
                className="filter-select"
                value={selectedFilter}
                onChange={(event) => setSelectedFilter(event.target.value)}
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </label>

            <button
              type="button"
              className="new-invoice-button"
              onClick={() => setShowForm(true)}
            >
              <span className="new-invoice-button__icon">+</span>
              New Invoice
            </button>
          </div>
        </section>

        <InvoiceList invoices={filteredInvoices} />

        {showForm ? (
          <InvoiceForm
            mode="create"
            onCancel={() => setShowForm(false)}
            onSaveDraft={handleSaveDraft}
            onSubmitInvoice={handleCreateInvoice}
          />
        ) : null}
      </main>
    </div>
  );
}