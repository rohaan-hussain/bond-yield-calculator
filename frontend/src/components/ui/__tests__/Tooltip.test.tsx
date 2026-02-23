import { render, screen } from '@testing-library/react';
import Tooltip from '../Tooltip';

describe('Tooltip', () => {
  it('renders children content', () => {
    render(<Tooltip text="Help text">Label</Tooltip>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('renders the question mark icon', () => {
    render(<Tooltip text="Help text">Label</Tooltip>);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('renders tooltip text in the DOM', () => {
    render(<Tooltip text="This is helpful info">Label</Tooltip>);
    expect(screen.getByText('This is helpful info')).toBeInTheDocument();
  });

  it('renders complex children', () => {
    render(
      <Tooltip text="Help">
        <span data-testid="child">Complex child</span>
      </Tooltip>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
