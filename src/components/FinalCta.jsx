import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FinalCta({ onOpenAuth }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Soft Blue CTA Banner Container */}
        <div className="rounded-3xl bg-blue-50 border border-blue-100 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-sm">
          
          {/* Left Text */}
          <div className="space-y-2 max-w-xl text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ready to organize your medical history?
            </h2>
            <p className="text-sm text-slate-600 font-normal">
              Create an account, gain AI health insights, and keep your family's records secure today.
            </p>
          </div>

          {/* Right Action & People Vector Illustration Accent */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-7 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 text-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Micro People Avatar Group Graphic */}
            <div className="hidden sm:flex items-center -space-x-2">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                JD
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                DR
              </div>
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                MC
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
