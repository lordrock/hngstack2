import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/StatusBadge";
import DeleteModal from "../components/DeleteModal";
import InvoiceForm from "../components/InvoiceForm";
import { formatCurrency, formatDate } from "../utils/formatters";

export default function InvoiceDetailsPage({
  invoices,
  setInvoices,
  theme,
  toggleTheme,
}) {
  <Sidebar theme={theme} toggleTheme={toggleTheme} />
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const invoice = invoices.find((item) => item.id === id);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setShowDeleteModal(false);
        setShowEditForm(false);
      }
    }

    if (showDeleteModal || showEditForm) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showDeleteModal, showEditForm]);

  if (!invoice) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="page-content">
          <p>Invoice not found.</p>
        </main>
      </div>
    );
  }

  function handleMarkAsPaid() {
    if (invoice.status === "paid" || invoice.status === "draft") return;

    const updatedInvoices = invoices.map((item) =>
      item.id === invoice.id ? { ...item, status: "paid" } : item
    );

    setInvoices(updatedInvoices);
  }

  function handleDeleteInvoice() {
    const updatedInvoices = invoices.filter((item) => item.id !== invoice.id);
    setInvoices(updatedInvoices);
    navigate("/");
  }

  function handleEditInvoice(updatedInvoice) {
    const updatedInvoices = invoices.map((item) =>
      item.id === updatedInvoice.id ? updatedInvoice : item
    );

    setInvoices(updatedInvoices);
    setShowEditForm(false);
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="page-content">
        <Link to="/" className="back-link">
          ← Go Back
        </Link>

        <section className="invoice-status-bar">
          <div className="invoice-status-bar__left">
            <span className="invoice-status-bar__label">Status</span>
            <StatusBadge status={invoice.status} />
          </div>

          <div className="invoice-status-bar__actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setShowEditForm(true)}
            >
              Edit
            </button>

            <button
              type="button"
              className="button button--danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>

            <button
              type="button"
              className="button button--primary"
              onClick={handleMarkAsPaid}
              disabled={invoice.status === "paid" || invoice.status === "draft"}
            >
              Mark as Paid
            </button>
          </div>
        </section>

        <section className="invoice-detail-card">
          <div className="invoice-detail-card__top">
            <div>
              <h1 className="invoice-detail-card__id">#{invoice.id}</h1>
              <p className="invoice-detail-card__description">{invoice.description}</p>
            </div>

            <div className="invoice-detail-card__address">
              <p>{invoice.senderAddress.street}</p>
              <p>{invoice.senderAddress.city}</p>
              <p>{invoice.senderAddress.postCode}</p>
              <p>{invoice.senderAddress.country}</p>
            </div>
          </div>

          <div className="invoice-detail-card__grid">
            <div>
              <p className="detail-label">Invoice Date</p>
              <p className="detail-value">{formatDate(invoice.createdAt)}</p>
            </div>

            <div>
              <p className="detail-label">Payment Due</p>
              <p className="detail-value">{formatDate(invoice.paymentDue)}</p>
            </div>

            <div>
              <p className="detail-label">Bill To</p>
              <p className="detail-value">{invoice.clientName}</p>
              <p className="detail-muted">{invoice.clientAddress.street}</p>
              <p className="detail-muted">{invoice.clientAddress.city}</p>
              <p className="detail-muted">{invoice.clientAddress.postCode}</p>
              <p className="detail-muted">{invoice.clientAddress.country}</p>
            </div>

            <div>
              <p className="detail-label">Sent to</p>
              <p className="detail-value">{invoice.clientEmail}</p>
            </div>
          </div>

          <section className="invoice-items-card">
            <div className="invoice-items-card__list">
              {invoice.items.map((item, index) => (
                <div key={`${item.name}-${index}`} className="invoice-item-row">
                  <div>
                    <p className="detail-value">{item.name}</p>
                    <p className="detail-muted">
                      {Number(item.quantity).toFixed(0)} x £ {Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  <p className="detail-value">£ {Number(item.total).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="invoice-items-card__footer">
              <span>Grand Total</span>
              <strong>£ {Number(invoice.total).toFixed(2)}</strong>
            </div>
          </section>
        </section>

        {showDeleteModal ? (
          <DeleteModal
            invoiceId={invoice.id}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteInvoice}
          />
        ) : null}

        {showEditForm ? (
          <InvoiceForm
            mode="edit"
            initialData={invoice}
            onCancel={() => setShowEditForm(false)}
            onSubmitInvoice={handleEditInvoice}
          />
        ) : null}
      </main>
    </div>
  );
}

