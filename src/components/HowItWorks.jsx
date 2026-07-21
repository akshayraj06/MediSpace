import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Scan, Sparkles, FileCheck, Stethoscope, Clock } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      stepNumber: "1",
      icon: <Upload className="w-5 h-5 text-blue-600" />,
      bgCircle: "bg-blue-50 border border-blue-100",
      title: "Upload Records",
      description: "Drag and drop prescriptions, lab tests, or Radiology images."
    },
    {
      stepNumber: "2",
      icon: <Scan className="w-5 h-5 text-purple-600" />,
      bgCircle: "bg-purple-50 border border-purple-100",
      title: "OCR Scan",
      description: "Our high-precision OCR extracts text from your physical documents."
    },
    {
      stepNumber: "3",
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      bgCircle: "bg-emerald-50 border border-emerald-100",
      title: "AI Analysis",
      description: "MediSpace AI translates medical terms into plain language."
    },
    {
      stepNumber: "4",
      icon: <FileCheck className="w-5 h-5 text-cyan-600" />,
      bgCircle: "bg-cyan-50 border border-cyan-100",
      title: "Executive Summary",
      description: "Receive a structured breakdown of key findings & dosages."
    },
    {
      stepNumber: "5",
      icon: <Stethoscope className="w-5 h-5 text-indigo-600" />,
      bgCircle: "bg-indigo-50 border border-indigo-100",
      title: "Specialist Guidance",
      description: "Get recommendations on which medical specialists to visit next."
    },
    {
      stepNumber: "6",
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bgCircle: "bg-amber-50 border border-amber-100",
      title: "Secure Vault Storage",
      description: "Access your organized medical history 24/7 anywhere."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching reference screenshot */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 font-mono">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How MediSpace AI Simplifies Health Records
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From raw paper scan to intelligent medical breakdown in 6 simple steps.
          </p>
        </div>

        {/* 6 Connected Step Nodes matching reference image layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          
          {steps.map((step, idx) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                {/* Icon in Circular Pastel Background */}
                <div className={`w-12 h-12 rounded-2xl ${step.bgCircle} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  {step.icon}
                </div>

                {/* Royal Blue Step Badge matching reference screenshot */}
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  {step.stepNumber}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
