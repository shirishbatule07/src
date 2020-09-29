export const constants = {
  defaultSearchTermPageSize: 100,
  initialAutoCompletePageSize: 10,
  regexs: {
    website: /^[a-zA-Z0-9\.-]{3,}[.]+[a-z]+$/,
    email: /^[a-z0-9\.-]{3,}@[a-z\.]+\.*[a-z]+$/,
    date: /^((\d){2}\/(\d){2}\/(\d){4})?$/
  },
  unitCategories: [
    { id: 1, category: 'Weight' },
    { id: 2, category: 'CountingUnit' },
    { id: 3, category: 'Time' },
    { id: 4, category: 'Distance' }
  ],
  unitTypes: [
    { id: 1, unitType: 'BaseUnit' },
    { id: 2, unitType: 'BiggerThanBaseUnit' },
    { id: 3, unitType: 'SmallerThanBaseUnit' }
  ],
  salesOrderStatus: [
    { id: 3, label: 'Sales Order' },
    { id: 4, label: 'Locked' },
    { id: 5, label: 'Direct Sales Order' },
    { id: 6, label: 'Cancelled' }
  ],
  coOrdinatesPrecision: 7,
  locationTypes: [
    { value: 1, label: 'Internal Location' },
    { value: 2, label: 'Customer Location' },
    { value: 3, label: 'Vendor Location' },
    { value: 4, label: 'Inventory Loss Location' },
    { value: 5, label: 'Procurement' },
    { value: 6, label: 'Prodution' },
    { value: 7, label: 'Transit Location' }
  ],
  categoryTypes: [
    { id: 1, type: 'View' },
    { id: 2, type: 'Normal' }
  ],
  TransferRequestStatus: [
    { id: 1, status: 'Draft' },
    { id: 2, status: 'Confirmed' },
    { id: 3, status: 'Posted' }
  ],
  DamageStatus: [
    { id: 1, status: 'Draft' },
    { id: 2, status: 'Confirmed' },
    { id: 3, status: 'Posted' }
  ],
  TransferStatus: [
    { id: 1, status: 'Draft' },
    { id: 2, status: 'Confirmed' },
    { id: 3, status: 'Posted' }
  ],
  TransferAgainst: [
    { label: 'Direct', value: 1 },
    { label: 'Transfer Request', value: 2 }
  ],
  DeliveryReturnStatus: [
    { id: 1, status: 'Draft' },
    { id: 2, status: 'Confirmed' },
    { id: 3, status: 'Posted' }
  ],
  InvoiceReturnStatus: [
    { id: 1, label: 'Draft' },
    { id: 2, label: 'Confirmed' },
    { id: 3, label: 'Posted' }
  ],
  InvoiceStatus: [
    { id: 1, label: 'Draft' },
    { id: 2, label: 'Confirmed' },
    { id: 3, label: 'Posted' }
  ],
  InvoiceAgainst: [
    { label: 'Direct', value: 1 },
    { label: 'Delivery Note', value: 2 },
    { label: 'Sales Order', value: 3 },
    { label: 'Quotation', value: 4 },

  ],
  ReceiptAgainst: [
    { label: 'Direct', value: 1 },
    { label: 'Purchase Order', value: 2 },
    { label: 'Shipmet', value: 3 }

  ],
  ReceiptStatus: [
    { id: 1, label: 'Draft' },
    { id: 2, label: 'Confirmed' },
    { id: 3, label: 'Posted' }
  ],

  PurchaseOrderStatus: [
    { id: 0, status: 'Reference of Quotation' },
    { id: 1, status: 'Purchase Order' },
    { id: 2, status: 'Cancelled' },
    { id: 3, status: 'Posted' }
  ],
  ReceiptReturnStatus: [
    { id: 1, label: 'Draft' },
    { id: 2, label: 'Confirmed' },
    { id: 3, label: 'Posted' }
  ],
  AdjustmentStatus: [
    { id: 1, label: 'Draft' },
    { id: 2, label: 'Confirmed' },
    { id: 3, label: 'Posted' }
  ]
};
