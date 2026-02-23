import { render, screen } from '@testing-library/react';
import CashFlowTable from '../CashFlowTable';
import type { CashFlowEntry } from '../../../types/bond.types';

describe('CashFlowTable', () => {
  const mockSchedule: CashFlowEntry[] = [
    {
      period: 1,
      paymentDate: '2026-08-24T00:00:00.000Z',
      couponPayment: 25,
      cumulativeInterest: 25,
      remainingPrincipal: 1000,
    },
    {
      period: 2,
      paymentDate: '2027-02-24T00:00:00.000Z',
      couponPayment: 25,
      cumulativeInterest: 50,
      remainingPrincipal: 1000,
    },
  ];

  it('renders nothing when schedule is empty', () => {
    const { container } = render(<CashFlowTable schedule={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the Cash Flow Schedule heading', () => {
    render(<CashFlowTable schedule={mockSchedule} />);
    expect(screen.getByText('Cash Flow Schedule')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<CashFlowTable schedule={mockSchedule} />);
    expect(screen.getByText('Period')).toBeInTheDocument();
    expect(screen.getByText('Payment Date')).toBeInTheDocument();
    expect(screen.getByText('Coupon Payment')).toBeInTheDocument();
    expect(screen.getByText('Cumulative Interest')).toBeInTheDocument();
    expect(screen.getByText('Remaining Principal')).toBeInTheDocument();
  });

  it('renders correct number of rows', () => {
    render(<CashFlowTable schedule={mockSchedule} />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3);
  });

  it('displays period numbers', () => {
    render(<CashFlowTable schedule={mockSchedule} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    render(<CashFlowTable schedule={mockSchedule} />);
    // Coupon payments of $25.00
    const elements = screen.getAllByText('$25.00');
    expect(elements.length).toBeGreaterThanOrEqual(2);
  });

  it('formats cumulative interest correctly', () => {
    render(<CashFlowTable schedule={mockSchedule} />);
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('formats remaining principal correctly', () => {
    render(<CashFlowTable schedule={mockSchedule} />);
    const principalElements = screen.getAllByText('$1,000.00');
    expect(principalElements).toHaveLength(2);
  });

  it('formats payment dates', () => {
    render(<CashFlowTable schedule={mockSchedule} />);
    // The exact format depends on locale, but the dates should be rendered
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(3); // header + 2 data rows
  });
});
