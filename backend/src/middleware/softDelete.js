export default function softDelete(schema) {
  // Query helper to include deleted documents
  schema.query.withDeleted = function () {
    this._withDeleted = true;
    return this;
  };

  const queryMiddleware = function () {
    if (this._withDeleted) return;
    // Skip filtering for upsert operations to allow restoring soft-deleted docs
    const isUpsert = this.options && this.options.upsert;
    if (isUpsert) return;
    const q = this.getQuery ? this.getQuery() : (this._conditions || {});
    if (q && q.includeDeleted) {
      // caller asked to include deleted via filter flag
      delete q.includeDeleted;
      this.setQuery && this.setQuery(q);
      return;
    }
    // only add filter if caller didn't already filter on isDeleted
    if (!q || typeof q.isDeleted === 'undefined') {
      this.where({ isDeleted: { $ne: true } });
    }
  };

  // Apply to common query operations
  ['count', 'countDocuments', 'find', 'findOne', 'findOneAndUpdate', 'update', 'updateOne', 'updateMany'].forEach(hook => {
    schema.pre(hook, queryMiddleware);
  });

  // Soft-delete and restore helpers
  schema.statics.softDeleteById = function (id) {
    return this.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
  };

  schema.statics.restoreById = function (id) {
    return this.findByIdAndUpdate({ _id: id, includeDeleted: true }, { isDeleted: false, deletedAt: null }, { new: true });
  };

  schema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function () {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };
}
