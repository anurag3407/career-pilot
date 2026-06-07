import { createContext } from 'react';

/**
 * Context object that holds the state for portfolio templates.
 * Shared between PortfolioProvider and usePortfolio hook.
 */
export const PortfolioContext = createContext(null);
