import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the octofit home page', () => {
  render(<App />);
  expect(screen.getByText(/welcome to octofit tracker/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /open activities/i })).toBeInTheDocument();
});
