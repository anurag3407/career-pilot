import { createContext } from 'react';
import dummyData from '../data/dummyData';

const PortfolioContext = createContext({
  portfolioData: dummyData,
});

export default PortfolioContext;
