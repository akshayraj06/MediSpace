import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Star, Phone, Clock, Search, Trophy, History, Loader2, Sparkles, Building2 } from 'lucide-react';
import { geocodeCity, reverseGeocode, fetchGeoapifyHospitals } from '../services/geoapifyService';
import { getCachedResults, setCachedResults, getSearchHistory, addToSearchHistory } from '../services/searchCache';
import { isHospitalSaved, saveHospital, removeSavedHospital } from '../services/savedHospitals';
import { mapSymptomToSpecialty, predictSpecialtyWithGemini, generateAISummary } from '../services/symptomMapper';
import HospitalMap from './HospitalMap';
import HospitalErrorState from './HospitalErrorState';

const SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'Dermatology',
  'ENT & Pulmonology',
  'General Medicine'
];

export default function NearbyHospitals({ showToast, initialSpecialty = '' }) {
  // Input State
  const [cityInput, setCityInput] = useState('');
  const [specialtyInput, setSpecialtyInput] = useState(initialSpecialty || '');
  
  // Autocomplete State
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [isFetchingCities, setIsFetchingCities] = useState(false);
  const cityInputRef = useRef(null);

  // Search & Results State
  const [hospitals, setHospitals] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  
  // UI Interaction State
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  
  // Search History
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Debounce Refs
  const cityDebounce = useRef(null);
  const searchDebounce = useRef(null);
  const abortControllerRef = useRef(null);

  // AI & New Features State
  const [aiSummaryText, setAiSummaryText] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [centerLat, setCenterLat] = useState(null);
  const [centerLon, setCenterLon] = useState(null);
  
  // Initialize from props and history
  useEffect(() => {
    setSearchHistory(getSearchHistory());
    if (initialSpecialty) {
      setSpecialtyInput(initialSpecialty);
    }
  }, [initialSpecialty]);

  // Handle outside click for city suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityInputRef.current && !cityInputRef.current.contains(e.target)) {
        setShowCitySuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Effect to trigger search when both inputs have valid values
  useEffect(() => {
    if (cityInput.length >= 3 && specialtyInput) {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
      
      searchDebounce.current = setTimeout(() => {
        performSearch(cityInput, specialtyInput);
      }, 500);
    }
  }, [cityInput, specialtyInput]);

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    
    if (cityDebounce.current) clearTimeout(cityDebounce.current);
    
    // With Nominatim rate limit, we skip aggressive auto-complete.
    // The main search function will geocode the city string.
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  };

  const handleSelectCity = (city) => {
    setCityInput(city.mainText + (city.secondaryText ? `, ${city.secondaryText}` : ''));
    setShowCitySuggestions(false);
  };

  const handleSpecialtyChange = (e) => {
    setSpecialtyInput(e.target.value);
  };

  const performSearch = async (city, specialty) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setError(null);
    setHasSearched(true);
    
    try {
      // Check cache first
      const cacheKey = `${city}_${specialty}_${isEmergency}`;
      const cached = getCachedResults(cacheKey, 'v1');
      if (cached) {
        setHospitals(cached.hospitals);
        setAiSummaryText(cached.summary);
        setCenterLat(cached.lat);
        setCenterLon(cached.lon);
        addToSearchHistory(city, specialty);
        setSearchHistory(getSearchHistory());
        // Note: We do not return here! We proceed to fetch fresh data in the background.
        // We also do not set isSearching = true if we already have cached data, so the UI feels instant.
      } else {
        setHospitals([]);
        setAiSummaryText('');
        setIsSearching(true);
      }

      // Step 1: Execute Geocoding and AI Prediction Concurrently
      const mappedLocally = mapSymptomToSpecialty(specialty);
      const needsGemini = !mappedLocally && specialty.length >= 4 && !SPECIALTIES.includes(specialty);
      
      const [location, geminiMapped] = await Promise.all([
        geocodeCity(city, signal),
        needsGemini ? predictSpecialtyWithGemini(specialty).catch(() => null) : Promise.resolve(null)
      ]);

      if (!location) {
        throw new Error('Could not find this city. Please check the spelling.');
      }
      
      setCenterLat(location.lat);
      setCenterLon(location.lon);

      let finalSpecialty = specialty;
      if (geminiMapped) {
        finalSpecialty = geminiMapped;
        setSpecialtyInput(geminiMapped);
        if (showToast) showToast(`AI suggested ${geminiMapped} for your symptoms`, 'info');
      } else if (mappedLocally && mappedLocally !== specialty) {
        finalSpecialty = mappedLocally;
        setSpecialtyInput(mappedLocally);
        if (showToast) showToast(`Mapped symptom to ${mappedLocally}`, 'info');
      }

      // Step 2: Search hospitals using Overpass
      const onPartial = (partialResults) => {
        if (partialResults.length > 0) {
          const summary = generateAISummary(partialResults, finalSpecialty);
          setHospitals(partialResults);
          setAiSummaryText(summary);
          // Don't set isSearching to false here so the background loader keeps spinning lightly if needed
        }
      };

      const results = await fetchGeoapifyHospitals(location.lat, location.lon, finalSpecialty, isEmergency, 10000, signal, onPartial);
      
      if (results.length === 0) {
        setError("ZERO_RESULTS");
        setIsSearching(false);
        return;
      }

      // Step 3: Generate AI Summary
      const summary = generateAISummary(results, finalSpecialty);
      
      setHospitals(results);
      setAiSummaryText(summary);
      
      setCachedResults(cacheKey, 'v1', { hospitals: results, summary, lat: location.lat, lon: location.lon });
      addToSearchHistory(city, specialty);
      setSearchHistory(getSearchHistory());

    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Search error:", err);
        
        if (!navigator.onLine) {
          setError("No Internet Connection. Please check your network and try again.");
        } else if (err.message === 'TIMEOUT' || err.message.includes('timeout')) {
          setError("The search timed out. The hospital database is currently taking too long to respond.");
        } else if (err.message.includes('Could not find this city')) {
          setError("Invalid city. We couldn't locate this city on the map. Please check the spelling.");
        } else if (err.message.includes('Failed to fetch') || err.message.includes('Geoapify')) {
          setError("The hospital mapping API is currently unavailable. Please try again later.");
        } else {
          setError(err.message || "An unexpected error occurred while searching for hospitals.");
        }
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleHistoryClick = (item) => {
    setCityInput(item.city);
    setSpecialtyInput(item.specialty);
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setError("geolocation not supported");
      return;
    }
    
    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setCenterLat(latitude);
          setCenterLon(longitude);
          
          const cityName = await reverseGeocode(latitude, longitude);
          setCityInput(cityName);
          
          if (showToast) showToast(`Location detected: ${cityName}`, 'success');
        } catch (e) {
          setError("Failed to determine city from location.");
        } finally {
          setIsSearching(false);
        }
      },
      (err) => {
        setIsSearching(false);
        setError("permission denied");
      }
    );
  };

  return (
    <section id="hospitals" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 font-mono flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI POWERED SEARCH</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find the Best Rated Hospitals
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Powered by Geoapify. Enter your city and specialty or symptoms to instantly find top-rated hospitals.
          </p>
        </div>

        {/* Search Controls */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl mb-12 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-700">Emergency Only</span>
              <button 
                onClick={() => setIsEmergency(!isEmergency)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isEmergency ? 'bg-rose-500' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isEmergency ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* City Autocomplete */}
            <div className="relative" ref={cityInputRef}>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>City or Locality</span>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[11px] font-bold"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Detect GPS</span>
                </button>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={cityInput}
                  onChange={handleCityChange}
                  onFocus={() => { if (citySuggestions.length > 0) setShowCitySuggestions(true); }}
                  placeholder="e.g. Hyderabad, Mumbai, Delhi..."
                  className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
                {isFetchingCities && (
                  <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
                )}
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showCitySuggestions && citySuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto"
                  >
                    {citySuggestions.map((city, idx) => (
                      <button
                        key={city.placeId}
                        onClick={() => handleSelectCity(city)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-start gap-2.5 border-b border-slate-50 last:border-0"
                      >
                        <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-slate-800 block truncate">{city.mainText}</span>
                          {city.secondaryText && (
                            <span className="text-xs text-slate-500 block truncate mt-0.5">{city.secondaryText}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Specialty / Symptom Input */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Doctor Specialty or Symptoms
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  list="specialties-list"
                  value={specialtyInput}
                  onChange={handleSpecialtyChange}
                  placeholder="e.g. Cardiology, or 'chest pain'"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
                <datalist id="specialties-list">
                  {SPECIALTIES.map(spec => (
                    <option key={spec} value={spec} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Search History Chips */}
          {searchHistory.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <History className="w-3.5 h-3.5" /> Recent:
              </span>
              {searchHistory.slice(0, 4).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleHistoryClick(item)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-semibold transition-colors border border-slate-200 hover:border-blue-200"
                >
                  {item.specialty} in {item.city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="min-h-[400px]">
          {error ? (
            <HospitalErrorState 
              error={error} 
              onRetry={() => {
                setCityInput('');
                setSpecialtyInput('');
                setError(null);
                setHasSearched(false);
              }} 
            />
          ) : (isSearching && hospitals.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-bold">Scanning Geoapify Places for top hospitals...</p>
            </div>
          ) : !hasSearched ? (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Search className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-extrabold text-slate-900 text-lg">Waiting for input...</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Type a city and specialty. Search will begin automatically without needing a button click.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Cards List (Left Side) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* AI Summary Block */}
                {aiSummaryText && (
                  <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h4 className="font-extrabold text-slate-900">AI Summary</h4>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 whitespace-pre-line">{aiSummaryText}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Found {hospitals.length} Hospitals
                  </h3>
                </div>

                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 pb-4 scrollbar-thin">
                  {hospitals.map((hospital, idx) => {
                    const isSelected = selectedHospitalId === hospital.id;
                    const isTopMatch = idx === 0;

                    return (
                      <motion.div
                        key={hospital.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedHospitalId(hospital.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-400 shadow-md' 
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        {/* Thumbnail Icon */}
                        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 relative flex items-center justify-center text-slate-300">
                          <Building2 className="w-10 h-10" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            {isTopMatch && (
                              <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase text-amber-600 mb-1 bg-amber-50 self-start inline-flex px-2 py-0.5 rounded-full border border-amber-200">
                                <Trophy className="w-3.5 h-3.5" /> ⭐ Recommended by MediSpace AI
                              </div>
                            )}
                            <h4 className="text-sm font-extrabold text-slate-900 truncate pr-2 group-hover:text-blue-700">
                              {hospital.name}
                            </h4>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs">
                              <span className="font-bold text-slate-700">{hospital.distance} km away</span>
                              {hospital.emergency && (
                                <span className="font-bold text-rose-600 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Emergency 24/7
                                </span>
                              )}
                              {hospital.phone && (
                                <span className="text-slate-500 font-medium flex items-center gap-1">
                                  <Phone className="w-3 h-3" /> {hospital.phone}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-start gap-1.5 mt-2 text-xs text-slate-500">
                              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                              <span className="line-clamp-2">{hospital.formatted_address}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lon}`;
                                window.open(url, '_blank');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors"
                            >
                              <Navigation className="w-3 h-3" /> Directions
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isHospitalSaved(hospital.id)) {
                                  removeSavedHospital(hospital.id);
                                  if (showToast) showToast('Removed from Saved Hospitals', 'info');
                                } else {
                                  saveHospital(hospital);
                                  if (showToast) showToast('Hospital Saved Successfully', 'success');
                                }
                                // Force re-render to update icon color
                                setHospitals([...hospitals]);
                              }}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors ${isHospitalSaved(hospital.id) ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            >
                              <Star className={`w-3 h-3 ${isHospitalSaved(hospital.id) ? 'fill-rose-500' : ''}`} /> 
                              {isHospitalSaved(hospital.id) ? 'Saved' : 'Save'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (navigator.share) {
                                  navigator.share({
                                    title: hospital.name,
                                    text: `Check out this hospital: ${hospital.name}\n${hospital.formatted_address}`,
                                    url: hospital.osmLink
                                  });
                                } else {
                                  navigator.clipboard.writeText(`${hospital.name} - ${hospital.osmLink}`);
                                  if (showToast) showToast('Link copied to clipboard', 'success');
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                            >
                              Share
                            </button>
                            <a
                              href={hospital.osmLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                            >
                              Route Map
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Map (Right Side) */}
              <div className="lg:col-span-5 h-[500px] lg:h-auto lg:sticky lg:top-24 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
                <HospitalMap 
                  hospitals={hospitals} 
                  selectedHospitalId={selectedHospitalId}
                  onMarkerClick={(id) => {
                    setSelectedHospitalId(id);
                  }}
                  centerLat={centerLat}
                  centerLon={centerLon}
                />
              </div>

            </div>
          )}
        </div>
      </div>

    </section>
  );
}
