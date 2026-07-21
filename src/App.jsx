import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import NearbyHospitals from './components/NearbyHospitals';
import OcrSimulator from './components/OcrSimulator';
import ProductShowcase from './components/ProductShowcase';
import SecuritySection from './components/SecuritySection';
import WhyUs from './components/WhyUs';
import FaqSection from './components/FaqSection';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DemoModal from './components/DemoModal';
import UploadOcrModal from './components/UploadOcrModal';
import Toast from './components/Toast';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [uploadOcrModalOpen, setUploadOcrModalOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAuth = (mode = 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenUploadOcr = () => {
    if (!isLoggedIn) {
      handleOpenAuth('login');
      showToast('Please log in to upload images and convert text.', 'info');
      return;
    }
    setUploadOcrModalOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    showToast('You have logged out. Medical dashboard hidden.', 'info');
  };

  const handleAddReport = (newReport) => {
    setUserReports(prev => [newReport, ...prev]);
  };

  const [detectedSpecialty, setDetectedSpecialty] = useState('');

  const handleFindHospitals = (specialty) => {
    setDetectedSpecialty(specialty);
    setUploadOcrModalOpen(false);
    showToast(`Searching for ${specialty} hospitals...`, 'success');
    
    // Give state time to update and modal to close, then scroll
    setTimeout(() => {
      const el = document.getElementById('hospitals');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white font-sans relative">
      
      {/* Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenUploadOcr={handleOpenUploadOcr}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />

      <main>
        {/* Hero Section (Home) */}
        <Hero
          onOpenAuth={handleOpenAuth}
          onOpenDemo={() => setDemoModalOpen(true)}
          onOpenUploadOcr={handleOpenUploadOcr}
          isLoggedIn={isLoggedIn}
        />

        {/* Product Dashboard Showcase - Only shown when logged in */}
        {isLoggedIn && (
          <div id="dashboard">
            <ProductShowcase
              showToast={showToast}
              isLoggedIn={isLoggedIn}
              onOpenAuth={handleOpenAuth}
              onOpenUploadOcr={handleOpenUploadOcr}
              userReports={userReports}
            />
          </div>
        )}

        {/* 6 Features */}
        <Features />

        {/* OCR & Health Vault Demo Section - Only shown when logged in */}
        {isLoggedIn && (
          <div id="ocr-vault">
            <OcrSimulator
              showToast={showToast}
              isLoggedIn={isLoggedIn}
              onOpenAuth={handleOpenAuth}
              onOpenUploadOcr={handleOpenUploadOcr}
              userReports={userReports}
            />
          </div>
        )}

        {/* Nearby Hospitals & Doctors search feature */}
        <NearbyHospitals
          showToast={showToast}
          onOpenAuth={handleOpenAuth}
          isLoggedIn={isLoggedIn}
          initialSpecialty={detectedSpecialty}
        />

        {/* 6 How It Works connected step nodes */}
        <HowItWorks />

        {/* Why MediSpace AI section + 4 Stats Cards */}
        <WhyUs />

        {/* Security Section */}
        <SecuritySection />

        {/* FAQ Section */}
        <FaqSection />

        {/* Ready Banner CTA */}
        <FinalCta onOpenAuth={handleOpenAuth} />
      </main>

      {/* Footer */}
      <Footer onOpenAuth={handleOpenAuth} />

      {/* Interactive Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        showToast={showToast}
        onLoginSuccess={handleLoginSuccess}
      />

      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      <UploadOcrModal
        isOpen={uploadOcrModalOpen}
        onClose={() => setUploadOcrModalOpen(false)}
        showToast={showToast}
        onAddReport={handleAddReport}
        onFindHospitals={handleFindHospitals}
      />

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
