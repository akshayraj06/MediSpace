const SAVED_HOSPITALS_KEY = 'medispace_saved_hospitals';

export const getSavedHospitals = () => {
  try {
    const saved = localStorage.getItem(SAVED_HOSPITALS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to read saved hospitals', err);
    return [];
  }
};

export const saveHospital = (hospital) => {
  try {
    const saved = getSavedHospitals();
    // Prevent duplicates
    if (!saved.some(h => h.id === hospital.id)) {
      saved.push({
        ...hospital,
        savedAt: Date.now()
      });
      localStorage.setItem(SAVED_HOSPITALS_KEY, JSON.stringify(saved));
    }
  } catch (err) {
    console.error('Failed to save hospital', err);
  }
};

export const removeSavedHospital = (id) => {
  try {
    let saved = getSavedHospitals();
    saved = saved.filter(h => h.id !== id);
    localStorage.setItem(SAVED_HOSPITALS_KEY, JSON.stringify(saved));
  } catch (err) {
    console.error('Failed to remove saved hospital', err);
  }
};

export const isHospitalSaved = (id) => {
  const saved = getSavedHospitals();
  return saved.some(h => h.id === id);
};
