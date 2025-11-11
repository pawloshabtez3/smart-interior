import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('should render the branding logo', () => {
    render(<Header />);
    const logo = screen.getByText('S');
    expect(logo).toBeInTheDocument();
  });

  it('should render the application name', () => {
    render(<Header />);
    const appName = screen.getByText('Smart Interior');
    expect(appName).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Header />);
    const previewLink = screen.getByText('Preview');
    const homeLink = screen.getByText('Home');
    
    expect(previewLink).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
  });

  it('should have correct link hrefs', () => {
    render(<Header />);
    
    const links = screen.getAllByRole('link');
    const logoLink = links[0];
    const previewLink = links[1];
    const homeLink = links[2];
    
    expect(logoLink).toHaveAttribute('href', '/');
    expect(previewLink).toHaveAttribute('href', '/preview/living-room');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
