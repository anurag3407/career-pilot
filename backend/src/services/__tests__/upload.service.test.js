import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getCloudinaryPublicIdFromUrl } from '../upload.service.js';

describe('getCloudinaryPublicIdFromUrl', () => {
  test('extracts the public id from a Cloudinary video URL', () => {
    const url = 'https://res.cloudinary.com/demo/video/upload/v1712345678/interview-audio/audio-1712345678.webm';

    assert.equal(
      getCloudinaryPublicIdFromUrl(url),
      'interview-audio/audio-1712345678'
    );
  });

  test('returns null for non-Cloudinary URLs', () => {
    assert.equal(getCloudinaryPublicIdFromUrl('https://example.com/audio.webm'), null);
  });

  test('returns null for empty values', () => {
    assert.equal(getCloudinaryPublicIdFromUrl(''), null);
    assert.equal(getCloudinaryPublicIdFromUrl(null), null);
  });
});
