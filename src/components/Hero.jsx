import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Scan, Zap, ShieldCheck, Plus, FileText, Image as ImageIcon, Lock } from 'lucide-react';

export default function Hero({ onOpenAuth, onOpenDemo, onOpenUploadOcr, isLoggedIn }) {
  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden bg-white">
      
      {/* Background Soft Blue Glow Accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[650px] h-[650px] bg-blue-50/80 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Top Badge matching reference image */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI-Powered Medical Vault & Health Platform</span>
            </div>

            {/* Headline matching screenshot font style */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Store Medical Records.{' '}
              <span className="block text-slate-900 mt-1">
                Understand Real Health.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              Upload prescriptions, lab reports, and medical scans in one place. Let OCR convert image text to digital text with plain-language AI recommendations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    onOpenUploadOcr();
                  } else {
                    onOpenAuth('signup');
                  }
                }}
                className="px-7 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 group text-base"
              >
                <span>{isLoggedIn ? 'Upload Image for OCR' : 'Get Started'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenDemo}
                className="px-7 py-3.5 rounded-xl font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 transition-all text-base"
              >
                Learn More
              </button>
            </div>

            {/* Micro Feature Icons matching reference screenshot bottom */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Scan className="w-4 h-4 text-blue-600" />
                <span>OCR Enabled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Vault Secured</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual UI Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative flex items-center justify-center">

              {/* Central Phone / Document Mockup Container */}
              <div className="relative w-full max-w-sm rounded-[32px] bg-white border-4 border-slate-100 p-5 shadow-[0_0_55px_rgba(37,99,235,0.28),0_20px_45px_-5px_rgba(0,0,0,0.08)] ring-2 ring-blue-200/80 z-20">
                
                {/* Mockup Header */}
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Your Medical Record</span>
                      <div className="h-2.5 bg-slate-200 rounded-full w-32 mb-1" />
                      <div className="h-2 bg-slate-100 rounded-full w-20" />
                    </div>

                    {isLoggedIn ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> LOCKED
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Prescription & Doctor</span>
                    {isLoggedIn ? (
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Dr. Sarah Jenkins • Cardiology</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>••••••••••••••••••••••••</span>
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Upload Images Thumbnails Box */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">Uploaded Images & Reports</span>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-1 relative overflow-hidden group">
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-600 mt-1">Scan 1</span>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-1 relative overflow-hidden group">
                        <FileText className="w-6 h-6 text-blue-500" />
                        <span className="text-[9px] font-bold text-slate-600 mt-1">Lab.pdf</span>
                      </div>
                      
                      <div
                        onClick={() => {
                          if (isLoggedIn) {
                            onOpenUploadOcr();
                          } else {
                            onOpenAuth('login');
                          }
                        }}
                        className="w-14 h-14 rounded-xl bg-blue-50 border-2 border-dashed border-blue-300 flex items-center justify-center text-blue-600 hover:bg-blue-100 cursor-pointer transition-colors"
                        title={isLoggedIn ? "Upload Image for OCR" : "Log In to Upload"}
                      >
                        {isLoggedIn ? <Plus className="w-5 h-5" /> : <Lock className="w-4 h-4 text-slate-500" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leaves / Plant Graphic Accent at bottom left */}
                <div className="absolute -bottom-4 -left-6 z-30 pointer-events-none">
                  <svg className="w-16 h-16 text-emerald-500 opacity-90" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 10 C30 30, 20 60, 10 90 C40 80, 70 70, 90 50 C70 40, 60 20, 50 10 Z" fill="#22C55E" opacity="0.8" />
                    <path d="M30 40 C20 55, 15 75, 5 95 C25 88, 45 80, 60 65 Z" fill="#16A34A" />
                  </svg>
                </div>

              </div>

              {/* Floating Cards on Right connected via Dotted Lines */}
              <div className="hidden sm:flex flex-col gap-5 absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 z-30 w-56">
                
                {/* Floating Card 1: OCR Analysis */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_12px_35px_-5px_rgba(37,99,235,0.15)] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600 font-mono text-xs font-extrabold">
                      T
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">OCR Analysis</h5>
                      <p className="text-[10px] text-slate-500">
                        {isLoggedIn ? 'Extracting text from scans...' : 'Encrypted • Login to scan'}
                      </p>
                    </div>
                  </div>
                  {isLoggedIn ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </motion.div>

                {/* Floating Card 2: AI Processing */}
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                  className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_12px_35px_-5px_rgba(37,99,235,0.15)] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">AI Processing</h5>
                      <p className="text-[10px] text-slate-500">
                        {isLoggedIn ? 'Analyzing medical terms...' : 'Protected AI Engine'}
                      </p>
                    </div>
                  </div>
                  {isLoggedIn ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </motion.div>

                {/* Floating Card 3: Report Generated */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_12px_35px_-5px_rgba(37,99,235,0.15)] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Summary Ready</h5>
                      <p className="text-[10px] text-slate-500">
                        {isLoggedIn ? 'Plain-language report created.' : 'Sign in to access summary'}
                      </p>
                    </div>
                  </div>
                  {isLoggedIn ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </motion.div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
