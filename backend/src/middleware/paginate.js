import { asyncHandler } from './errorHandler.js';

/**
 * Pagination middleware
 * Reads page, limit, sort from query params
 * Attaches pagination helpers to req.paginate
 * Usage: router.get('/', verifyToken, paginate(), asyncHandler(...))
 */
export const paginate = () =>
  asyncHandler(async (req, res, next) => {
    // Parse page (default 1, minimum 1)
    const page = Math.max(1, parseInt(req.query.page) || 1);

    // Parse limit (default 10, max 100)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

    // Parse sort field and direction
    // Usage: ?sort=createdAt or ?sort=-createdAt (minus = descending)
    const sortParam = req.query.sort || '-createdAt';
    const sortOrder = sortParam.startsWith('-') ? -1 : 1;
    const sortField = sortParam.replace(/^-/, '');

    const skip = (page - 1) * limit;

    // Attach to req so route handlers can use it
    req.paginate = {
      page,
      limit,
      skip,
      sort: { [sortField]: sortOrder }
    };

    next();
  });

/**
 * Helper to build consistent paginated response
 * Call this inside your route handler to send the response
 */
export const paginatedResponse = (res, { data, total, page, limit }) => {
  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
};