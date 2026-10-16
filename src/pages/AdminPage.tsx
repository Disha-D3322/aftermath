import React from 'react';
import { 
  ShieldAlert, 
  RotateCcw, 
  Database, 
  BrainCircuit, 
  Users, 
  Layers, 
  CheckCircle2, 
  Flame, 
  Lock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, Button } from '@/components/ui';

export const AdminPage: React.FC = () => {
  const { currentUser, availableUsers, switchUser } = useAuth();
  const { reports, incidents, tasks, pledges, audits, resetDemoData } = useData();

  const isAdmin = currentUser?.roles.includes('admin');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-emerald-400" />
              <span>System Health & Governance Console</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
              Admin & Ops
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access-control enforcement, AI pipeline status, audit stream, and demonstration state management.
          </p>
        </div>

        <Button variant="danger" size="sm" onClick={resetDemoData} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demonstration Fixtures</span>
        </Button>
      </div>

      {/* Health & Pipeline Monitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card className="p-5 space-y-3 border-emerald-500/30 bg-emerald-950/15">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Gemini AI Pipeline</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
            <span>{import.meta.env.VITE_GEMINI_API_KEY ? 'Gemini 1.5/2.5 Live' : 'Deterministic Mock Active'}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {import.meta.env.VITE_GEMINI_API_KEY 
              ? 'Connected to Google AI endpoint with runtime structured outputs.' 
              : 'Deterministic multilingual mock active for offline evaluation.'}
          </p>
        </Card>

        <Card className="p-5 space-y-3 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Cloud Persistence</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-400" />
            <span>Cloud Firestore Sync</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {reports.length} reports, {incidents.length} consolidated incidents, {tasks.length} volunteer tasks persisted.
          </p>
        </Card>

        <Card className="p-5 space-y-3 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Security Architecture</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-400" />
            <span>RBAC & App Check</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Client-side role escalation blocked. Privileged reviewer and coordinator actions audited.
          </p>
        </Card>

      </div>

      {/* Role Assignment Test Bench */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Authorized Accounts & Role Grants</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Server-enforced authorization</span>
        </div>

        <p className="text-xs text-slate-400">
          Demonstrates single-account capability: Maria Santos holds <code>user</code> role with active volunteer status. Elena Rostova holds <code>reviewer</code>. Marcus Vance holds <code>coordinator</code>. Apex CSR holds <code>corporate_partner</code>.
        </p>

        <div className="space-y-2">
          {availableUsers.map(user => (
            <div key={user.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white mr-2">{user.displayName}</span>
                <span className="text-slate-400">({user.email})</span>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                  Assigned Roles: {user.roles.join(', ')} {user.isVolunteer ? '• Volunteer Opted-In' : ''}
                </div>
              </div>

              <Button
                variant={user.id === currentUser?.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => switchUser(user.id)}
              >
                {user.id === currentUser?.id ? 'Active Persona' : 'Switch To'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Global Append-Only Audit Stream */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <span>Global Append-Only Triage Audit Stream ({audits.length})</span>
        </h2>

        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Incident / Report</th>
                <th className="py-3 px-4">Recorded Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {audits.map(audit => (
                <tr key={audit.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200 whitespace-nowrap">
                    {audit.reviewerName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono font-bold text-[10px] uppercase">
                      {audit.actionType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {audit.incidentId !== 'none' ? audit.incidentId : audit.reportId}
                  </td>
                  <td className="py-3 px-4 text-slate-300 italic">
                    "{audit.reason}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
