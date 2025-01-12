//@ts-nocheck

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('Router', () => {
  test('landing on home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('landing on a non-existent page shows 404', () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  test('protected route redirects to login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('public routes are accessible without authentication', () => {
    const publicRoutes = ['/', '/about', '/contact'];
    
    publicRoutes.forEach(route => {
      render(
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  test('nested routes render correctly', () => {
    render(
      <MemoryRouter initialEntries={['/settings/profile']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
}); 