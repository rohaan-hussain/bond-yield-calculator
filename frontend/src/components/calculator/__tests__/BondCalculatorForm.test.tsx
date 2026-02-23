import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BondCalculatorForm from '../BondCalculatorForm';

describe('BondCalculatorForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  function renderForm(isLoading = false) {
    return render(
      <BondCalculatorForm onSubmit={mockOnSubmit} isLoading={isLoading} />,
    );
  }

  it('renders the form heading', () => {
    renderForm();
    expect(screen.getByText('Bond Parameters')).toBeInTheDocument();
  });

  it('renders all input fields', () => {
    renderForm();
    expect(screen.getByPlaceholderText('1000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('5.0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('950')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('10')).toBeInTheDocument();
  });

  it('renders the coupon frequency dropdown with all options', () => {
    renderForm();
    const select = screen.getByDisplayValue('Semi-Annual');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Quarterly')).toBeInTheDocument();
    expect(screen.getByText('Annual')).toBeInTheDocument();
  });

  it('renders Calculate Yield and Reset buttons', () => {
    renderForm();
    expect(
      screen.getByRole('button', { name: /calculate yield/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('shows "Calculating..." when loading', () => {
    renderForm(true);
    expect(screen.getByText('Calculating...')).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    renderForm(true);
    expect(screen.getByRole('button', { name: /calculating/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /reset/i })).toBeDisabled();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /calculate yield/i }));

    expect(mockOnSubmit).not.toHaveBeenCalled();
    // Should show error messages for required fields
    const errors = screen.getAllByText(
      /is required|must be a number|expected number|invalid input/i,
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it('calls onSubmit with valid data', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText('1000'), '1000');
    await user.type(screen.getByPlaceholderText('5.0'), '5');
    await user.type(screen.getByPlaceholderText('950'), '950');
    await user.type(screen.getByPlaceholderText('10'), '10');

    await user.click(screen.getByRole('button', { name: /calculate yield/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      faceValue: 1000,
      couponRate: 5,
      marketPrice: 950,
      yearsToMaturity: 10,
      couponFrequency: 'semi-annual',
    });
  });

  it('allows changing coupon frequency', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByDisplayValue('Semi-Annual'), 'annual');

    await user.type(screen.getByPlaceholderText('1000'), '1000');
    await user.type(screen.getByPlaceholderText('5.0'), '5');
    await user.type(screen.getByPlaceholderText('950'), '950');
    await user.type(screen.getByPlaceholderText('10'), '10');

    await user.click(screen.getByRole('button', { name: /calculate yield/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ couponFrequency: 'annual' }),
    );
  });

  it('resets form fields when Reset button is clicked', async () => {
    const user = userEvent.setup();
    renderForm();

    const faceValueInput = screen.getByPlaceholderText(
      '1000',
    ) as HTMLInputElement;
    const couponRateInput = screen.getByPlaceholderText(
      '5.0',
    ) as HTMLInputElement;

    await user.type(faceValueInput, '1000');
    await user.type(couponRateInput, '5');

    expect(faceValueInput.value).toBe('1000');
    expect(couponRateInput.value).toBe('5');

    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(faceValueInput.value).toBe('');
    expect(couponRateInput.value).toBe('');
  });

  it('clears validation errors on reset', async () => {
    const user = userEvent.setup();
    renderForm();

    // Trigger validation errors
    await user.click(screen.getByRole('button', { name: /calculate yield/i }));
    expect(
      screen.getAllByText(
        /is required|must be a number|expected number|invalid input/i,
      ).length,
    ).toBeGreaterThan(0);

    // Reset the form
    await user.click(screen.getByRole('button', { name: /reset/i }));

    // Errors should be cleared
    expect(
      screen.queryAllByText(
        /is required|must be a number|expected number|invalid input/i,
      ),
    ).toHaveLength(0);
  });

  it('shows validation error for invalid face value', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText('1000'), '0');
    await user.type(screen.getByPlaceholderText('5.0'), '5');
    await user.type(screen.getByPlaceholderText('950'), '950');
    await user.type(screen.getByPlaceholderText('10'), '10');

    await user.click(screen.getByRole('button', { name: /calculate yield/i }));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for decimal years to maturity', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText('1000'), '1000');
    await user.type(screen.getByPlaceholderText('5.0'), '5');
    await user.type(screen.getByPlaceholderText('950'), '950');
    await user.type(screen.getByPlaceholderText('10'), '5.5');

    await user.click(screen.getByRole('button', { name: /calculate yield/i }));

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/whole number/i)).toBeInTheDocument();
  });
});
