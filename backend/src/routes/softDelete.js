/**
 * Admin Routes for Soft Delete Management
 * 
 * Endpoints for managing soft-deleted records:
 * - View deleted records
 * - Restore deleted records
 * - Permanently delete records
 * - Audit deleted records
 */

import express from 'express';
import User from '../models/User.model.js';
import Job from '../models/Job.model.js';
import Challenge from '../models/Challenge.model.js';
import Proposal from '../models/Proposal.model.js';
import Resume from '../models/Resume.model.js';
import TrackedJob from '../models/TrackedJob.model.js';
import JobAlert from '../models/JobAlert.model.js';
import JobListing from '../models/JobListing.model.js';
import Interview from '../models/Interview.model.js';
import FellowshipProfile from '../models/FellowshipProfile.model.js';
import NotificationLog from '../models/NotificationLog.model.js';
import TwoFactor from '../models/TwoFactor.model.js';
import UserProfile from '../models/UserProfile.model.js';
import AiConfig from '../models/AiConfig.model.js';
import LoginAttempt from '../models/LoginAttempt.model.js';
import { FellowshipChatRoom, FellowshipMessage } from '../models/FellowshipChat.model.js';

const router = express.Router();

// Map of model names to model objects
const MODELS = {
  User,
  Job,
  Challenge,
  Proposal,
  Resume,
  TrackedJob,
  JobAlert,
  JobListing,
  Interview,
  FellowshipProfile,
  NotificationLog,
  TwoFactor,
  UserProfile,
  AiConfig,
  LoginAttempt,
  FellowshipChatRoom,
  FellowshipMessage
};

/**
 * GET /admin/soft-delete/:model/deleted
 * Get all deleted records for a specific model
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Records per page (default: 50)
 * - sortBy: Field to sort by (default: deletedAt)
 */
router.get('/soft-delete/:model/deleted', async (req, res) => {
  try {
    const { model } = req.params;
    const { page = 1, limit = 50, sortBy = 'deletedAt' } = req.query;

    if (!MODELS[model]) {
      return res.status(400).json({
        error: 'Invalid model',
        availableModels: Object.keys(MODELS)
      });
    }

    const Model = MODELS[model];
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get deleted records with pagination
    const deletedRecords = await Model.findDeleted()
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await Model.countDeleted();

    res.json({
      success: true,
      model,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
      data: deletedRecords
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch deleted records',
      message: error.message
    });
  }
});

/**
 * GET /admin/soft-delete/:model/stats
 * Get deletion statistics for a model
 */
