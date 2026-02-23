import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders an SVG element', () => {
    render(<LoadingSpinner />);
    const svg = screen.getByLabelText('Loading');
    expect(svg).toBeInTheDocument();
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });

  it('has the spin animation class', () => {
    render(<LoadingSpinner />);
    const svg = screen.getByLabelText('Loading');
    expect(svg).toHaveAttribute(
      'class',
      expect.stringContaining('animate-spin'),
    );
  });
});
