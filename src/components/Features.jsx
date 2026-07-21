import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Scan, UserCheck, FileText, Stethoscope, History } from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      bgCircle: "bg-blue-50 border border-blue-100",
      title: "Natural Language Insights",
      description: "Ask questions about your health records in plain language. Get instant AI explanations without confusing medical jargon."
    },
    {
      icon: <Scan className="w-6 h-6 text-purple-600" />,
      bgCircle: "bg-purple-50 border border-purple-100",
      title: "OCR Image & PDF Analysis",
      description: "Extract text from prescriptions, bloodwork, and scans using optical character recognition in seconds."
    },
    {
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
      bgCircle: "bg-emerald-50 border border-emerald-100",
      title: "Specialist Intelligence",
      description: "AI assists in triaging symptoms and suggesting appropriate medical specialists for your specific condition."
    },
    {
      icon: <FileText className="w-6 h-6 text-cyan-600" />,
      bgCircle: "bg-cyan-50 border border-cyan-100",
      title: "AI Report Generation",
      description: "Consolidate complex hospital discharge papers and lab results into clean, easy-to-read executive summaries."
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-indigo-600" />,
      bgCircle: "bg-indigo-50 border border-indigo-100",
      title: "Department Recommendation",
      description: "Get smart recommendations on which medical department or diagnostic test to pursue next."
    },
    {
      icon: <History className="w-6 h-6 text-amber-600" />,
      bgCircle: "bg-amber-50 border border-amber-100",
      title: "Medical Report History",
      description: "Keep a complete, chronological digital audit trail of your lifetime medical consultations and scans."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 font-mono">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for complete medical understanding
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything you need to store, analyze, and manage your health records in one secure workspace.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md transition-all space-y-4 group"
            >
              {/* Icon Circle */}
              <div className={`w-14 h-14 rounded-2xl ${feature.bgCircle} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                {feature.icon}
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