router.get('/soft-delete/:model/stats', async (req, res) => {
  try {
    const { model } = req.params;

    if (!MODELS[model]) {
      return res.status(400).json({
        error: 'Invalid model',
        availableModels: Object.keys(MODELS)
      });
    }

    const Model = MODELS[model];

    const totalRecords = await Model.countDocuments({ setOptions: { _recursed: true } });
    const deletedRecords = await Model.countDeleted();
    const activeRecords = await Model.countActive();

    res.json({
      success: true,
      model,
      totalRecords,
      activeRecords,
      deletedRecords,
      deletionPercentage: ((deletedRecords / totalRecords) * 100).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

/**
 * POST /admin/soft-delete/:model/:id/restore
 * Restore a specific soft-deleted record by ID
 */
router.post('/soft-delete/:model/:id/restore', async (req, res) => {
  try {
    const { model, id } = req.params;

    if (!MODELS[model]) {
      return res.status(400).json({
        error: 'Invalid model',
        availableModels: Object.keys(MODELS)
      });
    }

    const Model = MODELS[model];

    // Find the deleted record
    const deletedRecord = await Model.findWithDeleted().findById(id);

    if (!deletedRecord) {
      return res.status(404).json({
        error: 'Record not found'
      });
    }

    if (!deletedRecord.isDeleted) {
      return res.status(400).json({
        error: 'Record is not deleted'
      });
    }

    // Restore the record
    await deletedRecord.restore();

    res.json({
      success: true,
      message: `${model} record restored successfully`,
      model,
      id,
      restoredRecord: deletedRecord
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to restore record',
      message: error.message
    });
  }
});

/**
 * POST /admin/soft-delete/:model/restore-many
 * Restore multiple soft-deleted records by filter
 * 
 * Body:
 * {
 *   "filter": { field: value },
 *   "limit": 100 (optional, max 1000)
 * }
 */
router.post('/soft-delete/:model/restore-many', async (req, res) => {
  try {
    const { model } = req.params;
    const { filter = {}, limit = 100 } = req.body;

    if (!MODELS[model]) {
      return res.status(400).json({
        error: 'Invalid model',
        availableModels: Object.keys(MODELS)
      });
    }

    if (limit > 1000) {
      return res.status(400).json({
        error: 'Limit cannot exceed 1000'
      });
    }

    const Model = MODELS[model];

    // Get records to restore
    const recordsToRestore = await Model.findDeleted()
      .where(filter)
      .limit(limit)
      .lean();

    if (recordsToRestore.length === 0) {
      return res.status(404).json({
        error: 'No deleted records found matching the filter'
      });
    }

    // Restore records
    const result = await Model.restoreMany(filter);

    res.json({
      success: true,
      message: `${result.modifiedCount} ${model} records restored`,
      model,
      restored: result.modifiedCount,
      filter
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to restore records',
      message: error.message
    });
  }
});

/**
 * DELETE /admin/soft-delete/:model/:id
 * Permanently hard-delete a soft-deleted record
 */
router.delete('/soft-delete/:model/:id', async (req, res) => {
  try {
    const { model, id } = req.params;

    if (!MODELS[model]) {
      return res.status(400).json({
        error: 'Invalid model',
        availableModels: Object.keys(MODELS)
      });
    }

    const Model = MODELS[model];

    const result = await Model.permanentlyDelete({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: 'Record not found'
      });
    }

    res.json({
      success: true,
      message: `${model} record permanently deleted`,
      model,
      id
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to permanently delete record',
      message: error.message
    });
  }
});

/**
 * DELETE /admin/soft-delete/:model/permanent
 * Permanently hard-delete all soft-deleted records matching a filter
 * 
 * WARNING: This operation is irreversible!
 * 
 * Body:
 * {
 *   "filter": { field: value },
 *   "limit": 100,
 *   "confirm": true
 * }
 */
router.delete('/soft-delete/:model/permanent', async (req, res) => {
  try {
    const { model } = req.params;
    const { filter = {}, limit = 100, confirm } = req.body;

    if (!confirm) {
      return res.status(400).json({
        error: 'Permanent deletion requires confirmation',
        message: 'Set confirm: true in request body to proceed'
      });
    }

    if (!MODELS[model]) {
      return res.status(400).json({
        error: 'Invalid model',
        availableModels: Object.keys(MODELS)
      });
    }

    if (limit > 1000) {
      return res.status(400).json({
        error: 'Limit cannot exceed 1000'
      });
    }

    const Model = MODELS[model];

    // Log before deletion
    const recordsToDelete = await Model.findDeleted()
      .where(filter)
      .limit(limit)
      .lean();

    // Permanently delete
    const result = await Model.permanentlyDelete({
      isDeleted: true,
      ...filter
    });

    res.json({
      success: true,
      message: `⚠️ ${result.deletedCount} ${model} records permanently deleted (IRREVERSIBLE)`,
      model,
      permanentlyDeleted: result.deletedCount,
      filter,
      warning: 'This operation cannot be undone'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to permanently delete records',
      message: error.message
    });
  }
});

/**
 * GET /admin/soft-delete/all/summary
 * Get deletion summary across all models
 */
router.get('/soft-delete/all/summary', async (req, res) => {
  try {
    const summary = {};
    let totalDeleted = 0;
    let totalRecords = 0;

    for (const [modelName, Model] of Object.entries(MODELS)) {
      try {
        const total = await Model.countDocuments({ setOptions: { _recursed: true } });
        const deleted = await Model.countDeleted();
        const active = await Model.countActive();

        summary[modelName] = {
          total,
          active,
          deleted,
          deletionPercentage: total > 0 ? ((deleted / total) * 100).toFixed(2) : 0
        };

        totalDeleted += deleted;
        totalRecords += total;
      } catch (error) {
        summary[modelName] = {
          error: error.message
        };
      }
    }

    res.json({
      success: true,
      summary,
      totals: {
        totalRecords,
        totalDeleted,
        totalActive: totalRecords - totalDeleted,
        overallDeletionPercentage: totalRecords > 0 ? ((totalDeleted / totalRecords) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch summary',
      message: error.message
    });
  }
});

export default router;
