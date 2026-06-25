import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ApiError } from '../../middleware/errorHandler.js';
import { deleteInterviewHistoryEntry } from '../interview.handlers.js';

describe('interview routes', () => {
  test('registers the delete interview history route', async () => {
    const routeFile = new URL('../interview.js', import.meta.url);
    const source = await readFile(routeFile, 'utf8');

    assert.match(
      source,
      /router\.delete\('\/:id\(\[0-9a-fA-F\]\{24\}\)'.*deleteInterviewHistoryEntry/s,
      'expected DELETE /:id([0-9a-fA-F]{24}) route to call deleteInterviewHistoryEntry'
    );
  });
});

describe('deleteInterviewHistoryEntry', () => {
  test('deletes an owned interview and its uploaded audio files', async () => {
    const deletedAudio = [];
    const deletedQueries = [];
    const req = {
      params: { id: '665f8a8b8c8d8e8f8a8b8c8d' },
      user: { uid: 'user-123' },
    };
    const res = {
      payload: null,
      json(body) {
        this.payload = body;
      },
    };

    await deleteInterviewHistoryEntry(req, res, {
      Interview: {
        findOne(query) {
          assert.deepEqual(query, { _id: req.params.id, odId: req.user.uid });
          return {
            lean: async () => ({
              _id: req.params.id,
              answers: [
                { audioUrl: 'https://res.cloudinary.com/demo/video/upload/v1712345678/interview-audio/audio-1.webm' },
                { audioUrl: '' },
                { audioUrl: 'https://res.cloudinary.com/demo/video/upload/v1712345678/interview-audio/audio-2.webm' },
              ],
            }),
          };
        },
        async deleteOne(query) {
          deletedQueries.push(query);
          return { deletedCount: 1 };
        },
      },
      async deleteAudioByUrl(url) {
        deletedAudio.push(url);
        return { deleted: true };
      },
    });

    assert.deepEqual(deletedAudio, [
      'https://res.cloudinary.com/demo/video/upload/v1712345678/interview-audio/audio-1.webm',
      'https://res.cloudinary.com/demo/video/upload/v1712345678/interview-audio/audio-2.webm',
    ]);
    assert.deepEqual(deletedQueries, [{ _id: req.params.id, odId: req.user.uid }]);
    assert.deepEqual(res.payload, {
      success: true,
      data: {
        deletedInterviewId: req.params.id,
        deletedAudioCount: 2,
      },
    });
  });

  test('continues deleting the interview when audio cleanup fails', async () => {
    const req = {
      params: { id: '665f8a8b8c8d8e8f8a8b8c8d' },
      user: { uid: 'user-123' },
    };
    const res = {
      payload: null,
      json(body) {
        this.payload = body;
      },
    };

    await deleteInterviewHistoryEntry(req, res, {
      Interview: {
        findOne() {
          return {
            lean: async () => ({
              _id: req.params.id,
              answers: [{ audioUrl: 'https://res.cloudinary.com/demo/video/upload/v1712345678/interview-audio/audio-1.webm' }],
            }),
          };
        },
        async deleteOne() {
          return { deletedCount: 1 };
        },
      },
      async deleteAudioByUrl() {
        throw new Error('cloudinary unavailable');
      },
    });

    assert.deepEqual(res.payload, {
      success: true,
      data: {
        deletedInterviewId: req.params.id,
        deletedAudioCount: 1,
      },
    });
  });

  test('throws when the interview does not belong to the current user', async () => {
    const req = {
      params: { id: '665f8a8b8c8d8e8f8a8b8c8d' },
      user: { uid: 'user-404' },
    };
    const res = {
      json() {
        assert.fail('res.json should not be called when the interview is missing');
      },
    };

    await assert.rejects(
      deleteInterviewHistoryEntry(req, res, {
        Interview: {
          findOne() {
            return {
              lean: async () => null,
            };
          },
          async deleteOne() {
            assert.fail('deleteOne should not be called when the interview is missing');
          },
        },
        async deleteAudioByUrl() {
          assert.fail('deleteAudioByUrl should not be called when the interview is missing');
        },
      }),
      (error) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.statusCode, 404);
        assert.equal(error.message, 'Interview not found');
        return true;
      }
    );
  });
});
