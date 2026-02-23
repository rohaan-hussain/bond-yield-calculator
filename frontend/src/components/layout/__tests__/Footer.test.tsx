import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the disclaimer text', () => {
    render(<Footer />);
    expect(
      screen.getByText(/for educational purposes only/i),
    ).toBeInTheDocument();
  });

  it('mentions not financial advice', () => {
    render(<Footer />);
    expect(screen.getByText(/not financial advice/i)).toBeInTheDocument();
  });
});
