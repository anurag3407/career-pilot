import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import Portfolio from '../models/Portfolio.model.js';
import { devDb } from '../utils/devDbFallback.js';

const router = express.Router();

// Get all portfolios for the authenticated user
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  
  if (global.useDevDbFallback) {
    const portfolios = devDb.getPortfolios(userId);
    return res.json({
      success: true,
      data: portfolios
    });
  }

  const portfolios = await Portfolio.find({ userId }).sort({ createdAt: -1 }).lean();
  
  res.json({
    success: true,
    data: portfolios.map(p => ({
      id: p._id.toString(),
      ...p,
      _id: undefined
    }))
  });
}));

// Create a new portfolio (for easy testing & user creation)
router.post('/', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const { title, description, deployedUrl, isDeployed } = req.body;

  if (!title) {
    throw new ApiError(400, 'Title is required');
  }

  if (global.useDevDbFallback) {
    const newPortfolio = devDb.createPortfolio(userId, { title, description, deployedUrl, isDeployed });
    return res.status(201).json({
      success: true,
      data: newPortfolio
    });
  }

  const newPortfolio = await Portfolio.create({
    userId,
    title,
    description: description || '',
    deployedUrl: deployedUrl || '',
    isDeployed: isDeployed === true || isDeployed === 'true'
  });

  res.status(201).json({
    success: true,
    data: {
      id: newPortfolio._id.toString(),
      userId: newPortfolio.userId,
      title: newPortfolio.title,
      description: newPortfolio.description,
      deployedUrl: newPortfolio.deployedUrl,
      isDeployed: newPortfolio.isDeployed,
      createdAt: newPortfolio.createdAt
    }
  });
}));

// Delete a portfolio
router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  if (global.useDevDbFallback) {
    const deleted = devDb.deletePortfolio(userId, id);
    if (!deleted) {
      throw new ApiError(404, 'Portfolio not found');
    }
    return res.json({
      success: true,
      message: 'Portfolio deleted successfully'
    });
  }

  const portfolio = await Portfolio.findById(id);

  if (!portfolio) {
    throw new ApiError(404, 'Portfolio not found');
  }

  if (portfolio.userId !== userId) {
    throw new ApiError(403, 'Access denied. You do not own this portfolio.');
  }

  await Portfolio.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Portfolio deleted successfully'
  });
}));

export default router;
