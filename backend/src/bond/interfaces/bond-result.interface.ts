export interface CashFlowEntry {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondCalculationResult {
  currentYield: number;
  ytm: number;
  totalInterest: number;
  bondStatus: 'premium' | 'discount' | 'par';
  cashFlowSchedule: CashFlowEntry[];
}
