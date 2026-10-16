import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  HandHelping, 
  Building2, 
  ShieldCheck, 
  BrainCircuit, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Sparkles,
  HelpCircle,
  TrendingUp,
  Award,
  ShieldAlert
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Button, Card } from '@/components/ui';

export const LandingPage: React.FC = () => {
  const { incidents, tasks, contributions, pledges } = useData();

  const totalDelivered = pledges
    .filter(p => p.status === 'delivered' || p.status === 'verified')
    .reduce((acc, p) => acc + (p.financialAmountUsd || 15000), 0);

  const totalPeopleImpacted = incidents.reduce((acc, i) => acc + i.affectedPeople, 0);

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Background glow & ripple effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI-Powered Humanitarian Coordination</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/30">
              <img src="/logo.jpg" alt="AfterMath Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Calm inside the chaos.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500">
                Uncertainty-Aware
              </span> Disaster Intelligence.
            </h1>
          </div>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            AfterMath transforms chaotic, multilingual survivor distress calls into structured, deduplicated, human-verified incidents — matching community volunteers and corporate relief resources where they are needed most.
          </p>

          {/* Core CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/report">
              <Button variant="danger" size="lg" className="gap-2 shadow-red-950/50">
                <AlertTriangle className="w-5 h-5" />
                <span>Request Assistance Now</span>
              </Button>
            </Link>

            <Link to="/volunteer">
              <Button variant="accent" size="lg" className="gap-2">
                <HandHelping className="w-5 h-5" />
                <span>Volunteer for Tasks</span>
              </Button>
            </Link>

            <Link to="/incidents">
              <Button variant="outline" size="lg" className="gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>View Live Incident Map</span>
              </Button>
            </Link>
          </div>

          {/* Official emergency reminder */}
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Emergency prioritization is calculated purely on humanitarian vulnerability. AfterMath never replaces official 911 / 112 emergency services.
          </p>
        </div>

        {/* Live Metrics Ticker */}
        <div className="max-w-5xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{incidents.length}</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Verified Incidents</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{totalPeopleImpacted}</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Evacuees Supported</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono">{tasks.length}</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Active Volunteer Tasks</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-green-400 font-mono">${(totalDelivered / 1000).toFixed(0)}k+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Verified Aid Pledged</div>
          </div>
        </div>

      </section>

      {/* The Core Differentiator: Uncertainty-Aware AI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>The AfterMath Difference</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            An AI Agent that knows what it <em>doesn't</em> know.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            In disaster response, hallucinated coordinates and false confidence cost human lives. AfterMath's Gemini-driven engine is designed with strict uncertainty awareness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="space-y-4 border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">Reported Facts vs Inferences</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Every triage output rigorously isolates survivor-provided statements from AI-generated deductions. Missing details like water velocity or roof access are flagged as unknowns.
            </p>
          </Card>

          <Card className="space-y-4 border-slate-800 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">Decoupled Urgency & Confidence</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              If a survivor report is vague but indicates drowning risk, urgency stays <strong>CRITICAL</strong> even if confidence is low. Ambiguous emergencies never disappear into a backlog.
            </p>
          </Card>

          <Card className="space-y-4 border-slate-800 hover:border-blue-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">Zero Fabricated Coordinates</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              When street addresses are ungrounded, AfterMath diverts them into a dedicated <strong>Unlocated Queue</strong> with uncertainty radius buffers rather than inventing coordinates on a map.
            </p>
          </Card>

        </div>
      </section>

      {/* Humanitarian Pipeline Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">End-to-End Coordination Workflow</h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              From first survivor dispatch to verified corporate ESG impact reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">STAGE 01</div>
              <h4 className="font-bold text-slate-200 text-sm">Multilingual Intake</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Survivors submit distress requests in English, Spanish, Vietnamese, or Hindi. Original text is preserved alongside real-time translation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">STAGE 02</div>
              <h4 className="font-bold text-slate-200 text-sm">Human Triage & Merges</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Authorized triage reviewers evaluate AI duplicate suggestions, resolve contradictions, and consolidate incident clusters with full audit trails.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">STAGE 03</div>
              <h4 className="font-bold text-slate-200 text-sm">Volunteer Matching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tasks (translation, supply handling, shelter support) match volunteers by verified language, skills, and safety clearances with single-account capability.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">STAGE 04</div>
              <h4 className="font-bold text-slate-200 text-sm">Idempotent Impact Points</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Volunteers submit completion evidence; points & skill badges are granted idempotently by coordinators. Zero double-claims or commercial bias.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Corporate Partnerships Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase">
              <Building2 className="w-3.5 h-3.5" />
              <span>Corporate Social Responsibility</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Transparent Resource Pledging for Enterprise Relief Sponsors.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Connect corporate freight fleets, bulk potable water, satellite mesh kits, and employee volunteer groups directly to verified incident needs.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Track status from Pledged → Approved → Dispatched → Delivered → Verified.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Strict organization data isolation prevents access to private victim PII.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Export audit-ready CSV & PDF CSR compliance reports.</span>
              </li>
            </ul>

            <div>
              <Link to="/partners">
                <Button variant="outline" size="md" className="gap-2">
                  <span>Explore Corporate Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <Card className="border-teal-500/30 bg-teal-950/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-semibold text-slate-200 text-sm">Active Enterprise Pledges</div>
              <span className="text-xs text-emerald-400 font-mono">Real-Time Logistics</span>
            </div>

            <div className="space-y-3">
              {pledges.map(p => (
                <div key={p.id} className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{p.organizationName}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      {p.status}
                    </span>
                  </div>
                  <div className="text-slate-300 font-medium">{p.title}</div>
                  <div className="text-slate-500 text-[11px]">{p.quantity}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 shadow-2xl space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Ready to test the demo workflow?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Switch between survivor, triage reviewer, coordinator, and corporate partner personas using the top navbar selector to experience the complete human-in-the-loop lifecycle.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/report">
              <Button variant="primary" size="lg" className="gap-2">
                <AlertTriangle className="w-4 h-4" />
                Submit Sample Help Report
              </Button>
            </Link>
            <Link to="/review">
              <Button variant="secondary" size="lg" className="gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Open Triage Reviewer Queue
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
