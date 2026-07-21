import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, FileText, CheckCircle2, Sparkles, RefreshCw, Cpu, Stethoscope, Lock, EyeOff, UploadCloud, FolderOpen } from 'lucide-react';

export default function OcrSimulator({ showToast, isLoggedIn, onOpenAuth, onOpenUploadOcr, userReports = [] }) {
  const [activeReportIndex, setActiveReportIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const currentReport = userReports[activeReportIndex] || null;

  const handleScanClick = () => {
    if (!isLoggedIn) {
      onOpenAuth('login');
      if (showToast) showToast('Please log in to run OCR analysis.', 'info');
      return;
    }
    if (!currentReport) {
      onOpenUploadOcr();
      return;
    }
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (showToast) {
        showToast(`Re-scanned text from ${currentReport.title}!`, 'success');
      }
    }, 1200);
  };

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 font-mono">
            LIVE IMAGE OCR CONVERTER
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Convert Image Text to Digital Medical Records
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Upload any medical image file to convert text into structured digital data and AI health summaries.
          </p>
        </div>

        {/* Upload Custom Image CTA Banner */}
        <div className="mb-10 text-center">
          <button
            onClick={onOpenUploadOcr}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <UploadCloud className="w-5 h-5" />
            <span>Upload Your Image File to Extract Text</span>
          </button>
        </div>

        {/* User Uploaded Report Selectors */}
        {userReports.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {userReports.map((report, idx) => (
              <button
                key={report.id || idx}
                onClick={() => setActiveReportIndex(idx)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                  activeReportIndex === idx
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{report.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Dual Panel View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Panel */}
          <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200 p-6 relative overflow-hidden flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {currentReport ? currentReport.title : 'No Report Uploaded'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {currentReport ? currentReport.date : 'Vault is empty'}
                    </p>
                  </div>
                </div>

                {isLoggedIn ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked Access
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-mono text-amber-700 font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Login Required
                  </span>
                )}
              </div>

              {/* Laser Line */}
              {isScanning && (
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.2, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent shadow-md z-30 pointer-events-none"
                />
              )}

              {/* Raw Text Output Box */}
              <div className="relative p-5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed min-h-[190px] overflow-hidden">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-2 font-sans font-bold">
                  OCR Scanner Digital Text Output:
                </span>

                {currentReport ? (
                  <p className="whitespace-pre-line">
                    {currentReport.rawText}
                  </p>
                ) : (
                  <div className="py-8 text-center space-y-3">
                    <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-slate-500 font-sans text-xs font-semibold">
                      No custom image report loaded. Click "Upload Your Image File" to scan your document.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                <Cpu className="w-4 h-4" />
                OCR Engine Active
              </span>
              <button
                onClick={handleScanClick}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{currentReport ? 'Re-Scan Text' : 'Upload Image'}</span>
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-6 rounded-2xl bg-white border border-blue-200 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">MediSpace AI Summary</h3>
                    <p className="text-xs text-slate-500">Plain Language Health Translation</p>
                  </div>
                </div>
                {isLoggedIn ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    Unlocked
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                    Protected
                  </span>
                )}
              </div>

              {/* AI Key Insights Cards */}
              <div className="space-y-3 relative">
                {currentReport ? (
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
                    <span className="text-[11px] text-blue-700 font-bold uppercase tracking-wider block">Extracted Report Breakdown</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      {currentReport.aiSummary}
                    </p>
                  </div>
                ) : (
                  <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <p className="text-xs text-slate-500 font-medium">
                      Upload an image file to view AI plain-language interpretations.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                256-Bit Encrypted Vault Security
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
