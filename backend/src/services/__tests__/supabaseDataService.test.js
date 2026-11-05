import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { supabaseAdmin } from '../../config/supabase.js';
import {
  saveUserToSupabase,
  getUserFromSupabase,
  saveJobAlertToSupabase,
  deleteJobAlertFromSupabase,
  getUserAlertsFromSupabase,
  saveJobListingToSupabase,
  saveTrackedJobToSupabase,
  saveUserInputsToSupabase,
  saveRecruiterAnalysisToSupabase,
  getRecruiterLeaderboardFromSupabase,
} from '../supabaseDataService.js';

describe('supabaseDataService', () => {
  test('saveUserToSupabase handles missing or null id gracefully', async () => {
    const res = await saveUserToSupabase({});
    assert.equal(res, null);
  });

  test('saveJobAlertToSupabase handles data formatting gracefully', async () => {
    const fromMock = mock.method(supabaseAdmin, 'from', () => ({
      upsert: () => ({
        select: () => ({
          maybeSingle: async () => ({ data: { id: 'alert-1', user_id: 'u1' }, error: null }),
        }),
      }),
    }));

    const result = await saveJobAlertToSupabase({
      id: 'alert-1',
      userId: 'u1',
      email: 'dev@example.com',
      keywords: ['react', 'node'],
    });

    assert.ok(result);
    assert.equal(result.id, 'alert-1');

    fromMock.mock.restore();
  });

  test('deleteJobAlertFromSupabase sends delete query', async () => {
    let deletedId = null;
    const fromMock = mock.method(supabaseAdmin, 'from', () => ({
      delete: () => ({
        eq: (col, val) => {
          deletedId = val;
          return Promise.resolve({ error: null });
        },
      }),
    }));

    const result = await deleteJobAlertFromSupabase('alert-123');
    assert.equal(result, true);
    assert.equal(deletedId, 'alert-123');

    fromMock.mock.restore();
  });

  test('saveJobListingToSupabase normalizes and upserts listing', async () => {
    let savedPayload = null;
    const fromMock = mock.method(supabaseAdmin, 'from', () => ({
      upsert: (payload) => {
        savedPayload = payload;
        return {
          select: () => ({
            maybeSingle: async () => ({ data: savedPayload, error: null }),
          }),
        };
      },
    }));

    const result = await saveJobListingToSupabase({
      id: 'job-1',
      title: 'Senior Engineer',
      company: 'TechCorp',
      location: 'Remote',
    });

    assert.ok(result);
    assert.equal(result.id, 'job-1');
    assert.equal(result.title, 'Senior Engineer');
    assert.equal(result.company, 'TechCorp');

    fromMock.mock.restore();
  });

  test('saveRecruiterAnalysisToSupabase saves analysis payload', async () => {
    let savedPayload = null;
    const fromMock = mock.method(supabaseAdmin, 'from', () => ({
      upsert: (payload) => {
        savedPayload = payload;
        return {
          select: () => ({
            maybeSingle: async () => ({ data: savedPayload, error: null }),
          }),
        };
      },
    }));

    const result = await saveRecruiterAnalysisToSupabase({
      userId: 'u1',
      username: 'alex',
      email: 'alex@example.com',
      matchPercentage: 92.4,
      jobTitle: 'Backend Dev',
    });

    assert.ok(result);
    assert.equal(result.match_percentage, 92);
    assert.equal(result.job_title, 'Backend Dev');

    fromMock.mock.restore();
  });
});
