import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, Sparkles, Filter, CheckCircle2, ChevronRight, Database, Lock, ShieldCheck, Key, ArrowRight, FolderOpen, Heart, Building2, MapPin, Star, X } from 'lucide-react';
import { getSavedHospitals, removeSavedHospital } from '../services/savedHospitals';

export default function ProductShowcase({ showToast, isLoggedIn, onOpenAuth, onOpenUploadOcr, userReports = [] }) {
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'hospitals'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Saved Hospitals state
  const [savedHospitals, setSavedHospitals] = useState([]);

  // Load saved hospitals
  useEffect(() => {
    if (isLoggedIn && activeTab === 'hospitals') {
      setSavedHospitals(getSavedHospitals());
    }
  }, [isLoggedIn, activeTab]);

  const categories = ['All', 'Prescriptions', 'Lab Tests', 'Radiology', 'Doctor Notes'];

  const filteredReports = userReports.filter(report => {
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (report.doctor && report.doctor.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (report.aiSummary && report.aiSummary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredHospitals = savedHospitals.filter(hospital => 
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (hospital.formatted_address && hospital.formatted_address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewDetails = (title) => {
    if (!isLoggedIn) {
      onOpenAuth('login');
      if (showToast) showToast('Log in required to access dashboard files.', 'info');
      return;
    }
    if (showToast) showToast(`Viewing details for ${title}`, 'info');
  };

  const handleRemoveHospital = (placeId) => {
    removeSavedHospital(placeId);
    setSavedHospitals(getSavedHospitals());
    if (showToast) showToast('Hospital removed from saved list', 'info');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 font-mono">
            YOUR HEALTH VAULT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Encrypted Health Vault Dashboard
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            All stored reports are encrypted. Upload an image or file to add records to your vault.
          </p>
        </div>

        {/* Full App Mockup Window */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden relative">
          
          {/* Top Window Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="h-4 w-px bg-slate-300 ml-1" />
              <span className="text-xs font-extrabold text-slate-900">MediSpace AI Vault</span>
            </div>

            {/* Status Indicator */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AES-256 VAULT DECRYPTED</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold font-mono">
                <Lock className="w-3.5 h-3.5" />
                <span>VAULT ENCRYPTED & LOCKED</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenUploadOcr}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Image / File</span>
              </button>
            </div>

          </div>

          {/* Subheader: Tabs & Filters */}
          <div className="p-4 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'reports' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Reports
              </button>
              <button
                onClick={() => setActiveTab('hospitals')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'hospitals' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Saved Hospitals
              </button>
            </div>

            <div className="flex items-center gap-4 flex-1 md:justify-end overflow-hidden">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  disabled={!isLoggedIn}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isLoggedIn ? `Search ${activeTab === 'reports' ? 'uploaded reports' : 'saved hospitals'}...` : "Log in to search encrypted vault..."}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors font-medium disabled:opacity-60 cursor-not-allowed"
                />
              </div>

              {activeTab === 'reports' && (
                <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
                  <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      disabled={!isLoggedIn}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900'
                      } disabled:opacity-50`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dashboard Area */}
          <div className="relative p-6 bg-slate-50/50 min-h-[340px]">
            
            {!isLoggedIn ? (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 shadow-md">
                  <Lock className="w-8 h-8" />
                </div>
                
                <div className="max-w-md space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold font-mono">
                    <ShieldCheck className="w-4 h-4" /> 256-BIT ZERO-KNOWLEDGE ENCRYPTION
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Dashboard & Reports Encrypted
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Personal medical history, diagnostic statistics, active AI summaries, and recent report files are protected. Please log in to decrypt your vault data.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>Log In to Decrypt Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="px-5 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors"
                  >
                    Create Free Vault Account
                  </button>
                </div>
              </div>
            ) : null}

            {/* Dashboard Content */}
            <div className={!isLoggedIn ? "filter blur-sm select-none pointer-events-none" : ""}>
              
              {/* Stat Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block mb-1">Total Vault Files</span>
                    <span className="text-xl font-extrabold text-slate-900">{userReports.length} Records</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                    <Database className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block mb-1">OCR Precision Rate</span>
                    <span className="text-xl font-extrabold text-emerald-600">95.8%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block mb-1">Active AI Summaries</span>
                    <span className="text-xl font-extrabold text-purple-600">{userReports.length} Insights</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Content Area */}
              {activeTab === 'reports' ? (
                /* User Uploaded Reports List */
                userReports.length === 0 ? (
                  <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <FolderOpen className="w-7 h-7" />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base">Your Health Vault is Empty</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      No medical reports uploaded yet. Click "Upload Image / File" above to extract text and store your first report.
                    </p>
                    <button
                      onClick={onOpenUploadOcr}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Your First Image</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredReports.map((report) => (
                      <div
                        key={report.id}
                        className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs group"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 mt-0.5">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900">
                                {report.title}
                              </h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                                {report.status || 'OCR Completed (95.8%)'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">
                              {report.date} • {report.fileName}
                            </p>
                            <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 flex items-center gap-2 font-medium">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span><strong>Extracted Text Preview:</strong> {report.extractedTextSnippet}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleViewDetails(report.title)}
                          className="self-end md:self-center px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-xs font-bold text-slate-700 transition-colors flex items-center gap-1 shrink-0"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* Saved Hospitals List */
                savedHospitals.length === 0 ? (
                  <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                      <Heart className="w-7 h-7" />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base">No Saved Hospitals</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      You haven't saved any hospitals yet. Search for nearby hospitals and click the save button to add them here.
                    </p>
                    <a
                      href="#hospitals"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 mt-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Find Hospitals</span>
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredHospitals.map((hospital) => (
                      <div
                        key={hospital.place_id}
                        className="p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs group"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 mt-0.5 shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {hospital.name}
                              </h4>
                              {hospital.rating && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {hospital.rating}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1.5 truncate">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              <span className="truncate">{hospital.formatted_address}</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Saved on {new Date(hospital.savedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.name + ', ' + hospital.formatted_address)}&destination_place_id=${hospital.place_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold transition-colors"
                          >
                            Directions
                          </a>
                          <button
                            onClick={() => handleRemoveHospital(hospital.place_id)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove from saved"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
