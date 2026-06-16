import test from 'node:test';
import assert from 'node:assert';
import gdprRouter from '../routes/gdpr.js';

test('GDPR router is defined', () => {
  assert.ok(gdprRouter);
});

test('GDPR export route exists', () => {
  const exportRoute = gdprRouter.stack.find(
    (layer) => layer.route?.path === '/export'
  );

  assert.ok(exportRoute);
});

test('GDPR delete route exists', () => {
  const deleteRoute = gdprRouter.stack.find(
    (layer) => layer.route?.path === '/delete'
  );

  assert.ok(deleteRoute);
});