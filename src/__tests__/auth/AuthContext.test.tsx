// @ts-nocheck

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../store/auth';

const TestComponent = () => {
  const { login, logout, isAuthenticated } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'logged-in' : 'logged-out'}</div>
      <button onClick={() => login({ email: 'test@test.com', password: 'password' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('Auth Store', () => {
  const renderAuthComponent = () => {
    return render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    useAuth.getState().logout();
  });

  test('initial state is unauthenticated', () => {
    renderAuthComponent();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');
  });

  test('login updates authentication state', async () => {
    renderAuthComponent();
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
    });
  });

  test('logout clears authentication state', async () => {
    renderAuthComponent();
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
    });
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');
  });

  test('auth state persists across component remounts', async () => {
    const { unmount } = renderAuthComponent();
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
    });
    unmount();
    renderAuthComponent();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
  });
}); 