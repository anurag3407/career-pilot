import PortfolioContext from './PortfolioContext';
import dummyData from '../data/dummyData';

export default function PortfolioProvider({ children, value }) {
  return (
    <PortfolioContext.Provider value={{ portfolioData: value || dummyData }}>
      {children}
    </PortfolioContext.Provider>
  );
}
