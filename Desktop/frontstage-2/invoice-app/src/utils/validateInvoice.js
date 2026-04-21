export default function validateInvoice(invoice) {
  const errors = {};

  if (!invoice.clientName.trim()) {
    errors.clientName = "Client name is required";
  }

  if (!invoice.clientEmail.trim()) {
    errors.clientEmail = "Client email is required";
  } else if (!/\S+@\S+\.\S+/.test(invoice.clientEmail)) {
    errors.clientEmail = "Enter a valid email address";
  }

  if (!invoice.description.trim()) {
    errors.description = "Project description is required";
  }

  if (!invoice.senderAddress.street.trim()) {
    errors.senderStreet = "Sender street is required";
  }

  if (!invoice.clientAddress.street.trim()) {
    errors.clientStreet = "Client street is required";
  }

  if (!invoice.items.length) {
    errors.items = "At least one item is required";
  } else {
    invoice.items.forEach((item, index) => {
      if (!item.name.trim()) {
        errors[`itemName-${index}`] = "Item name is required";
      }

      if (Number(item.quantity) <= 0) {
        errors[`itemQuantity-${index}`] = "Quantity must be greater than 0";
      }

      if (Number(item.price) <= 0) {
        errors[`itemPrice-${index}`] = "Price must be greater than 0";
      }
    });
  }

  return errors;
}