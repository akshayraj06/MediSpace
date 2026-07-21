import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ScanLine, BrainCircuit, CloudCheck, Lock, Activity } from 'lucide-react';

export default function TrustSection() {
  const trustItems = [
    {
      icon: <Lock className="w-5 h-5 text-blue-400" />,
      title: "256-bit Encryption",
      subtitle: "AES Military Grade",
      glowColor: "border-blue-500/20"
    },
    {
      icon: <ScanLine className="w-5 h-5 text-cyan-400" />,
      title: "OCR Powered",
      subtitle: "99.8% Precision",
      glowColor: "border-cyan-500/20"
    },
    {
      icon: <BrainCircuit className="w-5 h-5 text-purple-400" />,
      title: "AI Insights",
      subtitle: "Plain Language",
      glowColor: "border-purple-500/20"
    },
    {
      icon: <CloudCheck className="w-5 h-5 text-emerald-400" />,
      title: "Cloud Secure",
      subtitle: "Redundant Backup",
      glowColor: "border-emerald-500/20"
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
      title: "Privacy First",
      subtitle: "HIPAA Ready Architecture",
      glowColor: "border-blue-500/20"
    }
  ];

  return (
    <section className="py-12 border-y border-slate-800/80 bg-slate-950/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Trusted by Future Healthcare Architecture
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`p-4 rounded-2xl bg-slate-900/60 border ${item.glowColor} hover:border-slate-700 backdrop-blur-md flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="p-2.5 rounded-xl bg-slate-800/80 mb-3 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h4>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {item.subtitle}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
