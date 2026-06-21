import crypto from 'crypto';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Security ID Generation', () => {
    it('should generate unique IDs across 10,000 calls using crypto.randomUUID', () => {
        const idSet = new Set();
        const iterations = 10000;

        for (let i = 0; i < iterations; i++) {
            const id = crypto.randomUUID();
            idSet.add(id);
        }

        assert.strictEqual(idSet.size, iterations);
    });
});
