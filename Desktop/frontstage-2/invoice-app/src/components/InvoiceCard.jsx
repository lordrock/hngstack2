import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate } from "../utils/formatters";

export default function InvoiceCard({ invoice }) {
  return (
    <Link to={`/invoice/${invoice.id}`} className="invoice-card">
      <div className="invoice-card__id">
        <span>#</span>
        {invoice.id}
      </div>

      <p className="invoice-card__due-date">
        Due {formatDate(invoice.paymentDue)}
      </p>

      <p className="invoice-card__client-name">{invoice.clientName}</p>

      <p className="invoice-card__total">
        {formatCurrency(invoice.total)}
      </p>

      <StatusBadge status={invoice.status} />

      <span className="invoice-card__arrow">›</span>
    </Link>
  );
}