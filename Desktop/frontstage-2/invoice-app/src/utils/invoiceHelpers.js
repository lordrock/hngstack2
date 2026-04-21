export function calculateItemTotal(quantity, price) {
  return Number(quantity) * Number(price);
}

export function calculateInvoiceTotal(items) {
  return items.reduce((sum, item) => sum + Number(item.total || 0), 0);
}

export function generateInvoiceId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const first = letters[Math.floor(Math.random() * letters.length)];
  const second = letters[Math.floor(Math.random() * letters.length)];
  const numbers = Math.floor(1000 + Math.random() * 9000);

  return `${first}${second}${numbers}`;
}

export function buildPaymentDue(createdAt, paymentTerms) {
  const createdDate = new Date(createdAt);
  createdDate.setDate(createdDate.getDate() + Number(paymentTerms));
  return createdDate.toISOString().split("T")[0];
}

export function createEmptyInvoice() {
  const today = new Date().toISOString().split("T")[0];

  return {
    id: generateInvoiceId(),
    createdAt: today,
    paymentDue: buildPaymentDue(today, 30),
    description: "",
    paymentTerms: 30,
    clientName: "",
    clientEmail: "",
    status: "pending",
    senderAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    items: [
      {
        name: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ],
    total: 0,
  };
}