import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FaqPage from '../FaqPage';
import { faqData } from '../../data/faqData';

describe('FaqPage', () => {
  it('renders the FAQ heading', () => {
    render(<FaqPage />);
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('renders all FAQ questions', () => {
    render(<FaqPage />);
    for (const item of faqData) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    }
  });

  it('does not show any answers initially', () => {
    render(<FaqPage />);
    for (const item of faqData) {
      expect(screen.queryByText(item.answer)).not.toBeInTheDocument();
    }
  });

  it('shows answer when question is clicked', async () => {
    const user = userEvent.setup();
    render(<FaqPage />);

    await user.click(screen.getByText(faqData[0].question));
    expect(screen.getByText(faqData[0].answer)).toBeInTheDocument();
  });

  it('hides answer when same question is clicked again', async () => {
    const user = userEvent.setup();
    render(<FaqPage />);

    await user.click(screen.getByText(faqData[0].question));
    expect(screen.getByText(faqData[0].answer)).toBeInTheDocument();

    await user.click(screen.getByText(faqData[0].question));
    expect(screen.queryByText(faqData[0].answer)).not.toBeInTheDocument();
  });

  it('only shows one answer at a time', async () => {
    const user = userEvent.setup();
    render(<FaqPage />);

    // Open first question
    await user.click(screen.getByText(faqData[0].question));
    expect(screen.getByText(faqData[0].answer)).toBeInTheDocument();

    // Open second question — first should close
    await user.click(screen.getByText(faqData[1].question));
    expect(screen.queryByText(faqData[0].answer)).not.toBeInTheDocument();
    expect(screen.getByText(faqData[1].answer)).toBeInTheDocument();
  });
});
