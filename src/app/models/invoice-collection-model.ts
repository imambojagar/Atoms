export class InvoiceCollectionModel {
  id: number = 0;
  expectedDate: Date | null = null;
  actualDate: Date | null = null;
  isPaid: true | null = null;
  contractNumber: string | null = null;
  amount: number | null = null;
  editedPrice: number | null = null;
  visitCost: number | null = null;
  paymentMethod: number | null = null;
  numberOfEmergencyVisits: number | null = null;
  userId: string | null = null;
  salesTax: string | null = null;
  taxAts: string | null = null;
  delayFine: string | null = null;
  checkNumber: string | null = null;
  salesOrderNumber: string | null = null;
  deductionInsurance: string | null = null;
  deductionTaxes: string | null = null;
  deductions: string | null = null;
  asset: asset | null = null;
}

export class asset {
  assetName: [] | null = null;
  customerName: [] | null = null;
}
