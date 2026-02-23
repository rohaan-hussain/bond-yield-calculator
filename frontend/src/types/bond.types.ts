export interface BondInput {
  faceValue: number;
  couponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
}

export interface CashFlowEntry {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondResult {
  currentYield: number;
  ytm: number;
  totalInterest: number;
  bondStatus: 'premium' | 'discount' | 'par';
  cashFlowSchedule: CashFlowEntry[];
}
