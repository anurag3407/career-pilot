/**
 * Simple object diffing utility
 * Returns an object containing operations: 'set' or 'del'
 */
export const getObjectDiff = (oldObj, newObj) => {
  const diff = {};
  
  // Find added or changed fields
  for (const key in newObj) {
    if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      diff[key] = { type: 'set', value: newObj[key] };
    }
  }
  
  // Find removed fields
  for (const key in oldObj) {
    if (!(key in newObj)) {
      diff[key] = { type: 'del' };
    }
  }
  
  return Object.keys(diff).length > 0 ? diff : null;
};

/**
 * Apply diff to an object immutably
 */
export const applyDiff = (baseObj, diff) => {
  if (!diff) return baseObj;
  
  const result = { ...baseObj };
  for (const key in diff) {
    const op = diff[key];
    if (op.type === 'del') {
      delete result[key];
    } else if (op.type === 'set') {
      result[key] = op.value;
    }
  }
  return result;
};
