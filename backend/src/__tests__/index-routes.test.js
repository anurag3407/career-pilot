import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const indexPath = path.join(process.cwd(), 'src', 'index.js');
const source = fs.readFileSync(indexPath, 'utf8');

describe('backend index route registration', () => {
  test('registers collaboration routes outside the payment import try block', () => {
    const collaborationLine = "app.use('/api/collaboration', collaborationRoutes);";
    const paymentImportLine = "const paymentRoutes = (await import('./routes/payments.js')).default;";
    const paymentRouteLine = "app.use('/api/payments', paymentRoutes);";

    const collaborationIndex = source.indexOf(collaborationLine);
    const paymentImportIndex = source.indexOf(paymentImportLine);
    const paymentRouteIndex = source.indexOf(paymentRouteLine);

    assert.notEqual(collaborationIndex, -1, 'collaboration route should be registered');
    assert.notEqual(paymentImportIndex, -1, 'payment import should exist');
    assert.notEqual(paymentRouteIndex, -1, 'payment route should be registered');
    assert.ok(
      collaborationIndex < paymentImportIndex,
      'collaboration route should be registered before the payment import try block',
    );
    assert.ok(
      paymentImportIndex < paymentRouteIndex,
      'payment route should still be registered inside the payment import block',
    );
  });
});
