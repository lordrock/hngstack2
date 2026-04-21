import { useMemo, useState } from "react";
import {
  calculateInvoiceTotal,
  calculateItemTotal,
  buildPaymentDue,
  createEmptyInvoice,
} from "../utils/invoiceHelpers";
import validateInvoice from "../utils/validateInvoice";

export default function InvoiceForm({
  initialData = null,
  mode = "create",
  onCancel,
  onSaveDraft,
  onSubmitInvoice,
}) {
  const [formData, setFormData] = useState(() =>
    initialData
      ? {
          ...initialData,
          senderAddress: { ...initialData.senderAddress },
          clientAddress: { ...initialData.clientAddress },
          items: initialData.items.map((item) => ({ ...item })),
        }
      : createEmptyInvoice()
  );

  const [errors, setErrors] = useState({});

  const formTitle = mode === "edit" ? `Edit #${formData.id}` : "New Invoice";

  const invoiceTotal = useMemo(() => {
    return calculateInvoiceTotal(formData.items);
  }, [formData.items]);

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function updateNestedField(parent, field, value) {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  }

  function updateItem(index, field, value) {
  setFormData((prev) => {
    const updatedItems = prev.items.map((item, itemIndex) => {
      if (itemIndex !== index) return item;

      const normalizedValue =
        field === "quantity" || field === "price"
          ? Number(value)
          : value;

      const updatedItem = {
        ...item,
        [field]: normalizedValue,
      };

      const quantity =
        field === "quantity" ? Number(normalizedValue) : Number(updatedItem.quantity);

      const price =
        field === "price" ? Number(normalizedValue) : Number(updatedItem.price);

      updatedItem.total = calculateItemTotal(quantity, price);

      return updatedItem;
    });

    return {
      ...prev,
      items: updatedItems,
    };
  });
}

  function addNewItem() {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: "",
          quantity: 1,
          price: 0,
          total: 0,
        },
      ],
    }));
  }

  function removeItem(index) {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function handlePaymentTermsChange(value) {
    setFormData((prev) => ({
      ...prev,
      paymentTerms: Number(value),
      paymentDue: buildPaymentDue(prev.createdAt, Number(value)),
    }));
  }

  function handleSaveDraft() {
    if (mode !== "create") return;

    const draftInvoice = {
      ...formData,
      status: "draft",
      total: invoiceTotal,
      paymentDue: buildPaymentDue(formData.createdAt, formData.paymentTerms),
    };

    onSaveDraft(draftInvoice);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const preparedInvoice = {
      ...formData,
      total: invoiceTotal,
      paymentDue: buildPaymentDue(formData.createdAt, formData.paymentTerms),
      status:
        mode === "edit"
          ? formData.status
          : formData.status === "draft"
          ? "pending"
          : formData.status,
    };

    const validationErrors = validateInvoice(preparedInvoice);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmitInvoice(preparedInvoice);
  }

  return (
    <section className="invoice-form-panel">
      <form className="invoice-form" onSubmit={handleSubmit}>
        <h2 className="invoice-form__title">{formTitle}</h2>

        <div className="form-section">
          <h3 className="form-section__heading">Bill From</h3>

          <label className="form-field">
            <span>Street Address</span>
            <input
              value={formData.senderAddress.street}
              onChange={(event) =>
                updateNestedField("senderAddress", "street", event.target.value)
              }
            />
            {errors.senderStreet ? <small>{errors.senderStreet}</small> : null}
          </label>

          <div className="form-grid">
            <label className="form-field">
              <span>City</span>
              <input
                value={formData.senderAddress.city}
                onChange={(event) =>
                  updateNestedField("senderAddress", "city", event.target.value)
                }
              />
            </label>

            <label className="form-field">
              <span>Post Code</span>
              <input
                value={formData.senderAddress.postCode}
                onChange={(event) =>
                  updateNestedField("senderAddress", "postCode", event.target.value)
                }
              />
            </label>

            <label className="form-field">
              <span>Country</span>
              <input
                value={formData.senderAddress.country}
                onChange={(event) =>
                  updateNestedField("senderAddress", "country", event.target.value)
                }
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section__heading">Bill To</h3>

          <label className="form-field">
            <span>Client’s Name</span>
            <input
              value={formData.clientName}
              onChange={(event) => updateField("clientName", event.target.value)}
            />
            {errors.clientName ? <small>{errors.clientName}</small> : null}
          </label>

          <label className="form-field">
            <span>Client’s Email</span>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(event) => updateField("clientEmail", event.target.value)}
              aria-invalid={Boolean(errors.clientEmail)}
                />
            {errors.clientEmail ? <small>{errors.clientEmail}</small> : null}
          </label>

          <label className="form-field">
            <span>Street Address</span>
            <input
              value={formData.clientAddress.street}
              onChange={(event) =>
                updateNestedField("clientAddress", "street", event.target.value)
              }
            />
            {errors.clientStreet ? <small>{errors.clientStreet}</small> : null}
          </label>

          <div className="form-grid">
            <label className="form-field">
              <span>City</span>
              <input
                value={formData.clientAddress.city}
                onChange={(event) =>
                  updateNestedField("clientAddress", "city", event.target.value)
                }
              />
            </label>

            <label className="form-field">
              <span>Post Code</span>
              <input
                value={formData.clientAddress.postCode}
                onChange={(event) =>
                  updateNestedField("clientAddress", "postCode", event.target.value)
                }
              />
            </label>

            <label className="form-field">
              <span>Country</span>
              <input
                value={formData.clientAddress.country}
                onChange={(event) =>
                  updateNestedField("clientAddress", "country", event.target.value)
                }
              />
            </label>
          </div>
        </div>

        <div className="form-grid">
          <label className="form-field">
            <span>Invoice Date</span>
            <input
              type="date"
              value={formData.createdAt}
              onChange={(event) => updateField("createdAt", event.target.value)}
            />
          </label>

          <label className="form-field">
            <span>Payment Terms</span>
            <select
              value={formData.paymentTerms}
              onChange={(event) => handlePaymentTermsChange(event.target.value)}
            >
              <option value={7}>Net 7 Days</option>
              <option value={14}>Net 14 Days</option>
              <option value={30}>Net 30 Days</option>
            </select>
          </label>
        </div>

        <label className="form-field">
          <span>Project Description</span>
          <input
            value={formData.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
          {errors.description ? <small>{errors.description}</small> : null}
        </label>

        <div className="form-section">
          <h3 className="form-section__heading form-section__heading--muted">
            Item List
          </h3>

          {errors.items ? <small className="form-error">{errors.items}</small> : null}

          <div className="invoice-items-form-list">
            {formData.items.map((item, index) => (
              <div key={index} className="invoice-item-form-row">
                <label className="form-field">
                  <span>Item Name</span>
                  <input
                    value={item.name}
                    onChange={(event) => updateItem(index, "name", event.target.value)}
                  />
                  {errors[`itemName-${index}`] ? (
                    <small>{errors[`itemName-${index}`]}</small>
                  ) : null}
                </label>

                <label className="form-field">
                  <span>Qty.</span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateItem(index, "quantity", event.target.value)}
                  />
                  {errors[`itemQuantity-${index}`] ? (
                    <small>{errors[`itemQuantity-${index}`]}</small>
                  ) : null}
                </label>

                <label className="form-field">
                  <span>Price</span>
                  <input
                    type="number"
                    min="0"
                    value={item.price}
                    onChange={(event) => updateItem(index, "price", event.target.value)}
                  />
                  {errors[`itemPrice-${index}`] ? (
                    <small>{errors[`itemPrice-${index}`]}</small>
                  ) : null}
                </label>

                <div className="form-field">
                  <span>Total</span>
                  <div className="invoice-item-total">£ {Number(item.total).toFixed(2)}</div>
                </div>

                <button
                  type="button"
                  className="remove-item-button"
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="add-item-button" onClick={addNewItem}>
            + Add New Item
          </button>
        </div>

        <div className="invoice-form__actions">
          <button type="button" className="button button--secondary" onClick={onCancel}>
            Cancel
          </button>

          <div className="invoice-form__actions-right">
            {mode === "create" ? (
              <button
                type="button"
                className="button button--secondary"
                onClick={handleSaveDraft}
              >
                Save as Draft
              </button>
            ) : null}

            <button type="submit" className="button button--primary">
              {mode === "edit" ? "Save Changes" : "Save & Send"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}