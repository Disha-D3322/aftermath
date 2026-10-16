import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  DollarSign, 
  Users, 
  PackageCheck, 
  ArrowRight, 
  ExternalLink,
  Lock,
  Sparkles,
  FileText
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, Button, StatusPill } from '@/components/ui';

export const CorporatePortalPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { organizations, pledges } = useData();

  const isCorpMember = currentUser?.roles.includes('corporate_partner');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-7 h-7 text-emerald-400" />
              <span>Corporate Partnerships & CSR Impact</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
              Module G
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified enterprise relief pledging: Cold chain logistics, potable water, satellite comms, and employee volunteer brigades.
          </p>
        </div>

        <Link to="/partners/dashboard">
          <Button variant="accent" size="md" className="gap-2">
            <span>Open Partner Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* CSR Compliance & Data Isolation Notice */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Lock className="w-4 h-4" />
          <span>Strict Enterprise Privacy & Humanitarian Integrity Policy</span>
        </div>
        <p className="leading-relaxed">
          <strong>1. Strict Org-Scoped Isolation:</strong> Member access is strictly scoped. Companies cannot view unrelated organizations' proprietary records or private victim contact info.
        </p>
        <p className="leading-relaxed">
          <strong>2. Zero Commercial Influence on Triage:</strong> Rescue triage is determined entirely by life-safety vulnerability. Sponsorship funding or corporate tier never influences emergency priority.
        </p>
      </div>

      {/* Directory of Verified Corporate Partners */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Verified Humanitarian Enterprise Partners ({organizations.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organizations.map(org => {
            const orgPledges = pledges.filter(p => p.organizationId === org.id);
            return (
              <Card key={org.id} className="p-6 space-y-4 border-slate-800 bg-slate-900/80">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">{org.name}</h3>
                      <span className="text-xs text-slate-400 font-medium">{org.industry}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                    Verified Partner
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {org.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-800">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span className="font-bold text-white block font-mono">${(org.totalPledgedUsd / 1000).toFixed(0)}k</span>
                    <span className="text-[10px] text-slate-500 uppercase">Pledged</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span className="font-bold text-emerald-400 block font-mono">{org.totalDeliveredResourcesCount}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Units Delivered</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span className="font-bold text-teal-400 block font-mono">{org.employeeVolunteersActive}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Volunteers</span>
                  </div>
                </div>

                {/* Associated Pledges */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Relief Commitments:</span>
                  {orgPledges.map(p => (
                    <div key={p.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-slate-200">{p.title}</span>
                        <div className="text-[10px] text-slate-500">{p.quantity}</div>
                      </div>
                      <StatusPill status={p.status} />
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
};
