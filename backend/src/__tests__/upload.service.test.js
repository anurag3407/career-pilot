import { describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert';

// We import cloudinary to mock its uploader.destroy method
import cloudinary from '../../src/config/cloudinary.js';

// If your upload.service is CommonJS, we import it as default and destructure, 
// or import the specific named exports depending on your setup.
import uploadService from '../../src/services/upload.service.js';
const { deleteAudioByUrl } = uploadService;

describe('Upload Service: deleteAudioByUrl', () => {
  beforeEach(() => {
    mock.restoreAll();
  });

  it('should successfully extract public_id and call cloudinary.uploader.destroy', async () => {
    // Mock the cloudinary destroy method
    const destroyMock = mock.method(cloudinary.uploader, 'destroy', async () => ({ result: 'ok' }));
    
    // Standard Cloudinary secure URL format
    const mockUrl = 'https://res.cloudinary.com/demo/video/upload/v1689000000/interview-audio/mock-audio-123.webm';
    
    await deleteAudioByUrl(mockUrl);

    assert.strictEqual(destroyMock.mock.callCount(), 1, 'destroy should be called exactly once');
    
    const callArgs = destroyMock.mock.calls[0].arguments;
    assert.strictEqual(callArgs[0], 'interview-audio/mock-audio-123', 'Should extract correct public_id without extension');
    assert.deepStrictEqual(callArgs[1], { resource_type: 'video' }, 'Should specify resource_type as video');
  });

  it('should gracefully handle invalid URLs without calling destroy', async () => {
    const destroyMock = mock.method(cloudinary.uploader, 'destroy', async () => ({ result: 'ok' }));
    
    const badUrl = 'https://invalid-url.com/not-cloudinary/audio.webm';
    await deleteAudioByUrl(badUrl);

    assert.strictEqual(destroyMock.mock.callCount(), 0, 'destroy should not be called for invalid URLs');
  });

  it('should return early and safely if no URL is provided', async () => {
    const destroyMock = mock.method(cloudinary.uploader, 'destroy', async () => ({ result: 'ok' }));
    
    await deleteAudioByUrl(null);
    await deleteAudioByUrl(undefined);
    await deleteAudioByUrl('');

    assert.strictEqual(destroyMock.mock.callCount(), 0, 'destroy should not be called for empty inputs');
  });

  it('should not throw an error if Cloudinary deletion fails', async () => {
    // Mock cloudinary to throw an error to simulate a network/auth failure
    const destroyMock = mock.method(cloudinary.uploader, 'destroy', async () => {
      throw new Error('Cloudinary timeout error');
    });
    
    const mockUrl = 'https://res.cloudinary.com/demo/video/upload/v12345/test.webm';
    
    // The test will fail if deleteAudioByUrl throws an unhandled rejection
    await assert.doesNotReject(async () => {
      await deleteAudioByUrl(mockUrl);
    });
    
    assert.strictEqual(destroyMock.mock.callCount(), 1, 'destroy should have been attempted');
  });
});
