import { useState } from 'react';
import { toast } from 'sonner';
import type { BondInput, BondResult } from '../types/bond.types';
import { calculateBond } from '../services/bondApi';

export function useBondCalculator() {
  const [result, setResult] = useState<BondResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (input: BondInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await calculateBond(input);
      setResult(data);
      toast.success('Bond yield calculated successfully!');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to calculate bond yield';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { result, isLoading, error, calculate };
}
