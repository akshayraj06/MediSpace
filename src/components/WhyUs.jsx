import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Target, Clock, HeartPulse } from 'lucide-react';

export default function WhyUs() {
  const benefits = [
    "Save time and effort",
    "Easy and accurate specialist selection",
    "AI generated accurate summaries",
    "Professional health documentation",
    "OCR assisted image & PDF understanding",
    "Empower patients, improve health outcomes"
  ];

  const stats = [
    {
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      bgCircle: "bg-emerald-50 border border-emerald-100",
      number: "10,000+",
      label: "Reports Generated"
    },
    {
      icon: <Target className="w-6 h-6 text-purple-600" />,
      bgCircle: "bg-purple-50 border border-purple-100",
      number: "95.8%",
      label: "OCR Accuracy"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      bgCircle: "bg-blue-50 border border-blue-100",
      number: "24/7",
      label: "AI Assistance"
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-pink-600" />,
      bgCircle: "bg-pink-50 border border-pink-100",
      number: "100%",
      label: "Free & Secure to Use"
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Section matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column Illustration Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-md bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
              {/* Clipboard Graphic */}
              <div className="rounded-2xl bg-blue-50/50 p-6 border border-blue-100 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <span className="text-xs font-extrabold text-slate-800 uppercase">Health Audit Record</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">VERIFIED</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">Lipid Panel & Biomarkers Analyzed</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">Prescription OCR Extracted (95.8%)</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">Plain-Language Summary Generated</span>
                  </div>
                </div>
              </div>

              {/* Plant Graphic at Bottom */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">MediSpace AI Vault System</span>
                <span className="text-blue-600 font-bold">HIPAA Ready</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column Content matching screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-5"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 font-mono">
              WHY MEDISPACE AI?
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Smart medical records for better health management
            </h2>

            {/* 6 Green Checkmark items in 2 columns matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-slate-700">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* 4 Stats Cards Bar matching screenshot */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.bgCircle} flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 leading-none mb-1">
                  {stat.number}
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
