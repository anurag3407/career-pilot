import axios from 'axios';
import redisManager from '../config/redis.js';

const CACHE_TTL_SECONDS = 86400; // 24 hours

/**
 * Auto-fetches company research data (domain, logo, overview) from public APIs.
 * Includes Redis caching and graceful fallbacks.
 * 
 * @param {string} companyName - Name of the company to research
 * @returns {Promise<Object>} Company details including domain, logo, and overview
 */
export const autoFetchCompanyResearch = async (companyName) => {
  if (!companyName || !companyName.trim()) {
    throw new Error('Company name is required');
  }

  const normalizedName = companyName.trim();
  const cacheKey = `company_research:${normalizedName.toLowerCase().replace(/\s+/g, '_')}`;

  // 1. Check Redis Cache
  let redisClient = null;
  try {
    redisClient = redisManager.get('companyAutoResearch');
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }
  } catch (error) {
    console.warn(`⚠️ Redis cache read failed for ${normalizedName}:`, error.message);
  }

  // Fallback defaults
  const result = {
    companyName: normalizedName,
    domain: null,
    logo: null,
    overview: `A professional organization specializing in its industry.`,
  };

  // 2. Fetch Clearbit Autocomplete (Domain & Logo)
  try {
    const clearbitUrl = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(normalizedName)}`;
    const cbResponse = await axios.get(clearbitUrl, { timeout: 5000 });
    if (cbResponse.data && cbResponse.data.length > 0) {
      // Pick the best match
      const bestMatch = cbResponse.data[0];
      result.domain = bestMatch.domain || null;
      result.logo = bestMatch.logo || null;
    }
  } catch (error) {
    console.warn(`⚠️ Clearbit API failed for ${normalizedName}:`, error.message);
  }

  // 3. Fetch Wikipedia Summary
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(normalizedName)}&format=json`;
    const wikiResponse = await axios.get(wikiUrl, { timeout: 5000 });
    const pages = wikiResponse.data?.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pageId !== '-1' && pages[pageId].extract) {
        const extract = pages[pageId].extract.trim();
        // Take the first 2-3 sentences as the overview
        const sentences = extract.split(/(?<=\.)\s+/);
        if (sentences.length > 0) {
          result.overview = sentences.slice(0, 3).join(' ').trim();
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️ Wikipedia API failed for ${normalizedName}:`, error.message);
  }

  // 4. Save to Redis Cache
  try {
    if (redisClient) {
      await redisClient.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(result));
    }
  } catch (error) {
    console.warn(`⚠️ Redis cache write failed for ${normalizedName}:`, error.message);
  }

  return result;
};

export default { autoFetchCompanyResearch };
