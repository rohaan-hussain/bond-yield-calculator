import { render, screen } from '@testing-library/react';

const mockCalculate = jest.fn();
const mockUseBondCalculator = jest.fn();

jest.mock('../../hooks/useBondCalculator', () => ({
  useBondCalculator: mockUseBondCalculator,
}));

import CalculatorPage from '../CalculatorPage';

describe('CalculatorPage', () => {
  const defaultHookReturn = {
    result: null,
    isLoading: false,
    error: null,
    calculate: mockCalculate,
  };

  beforeEach(() => {
    mockUseBondCalculator.mockReturnValue(defaultHookReturn);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the bond calculator form', () => {
    render(<CalculatorPage />);
    expect(screen.getByText('Bond Parameters')).toBeInTheDocument();
  });

  it('does not render results when result is null', () => {
    render(<CalculatorPage />);
    expect(screen.queryByText('Results')).not.toBeInTheDocument();
    expect(screen.queryByText('Cash Flow Schedule')).not.toBeInTheDocument();
  });

  it('renders results panel when result is available', () => {
    mockUseBondCalculator.mockReturnValue({
      ...defaultHookReturn,
      result: {
        currentYield: 5.26,
        ytm: 5.68,
        totalInterest: 500,
        bondStatus: 'discount',
        cashFlowSchedule: [
          {
            period: 1,
            paymentDate: '2026-08-24T00:00:00.000Z',
            couponPayment: 25,
            cumulativeInterest: 25,
            remainingPrincipal: 1000,
          },
        ],
      },
    });

    render(<CalculatorPage />);
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('Cash Flow Schedule')).toBeInTheDocument();
  });

  it('passes isLoading to the form', () => {
    mockUseBondCalculator.mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });

    render(<CalculatorPage />);
    expect(screen.getByText('Calculating...')).toBeInTheDocument();
  });

  it('does not render cash flow table when schedule is empty', () => {
    mockUseBondCalculator.mockReturnValue({
      ...defaultHookReturn,
      result: {
        currentYield: 5.26,
        ytm: 5.68,
        totalInterest: 500,
        bondStatus: 'par',
        cashFlowSchedule: [],
      },
    });

    render(<CalculatorPage />);
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.queryByText('Cash Flow Schedule')).not.toBeInTheDocument();
  });
});
