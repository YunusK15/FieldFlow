import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../pages/Register';

// Mock context to prevent errors in pages that use it
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    authFetch: vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) })),
  })
}));

// Mock chart library to prevent canvas errors in tests
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart" />,
  Line: () => <div data-testid="mock-line-chart" />,
  Doughnut: () => <div data-testid="mock-doughnut-chart" />
}));

describe('Register Page', () => {
  it('renders without crashing', () => {
    const { container } = render(<MemoryRouter><Register /></MemoryRouter>);
    expect(container).toBeInTheDocument();
  });
});
