import { renderHook, act } from '@testing-library/react';
import type { BondInput, BondResult } from '../../types/bond.types';

const mockCalculateBond = jest.fn();

jest.mock('../../services/bondApi', () => ({
  calculateBond: mockCalculateBond,
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { useBondCalculator } from '../useBondCalculator';
import { toast } from 'sonner';

describe('useBondCalculator', () => {
  const mockInput: BondInput = {
    faceValue: 1000,
    couponRate: 5,
    marketPrice: 950,
    yearsToMaturity: 10,
    couponFrequency: 'semi-annual',
  };

  const mockResult: BondResult = {
    currentYield: 5.26,
    ytm: 5.68,
    totalInterest: 500,
    bondStatus: 'discount',
    cashFlowSchedule: [],
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useBondCalculator());

    expect(result.current.result).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets result on successful calculation', async () => {
    mockCalculateBond.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useBondCalculator());

    await act(async () => {
      await result.current.calculate(mockInput);
    });

    expect(result.current.result).toEqual(mockResult);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('shows success toast on successful calculation', async () => {
    mockCalculateBond.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useBondCalculator());

    await act(async () => {
      await result.current.calculate(mockInput);
    });

    expect(toast.success).toHaveBeenCalledWith(
      'Bond yield calculated successfully!',
    );
  });

  it('sets error message on failure', async () => {
    mockCalculateBond.mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useBondCalculator());

    await act(async () => {
      await result.current.calculate(mockInput);
    });

    expect(result.current.error).toBe('Server error');
    expect(result.current.result).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('shows error toast on failure', async () => {
    mockCalculateBond.mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useBondCalculator());

    await act(async () => {
      await result.current.calculate(mockInput);
    });

    expect(toast.error).toHaveBeenCalledWith('Server error');
  });

  it('uses fallback message for non-Error exceptions', async () => {
    mockCalculateBond.mockRejectedValue('something went wrong');

    const { result } = renderHook(() => useBondCalculator());

    await act(async () => {
      await result.current.calculate(mockInput);
    });

    expect(result.current.error).toBe('Failed to calculate bond yield');
    expect(toast.error).toHaveBeenCalledWith('Failed to calculate bond yield');
  });

  it('manages loading state during calculation', async () => {
    let resolvePromise: (value: BondResult) => void;
    mockCalculateBond.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    const { result } = renderHook(() => useBondCalculator());

    expect(result.current.isLoading).toBe(false);

    let calculatePromise: Promise<void>;
    act(() => {
      calculatePromise = result.current.calculate(mockInput);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise!(mockResult);
      await calculatePromise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('clears previous error on new calculation', async () => {
    mockCalculateBond.mockRejectedValueOnce(new Error('First error'));

    const { result } = renderHook(() => useBondCalculator());

    await act(async () => {
      await result.current.calculate(mockInput);
    });

    expect(result.current.error).toBe('First error');

    mockCalculateBond.mockResolvedValueOnce(mockResult);

    await act(async () => {
      await result.current.calculate(mockInput);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.result).toEqual(mockResult);
  });
});
