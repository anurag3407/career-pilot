import { describe, test, expect } from 'vitest';
import {
  PROVIDER_META,
  PROVIDER_CATEGORIES,
  PROVIDER_IDS_BY_CATEGORY,
  useAIConfigStore,
} from '../stores/useAIConfigStore';

describe('AI provider catalog', () => {
  test('ships a large, well-formed provider catalog', () => {
    const ids = Object.keys(PROVIDER_META);
    expect(ids.length).toBeGreaterThanOrEqual(25);

    const categoryIds = new Set(PROVIDER_CATEGORIES.map((c) => c.id));
    for (const id of ids) {
      const meta = PROVIDER_META[id];
      expect(meta.name, `${id} name`).toBeTruthy();
      expect(meta.icon, `${id} icon`).toBeTruthy();
      expect(meta.tagline, `${id} tagline`).toBeTruthy();
      expect(meta.defaultModel, `${id} defaultModel`).toBeTruthy();
      expect(categoryIds.has(meta.category), `${id} category`).toBe(true);
    }

    for (const category of PROVIDER_CATEGORIES) {
      expect(
        PROVIDER_IDS_BY_CATEGORY[category.id].length,
        `${category.id} has providers`
      ).toBeGreaterThan(0);
    }
  });

  test('hosted providers ship a base URL and local providers are keyless', () => {
    for (const [id, meta] of Object.entries(PROVIDER_META)) {
      if (meta.category === 'hosted' && id !== 'azure') {
        expect(meta.baseUrl, `${id} baseUrl`).toMatch(/^https:\/\//);
      }
      if (meta.category === 'local') {
        expect(meta.requiresKey, `${id} requiresKey`).toBe(false);
        expect(meta.baseUrl, `${id} baseUrl`).toMatch(/^http:\/\//);
        expect(meta.showBaseUrl, `${id} showBaseUrl`).toBe(true);
      }
    }
  });

  test('getActiveConfig resolves keyless local providers without a stored key', () => {
    useAIConfigStore.setState({ activeProvider: 'ollama', providers: {} });

    const config = useAIConfigStore.getState().getActiveConfig();
    expect(config).toMatchObject({
      provider: 'ollama',
      apiKey: '',
      model: 'llama3.2',
      baseUrl: 'http://localhost:11434/v1',
    });
  });

  test('getActiveConfig returns null when a keyed provider has no key', () => {
    useAIConfigStore.setState({ activeProvider: 'deepseek', providers: {} });
    expect(useAIConfigStore.getState().getActiveConfig()).toBeNull();
  });
});
