import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Safety */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="AfterMath Logo" className="w-6 h-6 rounded border border-emerald-500/40 object-cover" />
              <span className="font-bold text-slate-200 text-sm">AfterMath Humanitarian Platform</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              AfterMath is an uncertainty-aware disaster coordination system. It transforms multilingual emergency dispatches into human-verified incidents, connecting survivors with certified volunteers and corporate logistics partners.
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <strong className="text-red-400 block mb-0.5">Official Emergency Notice:</strong>
              This platform coordinates community assistance and does not replace official 911/112 municipal emergency services. In direct life-safety events, contact authorities first.
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Community Hub</h4>
            <ul className="space-y-2">
              <li><Link to="/report" className="hover:text-emerald-400 transition-colors">Submit Distress Request</Link></li>
              <li><Link to="/incidents" className="hover:text-emerald-400 transition-colors">Live Incident Map</Link></li>
              <li><Link to="/volunteer" className="hover:text-emerald-400 transition-colors">Volunteer Task Board</Link></li>
              <li><Link to="/impact" className="hover:text-emerald-400 transition-colors">Verified Contributions</Link></li>
            </ul>
          </div>

          {/* Enterprise & Tech */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Enterprise & Architecture</h4>
            <ul className="space-y-2">
              <li><Link to="/partners" className="hover:text-emerald-400 transition-colors">Corporate Pledges & CSR</Link></li>
              <li><Link to="/review" className="hover:text-emerald-400 transition-colors">Reviewer Console</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-400 transition-colors">System Admin</Link></li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Powered by Google Gemini 1.5/2.5 & Firebase</span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 AfterMath Disaster Response. Built for the AI Builder Cup Hackathon.</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Humanitarian AI with uncertainty transparency</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 mx-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
