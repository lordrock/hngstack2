import InvoiceCard from "./InvoiceCard";

export default function InvoiceList({ invoices }) {
  if (!invoices.length) {
    return (
      <div className="empty-state">
        <h2>There is nothing here</h2>
        <p>
          Create an invoice by clicking the <strong>New Invoice</strong> button
          and get started.
        </p>
      </div>
    );
  }

  return (
    <div className="invoice-list">
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
}