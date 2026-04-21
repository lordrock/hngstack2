const seedInvoices = [
  {
    id: "RT3080",
    createdAt: "2026-04-01",
    paymentDue: "2026-04-30",
    description: "Website redesign",
    paymentTerms: 30,
    clientName: "Jensen Huang",
    clientEmail: "jensen@example.com",
    status: "paid",
    senderAddress: {
      street: "19 Union Terrace",
      city: "Lagos",
      postCode: "100001",
      country: "Nigeria",
    },
    clientAddress: {
      street: "84 Church Way",
      city: "Ibadan",
      postCode: "200001",
      country: "Nigeria",
    },
    items: [
      {
        name: "Homepage Design",
        quantity: 1,
        price: 1200,
        total: 1200,
      },
    ],
    total: 1200,
  },
  {
    id: "XM9141",
    createdAt: "2026-04-05",
    paymentDue: "2026-05-05",
    description: "Brand identity package",
    paymentTerms: 30,
    clientName: "Alex Morgan",
    clientEmail: "alex@example.com",
    status: "pending",
    senderAddress: {
      street: "12 Allen Avenue",
      city: "Lagos",
      postCode: "100281",
      country: "Nigeria",
    },
    clientAddress: {
      street: "44 Ring Road",
      city: "Abuja",
      postCode: "900001",
      country: "Nigeria",
    },
    items: [
      {
        name: "Logo Design",
        quantity: 1,
        price: 800,
        total: 800,
      },
      {
        name: "Brand Guide",
        quantity: 1,
        price: 400,
        total: 400,
      },
    ],
    total: 1200,
  },
  {
    id: "RG0314",
    createdAt: "2026-04-10",
    paymentDue: "2026-05-10",
    description: "Mobile app design system",
    paymentTerms: 30,
    clientName: "Samuel Green",
    clientEmail: "samuel@example.com",
    status: "draft",
    senderAddress: {
      street: "7 Admiralty Way",
      city: "Lekki",
      postCode: "105102",
      country: "Nigeria",
    },
    clientAddress: {
      street: "17 GRA Phase 2",
      city: "Port Harcourt",
      postCode: "500001",
      country: "Nigeria",
    },
    items: [
      {
        name: "Component Library",
        quantity: 1,
        price: 1500,
        total: 1500,
      },
    ],
    total: 1500,
  },
];

export default seedInvoices;