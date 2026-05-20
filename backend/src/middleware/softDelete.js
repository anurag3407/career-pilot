/**
 * Soft Delete Plugin for Mongoose
 * 
 * Adds soft delete functionality to MongoDB documents
 * - Adds isDeleted (Boolean) and deletedAt (Date) fields
 * - Automatically filters deleted records in queries
 * - Provides restore and permanentDelete methods
 * - Adds methods to find only deleted or non-deleted records
 */

export const softDeletePlugin = (schema, options = {}) => {
  const {
    deletedAtField = 'deletedAt',
    isDeletedField = 'isDeleted',
    overrideMethods = true,
    indexFields = true
  } = options;

  // Add fields to schema
  schema.add({
    [isDeletedField]: {
      type: Boolean,
      default: false,
      index: indexFields
    },
    [deletedAtField]: {
      type: Date,
      default: null,
      index: indexFields
    }
  });

  // Middleware: automatically exclude soft-deleted documents from queries
  if (overrideMethods) {
    const excludeDeleted = { [isDeletedField]: false };

    // find() - Find all non-deleted documents
    schema.pre(/^find/, function () {
      if (!this.getOptions()._recursed) {
        this.where(excludeDeleted);
      }
    });

    // findById() - Find by ID excluding deleted
    schema.pre('findById', function () {
      if (!this.getOptions()._recursed) {
        this.where(excludeDeleted);
      }
    });

    // findByIdAndUpdate() - Update non-deleted documents
    schema.pre('findByIdAndUpdate', function () {
      if (!this.getOptions()._recursed) {
        this.where(excludeDeleted);
      }
    });

    // updateOne() - Update non-deleted documents
    schema.pre('updateOne', function () {
      if (!this.getOptions()._recursed) {
        this.where(excludeDeleted);
      }
    });

    // updateMany() - Update non-deleted documents
    schema.pre('updateMany', function () {
      if (!this.getOptions()._recursed) {
        this.where(excludeDeleted);
      }
    });

    // deleteOne() - Convert to soft delete
    schema.pre('deleteOne', function (next) {
      this.updateOne(
        {},
        {
          [isDeletedField]: true,
          [deletedAtField]: new Date()
        }
      );
      next();
    });

    // deleteMany() - Convert to soft delete
    schema.pre('deleteMany', function (next) {
      this.updateMany(
        {},
        {
          [isDeletedField]: true,
          [deletedAtField]: new Date()
        }
      );
      next();
    });

    // findByIdAndDelete() - Convert to soft delete
    schema.pre('findByIdAndDelete', async function (next) {
      const id = this.getFilter()._id;
      this.updateOne(
        { _id: id },
        {
          [isDeletedField]: true,
          [deletedAtField]: new Date()
        }
      );
      next();
    });
  }

  // Instance method: soft delete a single document
  schema.methods.softDelete = function () {
    this[isDeletedField] = true;
    this[deletedAtField] = new Date();
    return this.save();
  };

  // Instance method: restore a soft-deleted document
  schema.methods.restore = function () {
    this[isDeletedField] = false;
    this[deletedAtField] = null;
    return this.save();
  };

  // Static method: find only deleted documents
  schema.statics.findDeleted = function () {
    return this.find({ [isDeletedField]: true });
  };

  // Static method: find only non-deleted documents
  schema.statics.findActive = function () {
    return this.find({ [isDeletedField]: false });
  };

  // Static method: find all documents including deleted
  schema.statics.findWithDeleted = function () {
    return this.find().setOptions({ _recursed: true });
  };

  // Static method: soft delete by filter
  schema.statics.softDeleteMany = function (filter) {
    return this.updateMany(filter, {
      [isDeletedField]: true,
      [deletedAtField]: new Date()
    });
  };

  // Static method: restore deleted documents by filter
  schema.statics.restoreMany = function (filter) {
    return this.updateMany(
      { ...filter, [isDeletedField]: true },
      {
        [isDeletedField]: false,
        [deletedAtField]: null
      }
    );
  };

  // Static method: permanently delete (hard delete)
  schema.statics.permanentlyDelete = function (filter) {
    return this.deleteMany(filter);
  };

  // Static method: count non-deleted documents
  schema.statics.countActive = function (filter = {}) {
    return this.countDocuments({ ...filter, [isDeletedField]: false });
  };

  // Static method: count deleted documents
  schema.statics.countDeleted = function (filter = {}) {
    return this.countDocuments({ ...filter, [isDeletedField]: true });
  };

  return schema;
};

/**
 * Soft Delete Middleware for Express
 * Adds helper methods to request object for soft delete operations
 */
export const softDeleteMiddleware = (req, res, next) => {
  /**
   * Save deleted records and related info for audit/logging
   */
  req.softDelete = {
    deletedBy: req.user?._id || null,
    deletedAt: new Date(),
    reason: null
  };

  next();
};

/**
 * Query filter helper to exclude soft-deleted records
 * Use in cases where pre-hooks won't apply automatically
 */
export const excludeDeleted = (filter = {}) => {
  return {
    ...filter,
    isDeleted: false
  };
};

/**
 * Query filter helper to include soft-deleted records
 */
export const includeDeleted = () => {
  return { setOptions: { _recursed: true } };
};

export default {
  softDeletePlugin,
  softDeleteMiddleware,
  excludeDeleted,
  includeDeleted
};
