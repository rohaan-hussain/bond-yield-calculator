import api from './api';
import type { BondInput, BondResult } from '../types/bond.types';

export async function calculateBond(input: BondInput): Promise<BondResult> {
  const response = await api.post<BondResult>('/bond/calculate', input);
  return response.data;
}
