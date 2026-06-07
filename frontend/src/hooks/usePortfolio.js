import { useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';

/**
 * Hook to access the portfolio context values (rawData, normalized data, etc.).
 * Must be used inside a PortfolioProvider.
 */
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
