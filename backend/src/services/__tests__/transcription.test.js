/**
 * Unit tests for the provider-routed audio transcription dispatcher.
 *
 * Run with:
 *   node --test src/services/__tests__/transcription.test.js
 */

import { test, describe, mock } from 'node:test';
import assert from 'node:assert/strict';

import { transcribeAudio } from '../interviewService.js';

describe('transcribeAudio — provider routing', () => {
  test('OpenAI adapter: calls audio.transcriptions.create', async () => {
    let capturedArgs = null;
    const provider = {
      providerName: 'openai',
      modelName: 'gpt-4o-mini',
      client: {
        audio: {
          transcriptions: {
            create: async (args) => {
              capturedArgs = args;
              return { text: 'hello world' };
            }
          }
        }
      }
    };

    const result = await transcribeAudio(
      { audioBuffer: Buffer.from([1, 2, 3]), mimeType: 'audio/webm', language: 'en' },
      provider
    );

    assert.equal(result.text, 'hello world');
    assert.equal(capturedArgs.model, 'whisper-1');
    assert.equal(capturedArgs.language, 'en');
  });

  test('Groq adapter: uses whisper-large-v3-turbo model', async () => {
    let capturedArgs = null;
    const provider = {
      providerName: 'groq',
      modelName: 'llama-3.3-70b-versatile',
      client: {
        audio: {
          transcriptions: {
            create: async (args) => {
              capturedArgs = args;
              return { text: 'hola mundo' };
            }
          }
        }
      }
    };

    const result = await transcribeAudio(
      { audioBuffer: Buffer.from([1]), mimeType: 'audio/webm', language: 'es' },
      provider
    );

    assert.equal(result.text, 'hola mundo');
    assert.equal(capturedArgs.model, 'whisper-large-v3-turbo');
  });

  test('Gemini adapter: uses inline audio + prompt', async () => {
    let capturedArgs = null;
    const provider = {
      providerName: 'gemini',
      model: {
        generateContent: async (args) => {
          capturedArgs = args;
          return { response: { text: () => 'transcribed text' } };
        }
      }
    };

    const result = await transcribeAudio(
      { audioBuffer: Buffer.from([1, 2, 3]), mimeType: 'audio/webm', language: 'ja' },
      provider
    );

    assert.equal(result.text, 'transcribed text');
    assert.ok(capturedArgs.contents[0].parts[0].text.includes('ja'));
    assert.equal(capturedArgs.contents[0].parts[1].inlineData.mimeType, 'audio/webm');
    assert.ok(capturedArgs.contents[0].parts[1].inlineData.data.length > 0);
  });

  test('Unsupported provider shape: throws descriptive error', async () => {
    const provider = {
      providerName: 'openai',
      modelName: 'gpt-4o-mini',
      client: { /* no audio */ }
    };

    await assert.rejects(
      () => transcribeAudio(
        { audioBuffer: Buffer.from([1]), mimeType: 'audio/webm', language: 'en' },
        provider
      ),
      /does not support audio transcription/
    );
  });

  test('Unknown provider name: throws', async () => {
    const provider = {
      providerName: 'unknown-provider',
      generateContent: async () => ({ text: '' })
    };

    await assert.rejects(
      () => transcribeAudio(
        { audioBuffer: Buffer.from([1]), mimeType: 'audio/webm', language: 'en' },
        provider
      ),
      /Audio transcription is not supported/
    );
  });
});
