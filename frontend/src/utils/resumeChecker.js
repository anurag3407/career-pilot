// Configuration Constants for Validation Integrity
const MIN_BULLET_LENGTH = 10;
const NORMALIZE_REGEX = /[^a-z0-9\s]/g;

export class ResumeConsistencyChecker {
  static checkDateConsistency(dateStrings = []) {
    let hasNumericFormat = false;
    let hasTextualFormat = false;

    // Matches YYYY-MM (HTML5 default), MM/YYYY, or M/YYYY digits
    const numericRegex = /^(\d{4}-\d{2}|\d{1,2}\/\d{4})$/;
    // Matches full or abbreviated month names followed by a 4-digit year
    const textualRegex = /^(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december)\s+\d{4}$/i;
    // Bypasses isolated years or active status indicators
    const ignoreRegex = /^(\d{4}|present|current)$/i;

    dateStrings.forEach(dateStr => {
      if (!dateStr) return;
      const trimmed = dateStr.trim().toLowerCase();
      
      if (ignoreRegex.test(trimmed)) return;
      if (numericRegex.test(trimmed)) hasNumericFormat = true;
      if (textualRegex.test(trimmed)) hasTextualFormat = true;
    });

    const errors = [];
    if (hasNumericFormat && hasTextualFormat) {
      errors.push({
        type: 'date',
        message: 'Inconsistent date formatting discovered. Maintain uniform timeline notation schemas across all entries (e.g., choose either "08/2024" or "August 2024").',
        severity: 'error',
        offendingText: dateStrings.filter(Boolean).join(' | ')
      });
    }
    return errors;
  }

  static checkTenseConsistency(pastRoleBullets = []) {
    const errors = [];
    const presentTenseIndicators = /\b(develop|design|create|manage|lead|write|build|implement)s?\b/i;

    pastRoleBullets.forEach(bullet => {
      if (!bullet) return;
      const firstWords = bullet.trim().split(/\s+/).slice(0, 3).join(' ');
      if (presentTenseIndicators.test(firstWords)) {
        errors.push({
          type: 'tense',
          message: 'Potential tense mismatch. Past positions should consistently use past-tense action verbs (e.g., "Developed" instead of "Develop").',
          severity: 'warning',
          offendingText: bullet
        });
      }
    });

    return errors;
  }

  static checkDuplicateContent(textEntries = []) {
    const errors = [];
    const seenHashes = new Map();

    textEntries.forEach(bullet => {
      if (!bullet) return;
      const normalized = bullet.trim().toLowerCase().replace(NORMALIZE_REGEX, '');
      if (normalized.length < MIN_BULLET_LENGTH) return;

      if (seenHashes.has(normalized)) {
        errors.push({
          type: 'duplicate',
          message: 'Identical phrasing schema flagged across entries. Vary your action text descriptions to expand overall lexical scanning impact scores.',
          severity: 'warning',
          offendingText: bullet
        });
      } else {
        seenHashes.set(normalized, true);
      }
    });

    return errors;
  }
}