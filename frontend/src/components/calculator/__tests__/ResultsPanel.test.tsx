import { render, screen } from '@testing-library/react';
import ResultsPanel from '../ResultsPanel';
import type { BondResult } from '../../../types/bond.types';

describe('ResultsPanel', () => {
  const mockResult: BondResult = {
    currentYield: 5.26,
    ytm: 5.68,
    totalInterest: 500,
    bondStatus: 'discount',
    cashFlowSchedule: [],
  };

  it('renders the Results heading', () => {
    render(<ResultsPanel result={mockResult} />);
    expect(screen.getByText('Results')).toBeInTheDocument();
  });

  it('displays formatted current yield', () => {
    render(<ResultsPanel result={mockResult} />);
    expect(screen.getByText('5.26%')).toBeInTheDocument();
  });

  it('displays formatted yield to maturity', () => {
    render(<ResultsPanel result={mockResult} />);
    expect(screen.getByText('5.68%')).toBeInTheDocument();
  });

  it('displays formatted total interest', () => {
    render(<ResultsPanel result={mockResult} />);
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  it('displays bond status badge', () => {
    render(<ResultsPanel result={mockResult} />);
    expect(screen.getByText('Discount')).toBeInTheDocument();
  });

  it('displays result labels', () => {
    render(<ResultsPanel result={mockResult} />);
    expect(screen.getByText('Current Yield')).toBeInTheDocument();
    expect(screen.getByText('Yield to Maturity')).toBeInTheDocument();
    expect(screen.getByText('Total Interest')).toBeInTheDocument();
    expect(screen.getByText('Bond Status')).toBeInTheDocument();
  });

  it('renders premium status correctly', () => {
    const premiumResult: BondResult = {
      ...mockResult,
      bondStatus: 'premium',
    };
    render(<ResultsPanel result={premiumResult} />);
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('renders par status correctly', () => {
    const parResult: BondResult = {
      ...mockResult,
      bondStatus: 'par',
    };
    render(<ResultsPanel result={parResult} />);
    expect(screen.getByText('Par')).toBeInTheDocument();
  });

  it('formats large currency values correctly', () => {
    const largeResult: BondResult = {
      ...mockResult,
      totalInterest: 1234567.89,
    };
    render(<ResultsPanel result={largeResult} />);
    expect(screen.getByText('$1,234,567.89')).toBeInTheDocument();
  });
});
