import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function readController(name) {
  return fs.readFileSync(path.join(process.cwd(), 'src', 'controllers', name), 'utf8');
}

describe('authenticated controllers use req.user.uid', () => {
  test('input controller uses uid for user lookup and input persistence', () => {
    const source = readController('input.controller.js');

    assert.ok(source.includes('findById(req.user.uid)'));
    assert.ok(source.includes('user: req.user.uid'));
    assert.ok(source.includes('.findOne({ user: req.user.uid })'));
    assert.ok(!source.includes('req.user.id'));
  });

  test('recruiter controller uses uid for lookups and upserts', () => {
    const source = readController('recruiter.model.js');

    assert.ok(source.includes('findById(req.user.uid)'));
    assert.ok(source.includes('.findOne({ user: req.user.uid })'));
    assert.ok(source.includes('{ userId: req.user.uid }'));
    assert.ok(source.includes('userId: req.user.uid'));
    assert.ok(!source.includes('req.user.id'));
  });
});
