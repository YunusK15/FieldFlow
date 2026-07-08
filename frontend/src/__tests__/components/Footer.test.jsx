import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../../components/Footer';

describe('Footer Component', () => {
  it('renders FieldFlow text', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    // There are multiple instances of FieldFlow, so getAllByText is safer if we want all, or just use getByRole for heading
    expect(screen.getByRole('heading', { name: /FieldFlow/i })).toBeInTheDocument();
  });
  
  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Technologies/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Pest Detection/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
  });
});
