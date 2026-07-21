// Local symptom to specialty mapping to reduce external API reliance
const symptomMap = {
  // Cardiology
  'chest pain': 'Cardiology',
  'heart palpitation': 'Cardiology',
  'high blood pressure': 'Cardiology',
  'shortness of breath': 'Cardiology',
  'dizziness': 'Cardiology',
  
  // Neurology
  'headache': 'Neurology',
  'migraine': 'Neurology',
  'seizure': 'Neurology',
  'numbness': 'Neurology',
  'memory loss': 'Neurology',
  'tremor': 'Neurology',
  
  // Orthopedics
  'joint pain': 'Orthopedics',
  'back pain': 'Orthopedics',
  'bone fracture': 'Orthopedics',
  'muscle tear': 'Orthopedics',
  'knee pain': 'Orthopedics',
  'arthritis': 'Orthopedics',
  
  // Pediatrics
  'child fever': 'Pediatrics',
  'baby rash': 'Pediatrics',
  'childhood vaccination': 'Pediatrics',
  'infant crying': 'Pediatrics',
  'child cough': 'Pediatrics',
  
  // Oncology
  'tumor': 'Oncology',
  'cancer': 'Oncology',
  'chemotherapy': 'Oncology',
  'unexplained weight loss': 'Oncology',
  'lump': 'Oncology',
  
  // Dermatology
  'skin rash': 'Dermatology',
  'acne': 'Dermatology',
  'eczema': 'Dermatology',
  'hair loss': 'Dermatology',
  'nail infection': 'Dermatology',
  'mole': 'Dermatology',
  
  // ENT & Pulmonology
  'sore throat': 'ENT & Pulmonology',
  'ear ache': 'ENT & Pulmonology',
  'hearing loss': 'ENT & Pulmonology',
  'sinus': 'ENT & Pulmonology',
  'chronic cough': 'ENT & Pulmonology',
  'asthma': 'ENT & Pulmonology',
  'breathing difficulty': 'ENT & Pulmonology',
  
  // General Medicine
  'fever': 'General Medicine',
  'fatigue': 'General Medicine',
  'body ache': 'General Medicine',
  'weakness': 'General Medicine',
  'vomiting': 'General Medicine'
};

/**
 * Attempts to map a user symptom input to a predefined doctor specialty.
 * @param {string} input - User symptom or query
 * @returns {string|null} - The matched specialty, or null if no match found.
 */
export const mapSymptomToSpecialty = (input) => {
  if (!input) return null;
  const lowerInput = input.toLowerCase();

  // Direct exact match
  if (symptomMap[lowerInput]) {
    return symptomMap[lowerInput];
  }

  // Substring match
  for (const [symptom, specialty] of Object.entries(symptomMap)) {
    if (lowerInput.includes(symptom)) {
      return specialty;
    }
  }

  return null;
};

/**
 * Simulates a Gemini AI call to predict a doctor specialty if the local map fails.
 * Designed to meet the "No API Keys" and "Free" requirements.
 * @param {string} input - User symptom or query
 * @returns {Promise<string>}
 */
export const predictSpecialtyWithGemini = async (input) => {
  // Simulate network delay for AI processing
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerInput = input.toLowerCase();

  // Simulated AI logic heuristics
  if (lowerInput.includes('eye') || lowerInput.includes('vision') || lowerInput.includes('blur')) return 'Ophthalmology';
  if (lowerInput.includes('tooth') || lowerInput.includes('gum') || lowerInput.includes('dental')) return 'Dentistry';
  if (lowerInput.includes('stomach') || lowerInput.includes('digestion') || lowerInput.includes('nausea')) return 'Gastroenterology';
  if (lowerInput.includes('anxiety') || lowerInput.includes('depression') || lowerInput.includes('mental')) return 'Psychiatry';
  if (lowerInput.includes('urine') || lowerInput.includes('kidney') || lowerInput.includes('bladder')) return 'Urology';
  if (lowerInput.includes('pregnancy') || lowerInput.includes('period') || lowerInput.includes('women')) return 'Gynecology';

  // Fallback if the simulated AI can't confidently guess
  return 'General Medicine';
};

/**
 * Generates an AI Summary explaining the search results and recommendations.
 * @param {Array} hospitals - The fetched hospitals
 * @param {string} specialty - The detected/requested specialty
 * @returns {string} - The generated summary text
 */
export const generateAISummary = (hospitals, specialty) => {
  if (!hospitals || hospitals.length === 0) {
    return "I couldn't find any hospitals matching your criteria in this area. Try expanding your search.";
  }

  const topHospital = hospitals[0];
  const total = hospitals.length;
  
  let reasonParts = [];
  reasonParts.push(`it is the closest ${topHospital.facilityType === 'hospital' ? 'hospital' : 'healthcare facility'}`);
  
  if (topHospital.hasSpecialtyMatch) {
    reasonParts.push(`matching the detected specialty`);
  }
  
  if (topHospital.emergency) {
    reasonParts.push(`with 24/7 emergency services`);
  }
  
  if (topHospital.formatted_address !== 'Address not specified' || topHospital.phone) {
    reasonParts.push(`with complete contact details`);
  }

  // Combine into a natural sentence
  let reason = `Recommended because ${reasonParts.join(' ')}.`;

  return `Found ${total} hospitals.

Recommended:
${topHospital.name}

Reason:
${reason}`;
};
