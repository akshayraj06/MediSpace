import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Shield, AlertTriangle } from 'lucide-react';

export default function ComparisonSection() {
  const comparisonRows = [
    {
      feature: "Format & Portability",
      traditional: "Physical paper binders & loose reports",
      traditionalOk: false,
      mediSpace: "100% Digital Cloud Vault",
      mediSpaceOk: true,
    },
    {
      feature: "Searchability",
      traditional: "Hard to search; manual paper flipping",
      traditionalOk: false,
      mediSpace: "Instant keyword & symptom search",
      mediSpaceOk: true,
    },
    {
      feature: "Risk of Loss",
      traditional: "Easily lost, damaged by water/fire",
      traditionalOk: false,
      mediSpace: "Redundant encrypted cloud backup",
      mediSpaceOk: true,
    },
    {
      feature: "Medical Understanding",
      traditional: "No AI explanation; complex jargon",
      traditionalOk: false,
      mediSpace: "AI-powered plain-language summaries",
      mediSpaceOk: true,
    },
    {
      feature: "Document Digitization",
      traditional: "No OCR; manual typing required",
      traditionalOk: false,
      mediSpace: "Automatic OCR text extraction",
      mediSpaceOk: true,
    },
    {
      feature: "Emergency Access",
      traditional: "Inaccessible when away from home",
      traditionalOk: false,
      mediSpace: "24/7 Access from any phone or PC",
      mediSpaceOk: true,
    }
  ];

  return (
    <section className="py-24 bg-dark-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <span>Why Choose MediSpace AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Traditional Storage vs. MediSpace AI
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            See how upgrading to an intelligent health vault transforms your medical record management.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-slate-900/90 p-4 sm:p-5 border-b border-slate-800 text-sm font-bold text-white items-center">
            <div className="col-span-4 text-slate-300 font-sans">Feature</div>
            <div className="col-span-4 text-rose-400 flex items-center gap-1.5 font-sans">
              <AlertTriangle className="w-4 h-4 hidden sm:block" />
              <span>Traditional Storage</span>
            </div>
            <div className="col-span-4 text-cyan-300 flex items-center gap-1.5 font-sans">
              <Sparkles className="w-4 h-4 text-cyan-400 hidden sm:block" />
              <span>MediSpace AI</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-800/80">
            {comparisonRows.map((row, idx) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm items-center hover:bg-slate-900/40 transition-colors"
              >
                <div className="col-span-4 font-semibold text-white">
                  {row.feature}
                </div>

                <div className="col-span-4 flex items-center gap-2 text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span className="hidden sm:inline">{row.traditional}</span>
                  <span className="sm:hidden text-[11px]">{row.traditional}</span>
                </div>

                <div className="col-span-4 flex items-center gap-2 text-cyan-300 font-medium">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="hidden sm:inline">{row.mediSpace}</span>
                  <span className="sm:hidden text-[11px] text-white">{row.mediSpace}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
