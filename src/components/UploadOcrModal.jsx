import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, FileText, Scan, CheckCircle2, Sparkles, RefreshCw, Cpu, Image as ImageIcon, Copy, ShieldCheck, AlertCircle, Building2 } from 'lucide-react';
import Tesseract from 'tesseract.js';
import confetti from 'canvas-confetti';
import { mapSymptomToSpecialty, predictSpecialtyWithGemini } from '../services/symptomMapper';

export default function UploadOcrModal({ isOpen, onClose, showToast, onAddReport, onFindHospitals }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [aiSummary, setAiSummary] = useState(null);
  const [rawConfidence, setRawConfidence] = useState(0);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      runOcrOnImage(reader.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Enhance contrast on canvas for maximum OCR accuracy
  const preprocessImage = (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(imageSrc);
      img.src = imageSrc;
    });
  };

  const runOcrOnImage = async (imageSrc, fileName) => {
    setIsProcessing(true);
    setOcrProgress(10);
    setExtractedText('');
    setAiSummary(null);
    setRawConfidence(0);

    try {
      const processedImage = await preprocessImage(imageSrc);

      const result = await Tesseract.recognize(
        processedImage,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      const rawExtracted = result.data.text ? result.data.text.trim() : '';
      const confidence = Math.round(result.data.confidence || 0);

      setRawConfidence(confidence);
      setOcrProgress(100);

      if (rawExtracted.length > 0) {
        setExtractedText(rawExtracted);
        analyzeExtractedText(rawExtracted, fileName);
        
        // Add to user reports vault
        if (onAddReport) {
          onAddReport({
            id: Date.now(),
            title: fileName.replace(/\.[^/.]+$/, ""),
            fileName: fileName,
            date: new Date().toLocaleDateString(),
            rawText: rawExtracted,
            extractedTextSnippet: rawExtracted.slice(0, 100) + '...',
            aiSummary: `Extracted ${rawExtracted.split(/\s+/).length} words directly from ${fileName}.`,
            category: 'Lab Tests',
            status: 'OCR Completed'
          });
        }

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });

        if (showToast) {
          showToast('Text successfully extracted from uploaded image!', 'success');
        }
      } else {
        setExtractedText('No text detected in this image. Please upload a clearer, well-lit medical document photo or PDF scan.');
        if (showToast) {
          showToast('No readable text found in the image.', 'info');
        }
      }

    } catch (err) {
      console.error('OCR Extraction Error:', err);
      setExtractedText('Error processing image file. Please ensure the file is a valid PNG, JPG, or WEBP photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeExtractedText = async (text, fileName) => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const words = text.split(/\s+/).filter(word => word.length > 3);

    // AI Specialty Detection
    let detectedSpecialty = null;
    const lowerText = text.toLowerCase();
    
    // Quick heuristic to find specialty from OCR text
    const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Dermatology', 'ENT & Pulmonology', 'General Medicine'];
    for (const spec of specialties) {
      if (lowerText.includes(spec.toLowerCase())) {
        detectedSpecialty = spec;
        break;
      }
    }
    
    // If exact specialty name not found, try mapping symptoms
    if (!detectedSpecialty) {
      detectedSpecialty = mapSymptomToSpecialty(text);
      if (!detectedSpecialty) {
        try {
          detectedSpecialty = await predictSpecialtyWithGemini(text);
        } catch(e) {}
      }
    }

    let plainLanguage = `Analyzed ${words.length} words extracted from your document image. Key terms identified: ${words.slice(0, 6).join(', ')}.`;
    if (detectedSpecialty) {
      plainLanguage += `\n\nBased on your report, a ${detectedSpecialty} is recommended.`;
    }

    setAiSummary({
      fileName: fileName,
      lineCount: lines.length,
      wordCount: words.length,
      textSnippet: lines.slice(0, 3).join(' | '),
      plainLanguage,
      detectedSpecialty
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    if (showToast) showToast('Extracted text copied to clipboard!', 'success');
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setExtractedText('');
    setAiSummary(null);
    setIsProcessing(false);
    setRawConfidence(0);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Pure Image OCR Reader</h3>
                <p className="text-xs text-slate-500">Extracts exact printed and handwritten text directly from your uploaded file</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

            {/* Dropzone */}
            {!imagePreview ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 rounded-2xl p-10 text-center cursor-pointer transition-all space-y-4 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-blue-200 text-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Click to select or drag & drop an image file
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Extracts text from PNG, JPG, JPEG, WEBP, or PDF scans (Prescriptions, Lab Reports, Invoices)
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Direct Image-to-Text OCR Engine</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">

                {/* Preview & Progress Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Uploaded Image Preview */}
                  <div className="md:col-span-5 rounded-2xl bg-slate-900 p-3 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
                    <img
                      src={imagePreview}
                      alt="Uploaded user file"
                      className="max-h-[200px] object-contain rounded-xl"
                    />

                    {/* Scanning Laser Line */}
                    {isProcessing && (
                      <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: '95%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06B6D4] z-20 pointer-events-none"
                      />
                    )}

                    <div className="mt-2 text-[11px] font-mono text-slate-300 text-center truncate max-w-[200px]">
                      {selectedFile?.name}
                    </div>
                  </div>

                  {/* Extraction Progress */}
                  <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-blue-600" />
                          {isProcessing ? 'Reading image text with OCR...' : 'Reading Complete'}
                        </span>
                        <span className="text-xs font-mono font-extrabold text-blue-600">
                          {ocrProgress}%
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <motion.div
                          className="h-full bg-blue-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${ocrProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {!isProcessing && rawConfidence > 0 && (
                        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                          <span className="font-semibold text-slate-700">OCR Confidence Score:</span>
                          <span className="font-bold text-emerald-600">{rawConfidence}%</span>
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={resetUpload}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Upload New Image</span>
                      </button>

                      {extractedText && (
                        <button
                          onClick={copyToClipboard}
                          className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 border border-blue-200 transition-colors flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Extracted Text</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* Exact Text Output Area */}
                <div className="space-y-4 pt-2">
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-white">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        Extracted Text Result (Read directly from image):
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                        Exact Image OCR
                      </span>
                    </div>

                    <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto select-all">
                      {extractedText}
                    </pre>
                  </div>

                  {/* Dynamic AI Summary */}
                  {aiSummary && (
                    <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5 space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-extrabold text-slate-900 uppercase">Extracted Content Analysis</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        {aiSummary.plainLanguage}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span>Lines Read: <strong>{aiSummary.lineCount}</strong></span>
                          <span>Words Extracted: <strong>{aiSummary.wordCount}</strong></span>
                        </div>
                        
                        {aiSummary.detectedSpecialty && onFindHospitals && (
                          <button
                            onClick={() => onFindHospitals(aiSummary.detectedSpecialty)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            Find {aiSummary.detectedSpecialty} Hospitals
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end font-bold">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-md transition-colors"
            >
              Done & Save to Vault
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
