import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Cloud, Key, UserCheck, EyeOff, CheckCircle2 } from 'lucide-react';

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: <Lock className="w-6 h-6 text-blue-600" />,
      title: "End-to-End Encryption",
      description: "Data is encrypted on your device using AES-256 before transmission. No unencrypted medical records ever touch public channels.",
      techTag: "AES-256 GCM"
    },
    {
      icon: <Cloud className="w-6 h-6 text-blue-600" />,
      title: "Private Cloud Storage",
      description: "Isolated cloud buckets with strict encryption at rest ensure your personal health vault is protected from unauthorized access.",
      techTag: "Isolated Buckets"
    },
    {
      icon: <Key className="w-6 h-6 text-emerald-600" />,
      title: "Secure Authentication",
      description: "Multi-factor authentication (MFA), biometric passkey support, and hardware key integration protect your login.",
      techTag: "Passkey / WebAuthn"
    },
    {
      icon: <UserCheck className="w-6 h-6 text-purple-600" />,
      title: "Role-Based Access",
      description: "Grant temporary, read-only access to your treating physician or specialist with granular, auto-expiring share links.",
      techTag: "Granular Permissions"
    },
    {
      icon: <EyeOff className="w-6 h-6 text-blue-600" />,
      title: "Medical Privacy First",
      description: "We do not sell your personal data or use private medical records to train third-party public AI models. Your data stays strictly yours.",
      techTag: "Zero Data-Mining"
    }
  ];

  return (
    <section id="security" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 font-mono">
            SECURITY & PRIVACY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Health Data Stays Yours
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            We employ zero-knowledge security principles, so even our engineers cannot read your private medical reports.
          </p>
        </div>

        {/* Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                    {item.techTag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Audited Security Standard</span>
              </div>
            </motion.div>
          ))}

          {/* HIPAA Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-6 h-6 text-white" />
                <span className="text-xs font-mono uppercase font-bold text-blue-100 tracking-wider">HIPAA Ready Architecture</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">Compliance & Privacy Standard</h3>
              <p className="text-xs text-blue-100 leading-relaxed font-normal">
                Designed from the ground up to meet stringent healthcare privacy framework guidelines and ISO 27001 security principles.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-blue-500/50 font-mono text-[11px] text-blue-100 font-bold">
              ✓ Client-Controlled Decryption Keys
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
