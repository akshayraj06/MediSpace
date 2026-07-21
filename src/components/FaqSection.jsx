import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const faqs = [
    {
      q: "How secure is my data?",
      a: "MediSpace AI employs bank-level 256-bit AES encryption both in transit and at rest. Your files are encrypted on your device using client-side zero-knowledge protocols before stored in isolated cloud vaults. Only you hold your private decryption key."
    },
    {
      q: "Can I upload PDFs and photos?",
      a: "Yes! MediSpace AI accepts PDF reports, PNG scans, JPEG photos taken from mobile phones, and DICOM medical imaging files. Multi-page PDFs are automatically parsed and structured page by page."
    },
    {
      q: "Does OCR support handwritten prescriptions?",
      a: "Yes. Our OCR engine is specifically trained on medical typography, pharmaceutical abbreviations (such as BID, QID, TID), doctor handwriting patterns, and laboratory report tables."
    },
    {
      q: "Can AI explain complex medical terms?",
      a: "Absolutely. When you upload a lab test or diagnostic scan, MediSpace AI translates complex clinical jargon (e.g. 'stenosis', 'hyperlipidemia') into clear, plain-English explanations along with reference range context."
    },
    {
      q: "Is MediSpace AI free to use?",
      a: "Yes, MediSpace AI offers a free Starter tier that includes 5GB of encrypted storage, up to 25 OCR document scans per month, and AI report summaries. Premium tiers are available for unlimited storage and family plans."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2 mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 font-mono">
            FAQS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything you need to know about MediSpace AI features, security, and document parsing.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:border-blue-200 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <div className={`p-1.5 rounded-lg bg-slate-100 text-slate-600 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
