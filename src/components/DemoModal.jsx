import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, FileText, Cpu, ShieldCheck, Sparkles } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="font-semibold text-white">MediSpace AI — Product Interactive Walkthrough</h3>
                <p className="text-xs text-slate-400">See OCR digitization and plain-language medical translation in action</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Screen Simulation */}
          <div className="p-6 bg-dark-900 space-y-6">
            <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 text-center group">
              {/* Radial background glow */}
              <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

              <div className="relative z-10 space-y-4 max-w-lg">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/30 animate-pulse">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-8 h-8" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE OCR ENGINE ACTIVE
                </div>

                <h4 className="text-xl font-bold text-white">
                  Extracting Prescription & Analyzing Lab Biomarkers...
                </h4>

                <div className="grid grid-cols-3 gap-3 pt-2 text-left">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-400 block mb-1">OCR Accuracy</span>
                    <span className="text-emerald-400 font-bold text-sm">99.8%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-400 block mb-1">Security</span>
                    <span className="text-cyan-400 font-bold text-sm">AES-256</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-400 block mb-1">Analysis Time</span>
                    <span className="text-blue-400 font-bold text-sm">1.2 Seconds</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Callouts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-white">1. Instant Upload</h5>
                  <p className="text-slate-400 mt-0.5">Drag & drop PDFs, scans, photos, or doctor notes.</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
                <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-white">2. Medical OCR & AI</h5>
                  <p className="text-slate-400 mt-0.5">Translates complex medical jargon into clear terms.</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-white">3. Zero-Knowledge Vault</h5>
                  <p className="text-slate-400 mt-0.5">Only you hold the encryption keys to your data.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
