import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}

describe('Header', () => {
  it('renders the app title', () => {
    renderHeader();
    expect(screen.getByText('Bond Yield Calculator')).toBeInTheDocument();
  });

  it('renders Calculator navigation link', () => {
    renderHeader();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
  });

  it('renders FAQ navigation link', () => {
    renderHeader();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('has correct link destinations', () => {
    renderHeader();
    const calcLink = screen.getByText('Calculator').closest('a');
    const faqLink = screen.getByText('FAQ').closest('a');

    expect(calcLink).toHaveAttribute('href', '/');
    expect(faqLink).toHaveAttribute('href', '/faq');
  });

  it('title links to home page', () => {
    renderHeader();
    const titleLink = screen.getByText('Bond Yield Calculator').closest('a');
    expect(titleLink).toHaveAttribute('href', '/');
  });
});
