import React from 'react';
import { Mail, MapPin, Globe, Share2, MessageSquare, Send } from 'lucide-react';

export default function Footer({ onOpenAuth }) {
  return (
    <footer id="contact" className="bg-slate-50 border-t border-slate-200 text-slate-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Column 1: Brand & Subtext matching screenshot */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#home" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-xs">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-5.45 8-12V5l-8-3zm1 14h-2v-3H8v-2h3V8h2v3h3v2h-3v3z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                  MediSpace <span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
                  Upload. Analyze. Understand.
                </span>
              </div>
            </a>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Empowering patients to securely store medical records, extract OCR text, and understand diagnostic reports through AI and technology.
            </p>

            {/* Social Icons matching screenshot */}
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors" aria-label="Share">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors" aria-label="Community">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors" aria-label="Contact">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#home" className="hover:text-blue-600 transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-blue-600 transition-colors">Upload Record</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors">Medical Vault</a></li>
              <li><a href="#why-us" className="hover:text-blue-600 transition-colors">About Platform</a></li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Features</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#features" className="hover:text-blue-600 transition-colors">AI Reports</a></li>
              <li><a href="#features" className="hover:text-blue-600 transition-colors">OCR Analysis</a></li>
              <li><a href="#features" className="hover:text-blue-600 transition-colors">Specialist Intelligence</a></li>
              <li><a href="#features" className="hover:text-blue-600 transition-colors">Department Mapping</a></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Connect</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a href="mailto:contact@medispaceai.dev" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>contact@medispaceai.dev</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Hyderabad,India</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row matching screenshot */}
        <div className="pt-8 text-center text-xs font-medium text-slate-500">
          © {new Date().getFullYear()} MediSpace AI. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
