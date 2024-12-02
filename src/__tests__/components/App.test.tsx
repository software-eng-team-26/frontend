import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

describe('App Component', () => {
  const renderApp = () => {
    return render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  };

  test('renders without crashing', () => {
    renderApp();
    expect(document.body).toBeInTheDocument();
  });

  test('contains main navigation elements', () => {
    renderApp();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders main content area', () => {
    renderApp();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('contains footer', () => {
    renderApp();
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
}); 