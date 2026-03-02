import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Loader2, Activity, Clock, Heart, History } from 'lucide-react';
import { cn } from '../lib/utils';

export const AssessmentPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    symptoms: '',
    duration: '',
    severity: 5,
    history: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.id) {
        navigate(`/report/${data.id}`);
      }
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  const steps = [
    { title: 'Symptoms', icon: Activity },
    { title: 'Timeline', icon: Clock },
    { title: 'Severity', icon: Heart },
    { title: 'History', icon: History }
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-12 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
              step > i + 1 ? "border-indigo-600 bg-indigo-600 text-white" : 
              step === i + 1 ? "border-indigo-600 text-indigo-600" : "border-slate-200 text-slate-300"
            )}>
              <s.icon className="h-5 w-5" />
            </div>
            <span className={cn("text-xs font-bold uppercase tracking-wider", step === i + 1 ? "text-indigo-600" : "text-slate-400")}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-6 py-20 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-indigo-400/20" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 shadow-xl shadow-indigo-200">
                <Loader2 className="h-10 w-10 animate-spin text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Analyzing Symptoms</h2>
              <p className="mt-2 text-slate-500">CARE-AI is processing your clinical context...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">What are you feeling?</h2>
                <p className="text-slate-500">Describe your primary symptoms in detail.</p>
                <textarea
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows={6}
                  placeholder="e.g., Sharp pain in my lower back, radiating to my left leg..."
                  value={formData.symptoms}
                  onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">When did it start?</h2>
                <p className="text-slate-500">Provide a timeline of when you first noticed the symptoms.</p>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g., 2 hours ago, yesterday morning..."
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">How severe is the pain?</h2>
                <p className="text-slate-500">Rate your discomfort on a scale of 1 to 10.</p>
                <div className="py-10">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
                    value={formData.severity}
                    onChange={e => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                  />
                  <div className="mt-4 flex justify-between text-sm font-bold text-slate-400">
                    <span>1 (Mild)</span>
                    <span className="text-2xl text-indigo-600">{formData.severity}</span>
                    <span>10 (Severe)</span>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Medical History</h2>
                <p className="text-slate-500">Any existing conditions or medications we should know about?</p>
                <textarea
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows={6}
                  placeholder="e.g., Hypertension, taking Lisinopril..."
                  value={formData.history}
                  onChange={e => setFormData({ ...formData, history: e.target.value })}
                />
              </div>
            )}

            <div className="mt-10 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" /> Back
                </button>
              ) : <div />}
              
              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={step === 1 && !formData.symptoms}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Next <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                >
                  Submit Assessment
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
