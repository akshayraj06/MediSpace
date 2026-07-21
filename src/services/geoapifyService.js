const getApiKey = () => {
  const key = import.meta.env.VITE_GEOAPIFY_API_KEY;
  console.log("Loaded Geoapify API Key:", key);
  if (!key) throw new Error('VITE_GEOAPIFY_API_KEY is not defined in .env');
  return key;
};

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const geocodeCity = async (city, signal) => {
  const cacheKey = `geoapify_geocode_${city.toLowerCase().trim()}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CACHE_TTL) {
      return parsed.data;
    }
  }

  const apiKey = getApiKey();
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&format=json&apiKey=${apiKey}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error('Failed to fetch from Geoapify Geocoding API');
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    return null;
  }

  const result = {
    lat: data.results[0].lat,
    lon: data.results[0].lon,
    name: data.results[0].city || data.results[0].name || city
  };

  localStorage.setItem(cacheKey, JSON.stringify({
    timestamp: Date.now(),
    data: result
  }));

  return result;
};

export const reverseGeocode = async (lat, lon) => {
  const apiKey = getApiKey();
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to reverse geocode');
  }

  const data = await response.json();
  if (data.results && data.results.length > 0) {
    return data.results[0].city || data.results[0].state || data.results[0].county || "Current Location";
  }
  return "Current Location";
};

// Haversine distance formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const formatAndRank = (elements, userLat, userLon, specialty) => {
  const formatted = elements.map(place => {
    // Geoapify returns coordinates as [longitude, latitude]
    const coords = place.geometry?.coordinates || [undefined, undefined];
    const [lng, lat] = coords;
    
    // Ensure we have valid numbers before calculating distance
    const distance = (Number.isFinite(lat) && Number.isFinite(lng)) 
      ? calculateDistance(userLat, userLon, lat, lng) 
      : 9999;
      
    const props = place.properties || {};

    let name = props.name || "Unknown Hospital/Clinic";
    let formatted_address = props.formatted || "Address unavailable";
    let emergency = props.emergency === "yes";
    let phone = props.contact?.phone || props.phone || null;

    // Specialty matching
    let specialtyScore = 0;
    const specialtyLower = specialty.toLowerCase();
    
    // Check name for specialty
    if (name.toLowerCase().includes(specialtyLower)) specialtyScore += 3;
    
    // Check categories/healthcare specialty
    const categories = props.categories || [];
    if (categories.some(c => c.toLowerCase().includes(specialtyLower))) specialtyScore += 3;
    
    // Emergency boost
    const emergencyScore = emergency ? 2 : 0;
    
    // Completeness score
    let completenessScore = 0;
    if (phone) completenessScore += 0.5;
    if (props.website) completenessScore += 0.5;
    if (props.opening_hours) completenessScore += 0.5;
    if (props.address_line1) completenessScore += 0.5;

    // Distance penalty
    const distanceScore = Math.max(0, 10 - distance);

    const totalScore = specialtyScore + emergencyScore + completenessScore + distanceScore;

    return {
      id: props.place_id || `geoapify-${lat}-${lng}`,
      name,
      lat, // Retained for backwards compatibility with UI
      lon: lng, // Retained for backwards compatibility with UI
      latitude: lat,
      longitude: lng,
      distance: distance.toFixed(1),
      formatted_address,
      phone,
      emergency,
      osmLink: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      score: totalScore
    };
  });

  // Remove exact duplicates by ID or extremely close proximity
  const unique = [];
  formatted.forEach(hosp => {
    const isDup = unique.some(u => 
      u.id === hosp.id || 
      (u.name === hosp.name && Math.abs(u.lat - hosp.lat) < 0.001)
    );
    if (!isDup) unique.push(hosp);
  });

  return unique.sort((a, b) => b.score - a.score);
};

const executeQuery = async (lat, lon, radius, signal, limit, timeoutMs = null) => {
  const apiKey = getApiKey();
  const categories = 'healthcare.hospital';
  
  // Verify coordinates are valid numbers
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    console.error("Invalid coordinates passed to executeQuery:", {lat, lon});
    throw new Error('Invalid coordinates for search.');
  }

  const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radius}&limit=${limit}&apiKey=${apiKey}`;
  
  console.log("Geoapify Request URL:", url.replace(apiKey, "HIDDEN_KEY"));

  const fetchPromise = fetch(url, { signal }).then(async res => {
    if (!res.ok) {
      let errorBody = "No response body";
      try {
        errorBody = await res.text();
      } catch (e) {}
      console.error(`Geoapify Error ${res.status}:`, errorBody);
      
      if (res.status === 429) throw new Error('Rate limit exceeded');
      throw new Error(`Failed to fetch from Geoapify Places API: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.features || [];
  });

  if (timeoutMs) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
    });
    return Promise.race([fetchPromise, timeoutPromise]);
  }

  return fetchPromise;
};

export const fetchGeoapifyHospitals = async (lat, lon, specialty, isEmergency, maxRadius, signal, onPartial) => {
  if (onPartial) {
    try {
      let fastElements = await executeQuery(lat, lon, 3000, signal, 5, 2000);
      if (fastElements.length > 0) {
        onPartial(formatAndRank(fastElements, lat, lon, specialty));
      }
    } catch (e) {
      // Ignore fast query timeouts
    }
  }

  let elements = [];
  try {
    // 1. Search within 3 km, max 20 hospitals
    elements = await executeQuery(lat, lon, 3000, signal, 20, 6000);
  } catch (e) {
    if (e.message === 'TIMEOUT' || (e.name === 'AbortError' && !signal?.aborted)) {
      elements = await executeQuery(lat, lon, 2000, signal, 20);
    } else {
      throw e;
    }
  }

  // 2. Expand to 7 km if fewer than 5 found
  if (elements.length < 5) {
    elements = await executeQuery(lat, lon, 7000, signal, 20);
  }

  // 3. Expand to 10 km if still fewer than 5 found
  if (elements.length < 5) {
    elements = await executeQuery(lat, lon, 10000, signal, 20);
  }

  if (elements.length === 0) return [];

  let finalRanked = formatAndRank(elements, lat, lon, specialty);
  
  if (isEmergency) {
    finalRanked = finalRanked.filter(h => h.emergency);
  }

  return finalRanked.slice(0, 20);
};
