import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Chronic Care Patient",
      location: "Austin, TX",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      quote: "Managing my father's 10-year medical history was a nightmare of paper files. MediSpace AI scanned 40+ lab reports in minutes and gave us plain-language explanations. Absolutely essential tool.",
      verified: "Verified Patient Vault User"
    },
    {
      name: "Dr. Elena Rostova",
      role: "Internal Medicine Specialist",
      location: "Seattle, WA",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250",
      quote: "When my patients show up with their MediSpace AI timeline, our consultations are twice as productive. The OCR extraction accuracy on handwritten prescriptions is genuinely impressive.",
      verified: "Board Certified Physician"
    },
    {
      name: "Sophia Chen",
      role: "Mother of Two",
      location: "San Francisco, CA",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
      quote: "Being able to search 'Amoxicillin dose 2024' and instantly pull up my daughter's exact prescription while traveling gave me immense peace of mind. The design is so sleek and fast.",
      verified: "Verified Family Plan User"
    }
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <span>Real Patient Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Loved by Patients & Doctors Alike
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Read how MediSpace AI empowers people to take back control of their healthcare documents.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 backdrop-blur-md flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-700 group-hover:text-cyan-400/40 transition-colors" />
                </div>

                <p className="text-slate-300 text-sm leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* User Bio */}
              <div className="pt-5 border-t border-slate-800/80 flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-700 shadow-md"
                />
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-400">{t.role} • {t.location}</p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t.verified}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
