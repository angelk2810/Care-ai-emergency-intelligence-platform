import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldAlert, Clock, CheckCircle2, AlertCircle, 
  Stethoscope, Download, Share2, History, Activity,
  BrainCircuit, ChevronLeft
} from 'lucide-react';
import { TriageReport } from '../types';
import { cn } from '../lib/utils';

export const ReportPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState<TriageReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/reports/${id}`);
        const data = await res.json();
        setReport(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading report...</div>;
  if (!report) return <div className="flex h-screen items-center justify-center">Report not found.</div>;

  const getUrgencyStyles = (level: string) => {
    switch (level) {
      case 'Critical': return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: ShieldAlert };
      case 'Urgent': return { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Clock };
      case 'Non-Urgent': return { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 };
      default: return { color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200', icon: AlertCircle };
    }
  };

  const styles = getUrgencyStyles(report.urgency_level);
  const Icon = styles.icon;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/assessment" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600">
        <ChevronLeft className="h-4 w-4" /> New Assessment
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("rounded-3xl border-2 p-8", styles.bg, styles.border)}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <Icon className={cn("h-8 w-8", styles.color)} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-60">Urgency Level</div>
                  <div className={cn("text-3xl font-black", styles.color)}>{report.urgency_level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-widest opacity-60">AI Confidence</div>
                <div className="text-2xl font-black text-slate-900">{report.confidence_score}%</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Primary Concern</h3>
                <p className="text-xl font-bold text-slate-900">{report.primary_concern}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Clinical Reasoning</h3>
                <p className="leading-relaxed text-slate-700">{report.reasoning}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-indigo-600">
                <History className="h-5 w-5" />
                <h3 className="font-bold">Timeline</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Onset</span>
                  <span className="font-bold text-slate-700">{report.timeline.onset}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Duration</span>
                  <span className="font-bold text-slate-700">{report.timeline.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pattern</span>
                  <span className="font-bold text-slate-700">{report.timeline.pattern}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-red-600">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-bold">Red Flags</h3>
              </div>
              <ul className="space-y-2 text-sm">
                {report.red_flags.map((flag, i) => (
                  <li key={i} className="flex gap-2 text-slate-700">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-emerald-600">
              <Activity className="h-5 w-5" />
              <h3 className="font-bold">Immediate Action Protocol</h3>
            </div>
            <ol className="space-y-4">
              {report.immediate_actions.map((action, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700">{action}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
            <div className="mb-4 flex items-center gap-2 opacity-60">
              <Stethoscope className="h-5 w-5" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Provider Summary</h3>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 font-mono text-xs leading-relaxed border border-white/10">
              {report.doctor_summary}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100">
                <Download className="h-4 w-4" /> Download PDF
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-bold text-white transition-all hover:bg-white/20">
                <Share2 className="h-4 w-4" /> Share Report
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-indigo-600">
              <BrainCircuit className="h-5 w-5" />
              <h3 className="font-bold">Risk Factors</h3>
            </div>
            <ul className="space-y-2 text-xs">
              {report.risk_factors.map((factor, i) => (
                <li key={i} className="flex gap-2 text-slate-500">
                  <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
