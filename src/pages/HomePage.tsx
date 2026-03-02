import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Zap, Clock, ChevronRight, Phone, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export const HomePage = () => {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(79,70,229,0.05)_0%,transparent_100%)]" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              v3.0 Modular Intelligence Engine
            </span>
            <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
              Real-time triage <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                powered by AI
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Assess symptoms instantly, detect red flags, and get structured medical summaries. 
              CARE-AI helps you make informed decisions when every second counts.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/assessment"
                className="rounded-full bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95"
              >
                Start Free Assessment
              </Link>
              <Link
                to="/dashboard"
                className="rounded-full border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Card */}
      <section className="mx-auto w-full max-w-4xl px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-3xl bg-red-600 p-6 text-white shadow-xl shadow-red-100">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/20 p-3">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">Emergency Services</div>
                <div className="text-sm opacity-80">Call 911 Immediately</div>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 opacity-50" />
          </div>
          <div className="flex items-center justify-between rounded-3xl bg-indigo-600 p-6 text-white shadow-xl shadow-indigo-100">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/20 p-3">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">Crisis Hotline</div>
                <div className="text-sm opacity-80">Call or Text 988</div>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 opacity-50" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              title: 'Instant Triage',
              desc: 'Get immediate urgency classification based on clinical protocols.',
              icon: Zap,
              color: 'text-amber-600',
              bg: 'bg-amber-50'
            },
            {
              title: 'Red Flag Detection',
              desc: 'AI identifies critical warning signs that require immediate escalation.',
              icon: Shield,
              color: 'text-red-600',
              bg: 'bg-red-50'
            },
            {
              title: 'Structured Reports',
              desc: 'Generate clinical-grade summaries ready for healthcare providers.',
              icon: Clock,
              color: 'text-indigo-600',
              bg: 'bg-indigo-50'
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={cn("mb-6 inline-flex rounded-2xl p-4", f.bg)}>
                <f.icon className={cn("h-6 w-6", f.color)} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{f.title}</h3>
              <p className="mt-4 leading-relaxed text-slate-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
