import type { BondInput, BondResult } from '../../types/bond.types';

const mockPost = jest.fn();

jest.mock('../api', () => ({
  __esModule: true,
  default: { post: mockPost },
}));

// Must import after mock setup
import { calculateBond } from '../bondApi';

describe('calculateBond', () => {
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
    cashFlowSchedule: [
      {
        period: 1,
        paymentDate: '2026-08-24',
        couponPayment: 25,
        cumulativeInterest: 25,
        remainingPrincipal: 1000,
      },
    ],
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls api.post with correct endpoint and payload', async () => {
    mockPost.mockResolvedValue({ data: mockResult });

    await calculateBond(mockInput);

    expect(mockPost).toHaveBeenCalledWith('/bond/calculate', mockInput);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('returns bond result data from response', async () => {
    mockPost.mockResolvedValue({ data: mockResult });

    const result = await calculateBond(mockInput);

    expect(result).toEqual(mockResult);
  });

  it('propagates API errors', async () => {
    const error = new Error('Network Error');
    mockPost.mockRejectedValue(error);

    await expect(calculateBond(mockInput)).rejects.toThrow('Network Error');
  });
});
