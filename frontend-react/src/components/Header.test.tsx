/**
 * Tests para el componente Header
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2026-01-01T00:00:00Z',
} as any;

const mockAuthContext = {
  user: mockUser,
  session: null,
  loading: false,
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  getAccessToken: vi.fn().mockResolvedValue('mock-token'),
  isAuthenticated: true,
};

describe('Header', () => {
  it('should render app title', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Header />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Gastor AI/i)).toBeTruthy();
  });

  it('should show greeting when authenticated', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Header />
      </AuthContext.Provider>
    );

    // Debe mostrar el saludo personalizado con el nombre normalizado
    expect(screen.getByText(/Test/i)).toBeTruthy();
  });

  it('should render header element', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Header />
      </AuthContext.Provider>
    );

    const header = screen.getByRole('banner');
    expect(header).toBeTruthy();
  });

  it('should render mascot image', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Header />
      </AuthContext.Provider>
    );

    const mascot = screen.getByAltText(/Mascota Gastor AI/i);
    expect(mascot).toBeTruthy();
  });
});
