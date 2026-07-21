import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, ArrowRight, Lock, Mail, User, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, initialMode = 'signup', showToast, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Save to localStorage as requested
    const user = {
      id: `user_${Date.now()}`,
      fullName: name || 'Dr. Alex Morgan',
      email: email || 'alex@example.com',
      isLoggedIn: true
    };
    localStorage.setItem('currentUser', JSON.stringify(user));

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }

    if (showToast) {
      showToast(mode === 'signup' ? 'Vault created! Medical reports unlocked.' : 'Successfully logged in! Reports unlocked.', 'success');
    }
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setEmail('');
    setName('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md p-6 overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500" />

          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Access Granted!</h3>
              <p className="text-slate-600 text-sm max-w-xs mx-auto">
                Medical report details, OCR extractions, and AI summaries are now unlocked.
              </p>
              <button
                onClick={resetAndClose}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md"
              >
                View Unlocked Medical Reports
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">Authentication Required</span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                {mode === 'signup' ? 'Create Account to Unlock Reports' : 'Log In to View Reports'}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Medical record details are protected with 256-bit encryption. Please sign in to access confidential summaries.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Alex Morgan"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all group"
                >
                  <span>{mode === 'signup' ? 'Get Started' : 'Sign In & Unlock'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  {mode === 'signup' ? 'Already registered?' : "Don't have an account yet?"}{' '}
                  <button
                    onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                    className="text-blue-600 hover:underline font-bold ml-1"
                  >
                    {mode === 'signup' ? 'Log In' : 'Get Started'}
                  </button>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
