import React, { createContext, useContext } from 'react';
import { PortfolioProvider as GlobalProvider, usePortfolio as useGlobalPortfolio } from '../../../../context/PortfolioContext';

// Re-export the global context/hook for this template's components
export { usePortfolio } from '../../../../context/PortfolioContext';

// Local provider that wraps the global one (allows future template-specific state)
export function PortfolioProvider({ children, portfolioData }) {
  return <GlobalProvider portfolioData={portfolioData}>{children}</GlobalProvider>;
}

export default PortfolioProvider;
