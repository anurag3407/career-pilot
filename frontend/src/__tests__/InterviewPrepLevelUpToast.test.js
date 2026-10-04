import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const interviewPrepPath = path.join(process.cwd(), 'src', 'pages', 'InterviewPrep.jsx');
const source = fs.readFileSync(interviewPrepPath, 'utf8');

describe('InterviewPrep level-up feedback', () => {
  test('uses toast instead of blocking alert for level-up', () => {
    assert.ok(source.includes("import toast from 'react-hot-toast'"));
    assert.ok(source.includes('toast.success(`Congratulations! You reached ${updatedProgress.level}`'));
    assert.ok(source.includes("role: 'status'"));
    assert.ok(source.includes("'aria-live': 'polite'"));
    assert.ok(!source.includes('alert('));
  });
});
