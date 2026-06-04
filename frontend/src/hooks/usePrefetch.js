import { resumeApi } from "../services/api";

const cache = {};

export const usePrefetch = () => {
  const prefetchResume = async () => {
    if (cache.resumes) return;

    try {
      const data = await resumeApi.getAll();
      cache.resumes = data;
    } catch (err) {
      console.error("Prefetch failed", err);
    }
  };

  return { prefetchResume };
};