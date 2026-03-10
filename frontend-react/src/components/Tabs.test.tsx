/**
 * Tests para el componente Tabs
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabPanel } from './Tabs';

describe('Tabs', () => {
  it('should render all tabs', () => {
    const handleTabChange = vi.fn();
    render(<Tabs activeTab="registrar" onTabChange={handleTabChange} />);

    expect(screen.getByText(/Registrar/i)).toBeTruthy();
    expect(screen.getByText(/Análisis/i)).toBeTruthy();
    expect(screen.getByText(/Transacciones/i)).toBeTruthy();
  });

  it('should highlight active tab', () => {
    const handleTabChange = vi.fn();
    const { container } = render(<Tabs activeTab="analisis" onTabChange={handleTabChange} />);

    const tabs = container.querySelectorAll('.tab');
    expect(tabs[1].classList.contains('active')).toBe(true);
  });

  it('should call onTabChange when clicking a tab', () => {
    const handleTabChange = vi.fn();
    render(<Tabs activeTab="registrar" onTabChange={handleTabChange} />);

    const analysisTab = screen.getByText(/Análisis/i);
    fireEvent.click(analysisTab);

    expect(handleTabChange).toHaveBeenCalledWith('analisis');
  });
});

describe('TabPanel', () => {
  it('should render content when tab is active', () => {
    render(
      <TabPanel tabId="registrar" activeTab="registrar">
        <div>Test Content</div>
      </TabPanel>
    );

    expect(screen.getByText(/Test Content/i)).toBeTruthy();
  });

  it('should not render content when tab is inactive', () => {
    const { container } = render(
      <TabPanel tabId="registrar" activeTab="analisis">
        <div>Test Content</div>
      </TabPanel>
    );

    expect(container.firstChild).toBeNull();
  });
});
