// In-memory cache for the current session to avoid duplicate API calls
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes for hospitals
const CITY_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours for city coords

export const getCachedResults = (city, specialty) => {
  const key = `${city.toLowerCase()}|${specialty.toLowerCase()}`;
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < CACHE_TTL_MS) {
      return data;
    }
    cache.delete(key);
  }
  return null;
};

export const setCachedResults = (city, specialty, data) => {
  const key = `${city.toLowerCase()}|${specialty.toLowerCase()}`;
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const getCachedCityCoords = (city) => {
  const key = `city_${city.toLowerCase()}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CITY_CACHE_TTL_MS) {
        return parsed.data;
      }
      localStorage.removeItem(key);
    }
  } catch (err) {}
  return null;
};

export const setCachedCityCoords = (city, data) => {
  const key = `city_${city.toLowerCase()}`;
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (err) {}
};

// Search history stored in localStorage
const HISTORY_KEY = 'medispace_search_history';
const MAX_HISTORY = 10;

export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (err) {
    console.error('Failed to read search history', err);
    return [];
  }
};

export const addToSearchHistory = (city, specialty) => {
  const history = getSearchHistory();
  
  // Remove if exists to push to front
  const filtered = history.filter(item => !(item.city === city && item.specialty === specialty));
  
  filtered.unshift({ city, specialty, timestamp: Date.now() });
  
  // Keep last 10 searches
  const updated = filtered.slice(0, MAX_HISTORY);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save search history', err);
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.error('Failed to clear search history', err);
  }
};
