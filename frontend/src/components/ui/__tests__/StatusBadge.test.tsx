import { render, screen } from '@testing-library/react';
import StatusBadge from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders "Par" label for par status', () => {
    render(<StatusBadge status="par" />);
    expect(screen.getByText('Par')).toBeInTheDocument();
  });

  it('renders "Premium" label for premium status', () => {
    render(<StatusBadge status="premium" />);
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('renders "Discount" label for discount status', () => {
    render(<StatusBadge status="discount" />);
    expect(screen.getByText('Discount')).toBeInTheDocument();
  });

  it('shows correct tooltip for par status', () => {
    render(<StatusBadge status="par" />);
    expect(
      screen.getByText('Bond is trading at face value'),
    ).toBeInTheDocument();
  });

  it('shows correct tooltip for premium status', () => {
    render(<StatusBadge status="premium" />);
    expect(
      screen.getByText('Bond is trading above face value'),
    ).toBeInTheDocument();
  });

  it('shows correct tooltip for discount status', () => {
    render(<StatusBadge status="discount" />);
    expect(
      screen.getByText('Bond is trading below face value'),
    ).toBeInTheDocument();
  });

  it('applies green styling for par status', () => {
    render(<StatusBadge status="par" />);
    const badge = screen.getByText('Par');
    expect(badge.className).toContain('bg-green-100');
  });

  it('applies amber styling for premium status', () => {
    render(<StatusBadge status="premium" />);
    const badge = screen.getByText('Premium');
    expect(badge.className).toContain('bg-amber-100');
  });

  it('applies red styling for discount status', () => {
    render(<StatusBadge status="discount" />);
    const badge = screen.getByText('Discount');
    expect(badge.className).toContain('bg-red-100');
  });
});
