import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  Filter, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  MapPin, 
  HelpCircle,
  Clock,
  Sparkles,
  GitMerge,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { UrgencyBadge, StatusPill, Card, Button } from '@/components/ui';

export const ReviewQueuePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports, incidents, verifyIncident, rejectReport } = useData();

  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterStatus, setFilterStatus] = useState('needs_review');
  const [search, setSearch] = useState('');

  // Check reviewer permission
  const isAuthorized = currentUser?.roles.some(r => ['reviewer', 'coordinator', 'admin'].includes(r));

  // Filtered queue items
  const queueReports = reports.filter(r => {
    if (filterStatus === 'needs_review' && r.status !== 'needs_review' && r.status !== 'received') return false;
    if (filterStatus === 'verified' && r.status !== 'verified') return false;
    if (filterStatus === 'merged' && r.status !== 'merged') return false;
    if (filterStatus === 'rejected' && r.status !== 'rejected') return false;
    if (filterUrgency !== 'all' && r.aiTriage?.urgency !== filterUrgency) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.originalMessage.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Prioritize Critical items first (never let high-risk ambiguous reports get buried!)
  const sortedReports = [...queueReports].sort((a, b) => {
    const urgencyWeight: Record<string, number> = { critical: 4, high: 3, moderate: 2, low: 1, unknown: 0 };
    const weightA = urgencyWeight[a.aiTriage?.urgency || 'unknown'] || 0;
    const weightB = urgencyWeight[b.aiTriage?.urgency || 'unknown'] || 0;
    return weightB - weightA;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ClipboardCheck className="w-7 h-7 text-emerald-400" />
              <span>Reviewer & Triage Console</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
              Module C
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Human-in-the-loop audit desk. Verify AI extractions, resolve contradictions, merge duplicates, and escalate rescues.
          </p>
        </div>

        {/* Security Role Warning if user is not a reviewer */}
        {!isAuthorized && (
          <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-600/50 text-amber-300 text-xs">
            <strong>Observer Mode:</strong> Switch to Elena Rostova (Triage Reviewer) via the top navbar to execute verified actions.
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('needs_review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'needs_review' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Pending Review ({reports.filter(r => r.status === 'needs_review').length})
          </button>
          <button
            onClick={() => setFilterStatus('verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'verified' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Verified ({reports.filter(r => r.status === 'verified').length})
          </button>
          <button
            onClick={() => setFilterStatus('merged')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'merged' 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Merged ({reports.filter(r => r.status === 'merged').length})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'all' 
                ? 'bg-slate-700 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Reports ({reports.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Urgencies</option>
            <option value="critical">Critical First</option>
            <option value="high">High Urgency</option>
            <option value="moderate">Moderate</option>
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report queue..."
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-3 py-1 text-xs w-48 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Prioritized Review Queue List */}
      <div className="space-y-4">
        {sortedReports.length === 0 ? (
          <div className="text-center py-16 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Review Queue Clear</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No outstanding items match this filter. New survivor distress dispatches will automatically populate here.
            </p>
          </div>
        ) : (
          sortedReports.map(report => (
            <Card 
              key={report.id} 
              className={`p-5 space-y-4 border transition-all ${
                report.aiTriage?.urgency === 'critical' 
                  ? 'border-red-500/40 bg-red-950/10 hover:border-red-400' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">ID #{report.id}</span>
                  <UrgencyBadge urgency={report.aiTriage?.urgency || 'unknown'} />
                  <StatusPill status={report.status} />
                  {report.location.isUnknown && (
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/40 text-[10px] font-bold">
                      UNLOCATED (NO GPS)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>Language: {report.originalLanguage.toUpperCase()}</span>
                  <span>{new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Title & Original message vs Translation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-semibold block">Survivor Original Statement:</span>
                  <p className="text-slate-200 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-normal leading-relaxed italic">
                    "{report.originalMessage}"
                  </p>
                  <div className="text-[11px] text-slate-400">
                    Reporter: <strong>{report.reporterName}</strong> ({report.reporterContact || 'Web Submission'})
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Triage Summary & Grounded Reasoning:
                  </span>
                  <div className="p-3 rounded-lg bg-emerald-950/15 border border-emerald-500/20 space-y-1 text-slate-200 leading-relaxed">
                    <p className="font-medium text-slate-100">{report.aiTriage?.summary}</p>
                    <p className="text-[11px] text-slate-400 pt-1 border-t border-emerald-950">
                      Reasoning: {report.aiTriage?.urgencyExplanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Facts vs Inferences vs Contradictions pills */}
              {report.aiTriage && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-emerald-400 block mb-0.5">Facts Extracted:</strong>
                    <ul className="text-slate-300 space-y-0.5">
                      {report.aiTriage.facts.slice(0, 2).map((f, i) => <li key={i}>• {f}</li>)}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-amber-400 block mb-0.5">Missing Info / Unknowns:</strong>
                    <ul className="text-slate-300 space-y-0.5">
                      {report.aiTriage.missingInfo.slice(0, 2).map((m, i) => <li key={i}>• {m}</li>)}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-purple-400 block mb-0.5">Review Recommendations:</strong>
                    <ul className="text-slate-300 space-y-0.5">
                      {report.aiTriage.reviewReasons.slice(0, 2).map((r, i) => <li key={i}>• {r}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {/* Potential Duplicate indicator */}
              {report.aiTriage?.suggestedDuplicateReportIds && report.aiTriage.suggestedDuplicateReportIds.length > 0 && (
                <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/40 text-xs text-indigo-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitMerge className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>
                      Potential Duplicate Cluster Detected: Corroborates Report 
                      <strong className="ml-1 text-white">{report.aiTriage.suggestedDuplicateReportIds.join(', ')}</strong>
                    </span>
                  </div>
                  <Link 
                    to={`/review/incidents/${report.id}`}
                    className="text-indigo-400 hover:text-white font-semibold underline text-[11px]"
                  >
                    Compare & Merge
                  </Link>
                </div>
              )}

              {/* Reviewer Action Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{report.location.description}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/review/incidents/${report.id}`}>
                    <Button variant="primary" size="sm" className="gap-1.5">
                      <span>Open Review Workbench</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

    </div>
  );
};
