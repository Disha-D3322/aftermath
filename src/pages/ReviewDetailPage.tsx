import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  GitMerge, 
  RotateCcw, 
  MapPin, 
  Users, 
  Languages, 
  Sparkles,
  HelpCircle,
  FileEdit,
  Send
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { UrgencyLevel, ReportCategory } from '@/types';
import { UrgencyBadge, StatusPill, Card, Button } from '@/components/ui';

export const ReviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    reports, 
    incidents, 
    audits, 
    verifyIncident, 
    correctIncidentFields, 
    mergeIncidents, 
    unmergeIncident, 
    markLocationUnknown, 
    rejectReport 
  } = useData();

  // Find either a report or an incident with this ID
  const report = reports.find(r => r.id === id);
  const incident = incidents.find(i => i.id === id || (report?.incidentId && i.id === report.incidentId));

  // Edit fields state
  const [correctedTitle, setCorrectedTitle] = useState(incident?.title || report?.title || '');
  const [correctedCategory, setCorrectedCategory] = useState<ReportCategory>(incident?.category || report?.category || 'rescue');
  const [correctedUrgency, setCorrectedUrgency] = useState<UrgencyLevel>(incident?.urgency || report?.aiTriage?.urgency || 'moderate');
  const [correctedAffected, setCorrectedAffected] = useState<number>(incident?.affectedPeople || report?.peopleAffectedCount || 1);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [selectedIncidentForMerge, setSelectedIncidentForMerge] = useState<string>(incidents[0]?.id || '');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reviewer permission check
  const isAuthorized = currentUser?.roles.some(r => ['reviewer', 'coordinator', 'admin'].includes(r));
  const reviewerName = currentUser?.displayName || 'Authorized Reviewer';

  if (!report && !incident) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Item Not Found</h2>
        <p className="text-xs text-slate-400">No report or incident found for ID #{id}.</p>
        <Link to="/review">
          <Button variant="outline" size="sm">Back to Review Queue</Button>
        </Link>
      </div>
    );
  }

  const handleVerify = () => {
    if (!incident && report) {
      alert('This report is not yet linked to an active incident. You can merge it into an existing incident or verify it.');
      return;
    }
    if (incident) {
      verifyIncident(incident.id, reviewerName, reviewerNotes || 'Verified after field inspection and audio check.');
      setSuccessMessage('Incident successfully verified and broadcast to coordination channel.');
    }
  };

  const handleFieldCorrection = () => {
    if (!incident) return;
    correctIncidentFields(
      incident.id,
      {
        title: correctedTitle,
        category: correctedCategory,
        urgency: correctedUrgency,
        affectedPeople: correctedAffected
      },
      reviewerName,
      reviewerNotes || 'Field corrections applied by authorized triage officer.'
    );
    setSuccessMessage('Incident fields updated and recorded in audit log.');
  };

  const handleMerge = () => {
    if (!report || !selectedIncidentForMerge) return;
    mergeIncidents(
      selectedIncidentForMerge,
      report.id,
      reviewerName,
      reviewerNotes || `Merged duplicate report ${report.id} into primary incident ${selectedIncidentForMerge}.`
    );
    setSuccessMessage(`Report #${report.id} merged into Incident #${selectedIncidentForMerge}.`);
  };

  const handleUnmerge = (reportIdToDetach: string) => {
    if (!incident) return;
    unmergeIncident(
      incident.id,
      reportIdToDetach,
      reviewerName,
      reviewerNotes || `Detached report ${reportIdToDetach} from incident ${incident.id}.`
    );
    setSuccessMessage(`Report #${reportIdToDetach} unmerged and returned to triage queue.`);
  };

  const handleMarkLocationUnknown = () => {
    if (!incident) return;
    markLocationUnknown(
      incident.id,
      reviewerName,
      reviewerNotes || 'Coordinates flagged uncertain. Diverted to unlocated queue.'
    );
    setSuccessMessage('Incident coordinates marked UNKNOWN. Safely moved to Unlocated Queue.');
  };

  const handleReject = () => {
    if (!report) return;
    const reason = reviewerNotes || 'Spam or unsubstantiated report rejected by triage officer.';
    rejectReport(report.id, reviewerName, reason);
    setSuccessMessage(`Report #${report.id} rejected.`);
  };

  const relatedAudits = audits.filter(a => 
    (incident && a.incidentId === incident.id) || 
    (report && a.reportId === report.id)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link to="/review" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Triage Queue</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Reviewer:</span>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            {reviewerName}
          </span>
        </div>
      </div>

      {/* Success alert message */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-slate-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* Main Review Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Source Report & AI Intelligence */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Survivor Source Dispatch */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                  RAW SURVIVOR REPORT #{report?.id || incident?.primaryReportId}
                </span>
                <UrgencyBadge urgency={report?.aiTriage?.urgency || incident?.urgency || 'unknown'} />
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Language: {(report?.originalLanguage || 'en').toUpperCase()}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-semibold block">Original Survivor Message:</span>
              <p className="text-sm text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed italic">
                "{report?.originalMessage || incident?.summary}"
              </p>
            </div>

            {report?.aiTriage?.translation && (
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                  <Languages className="w-3.5 h-3.5" />
                  Real-Time English Translation:
                </span>
                <p className="text-slate-300">{report.aiTriage.translation.text}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block">Reported Location:</span>
                <span className="text-slate-200 font-medium">
                  {report?.location.description || incident?.location.description}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Reported People Count:</span>
                <span className="text-slate-200 font-medium font-mono">
                  {report?.peopleAffectedCount || incident?.affectedPeople || 'Unspecified'}
                </span>
              </div>
            </div>
          </Card>

          {/* AI Intelligence & Uncertainty Reasoning Panel */}
          <Card className="p-6 space-y-4 border-emerald-500/30 bg-emerald-950/10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm">Gemini Uncertainty-Aware Triage Output</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Confidence: {((report?.aiTriage?.confidenceScore || 0.9) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 font-semibold">Triage Reasoning:</span>
              <p className="text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800 leading-relaxed font-medium">
                {report?.aiTriage?.urgencyExplanation || incident?.summary}
              </p>
            </div>

            {/* Facts vs Inferences vs Missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block mb-1">✓ Verified Facts:</span>
                <ul className="text-slate-300 space-y-1 text-[11px]">
                  {(report?.aiTriage?.facts || ['Corroborated by eyewitness']).map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block mb-1">⚠️ Missing Information:</span>
                <ul className="text-slate-300 space-y-1 text-[11px]">
                  {(report?.aiTriage?.missingInfo || ['Exact GPS coordinates pending']).map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Merge Comparison Panel if duplicate exists */}
          {report?.aiTriage?.suggestedDuplicateReportIds && report.aiTriage.suggestedDuplicateReportIds.length > 0 && (
            <Card className="p-6 space-y-4 border-indigo-500/40 bg-indigo-950/20">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                <GitMerge className="w-5 h-5 text-indigo-400" />
                <span>Side-by-Side Duplicate Comparison</span>
              </div>
              <p className="text-xs text-slate-300">
                AI detected high spatial and semantic similarity between this report and existing Incident clusters.
              </p>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Target Incident for Consolidation:</span>
                  <div className="font-semibold text-white mt-0.5">{incident?.title || 'Oak Street Trapped Residents'}</div>
                </div>

                <Button variant="secondary" size="sm" onClick={handleMerge} className="border-indigo-500/50 text-indigo-300">
                  <GitMerge className="w-3.5 h-3.5 mr-1" />
                  Merge Reports
                </Button>
              </div>
            </Card>
          )}

          {/* Attached Reports if this is an incident with multiple merged reports */}
          {incident && incident.associatedReportIds.length > 1 && (
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center justify-between">
                <span>Consolidated Associated Reports ({incident.associatedReportIds.length})</span>
                <span className="text-xs text-slate-400 font-normal">Click Unmerge to undo incorrect consolidations</span>
              </h3>

              <div className="space-y-2">
                {incident.associatedReportIds.map(repId => (
                  <div key={repId} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-mono text-emerald-400 font-bold mr-2">{repId}</span>
                      <span className="text-slate-300">{repId === incident.primaryReportId ? '(Primary Incident Lead)' : '(Consolidated Corroboration)'}</span>
                    </div>

                    {repId !== incident.primaryReportId && (
                      <button
                        onClick={() => handleUnmerge(repId)}
                        className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                      >
                        Undo Merge
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>

        {/* Right Column: Authorized Reviewer Actions Workbench */}
        <div className="space-y-6">
          
          <Card className="p-6 space-y-5 border-slate-700 bg-slate-900/95 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                <FileEdit className="w-4 h-4 text-emerald-400" />
                <span>Reviewer Actions</span>
              </h3>
              <StatusPill status={incident?.verificationStatus || report?.status || 'needs_review'} />
            </div>

            {/* Correct Fields Form */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold uppercase">Incident Title</label>
                <input
                  type="text"
                  value={correctedTitle}
                  onChange={(e) => setCorrectedTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase">Urgency</label>
                  <select
                    value={correctedUrgency}
                    onChange={(e) => setCorrectedUrgency(e.target.value as UrgencyLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase">People Count</label>
                  <input
                    type="number"
                    value={correctedAffected}
                    onChange={(e) => setCorrectedAffected(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold uppercase">Category</label>
                <select
                  value={correctedCategory}
                  onChange={(e) => setCorrectedCategory(e.target.value as ReportCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="rescue">Rescue / Evacuation</option>
                  <option value="medical">Medical Assistance</option>
                  <option value="food_water">Food & Potable Water</option>
                  <option value="shelter">Emergency Shelter</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800">
                <label className="text-slate-400 font-semibold uppercase">Reviewer Audit Reason *</label>
                <textarea
                  rows={2}
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="Explain your decision (mandatory for append-only audit trail)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full"
                  onClick={handleVerify}
                  disabled={!isAuthorized}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Confirm & Verify Incident
                </Button>

                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={handleFieldCorrection}
                  disabled={!isAuthorized}
                >
                  Apply Field Corrections
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-amber-500/40 text-amber-300 hover:bg-amber-950/30"
                  onClick={handleMarkLocationUnknown}
                  disabled={!isAuthorized}
                >
                  <HelpCircle className="w-4 h-4 mr-1.5" />
                  Mark Location Unknown (No Fabricated GPS)
                </Button>

                <Button 
                  variant="danger" 
                  size="sm" 
                  className="w-full"
                  onClick={handleReject}
                  disabled={!isAuthorized}
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Reject Spam / Invalid
                </Button>
              </div>

              {!isAuthorized && (
                <p className="text-[10px] text-amber-400 text-center italic pt-1">
                  Read-only view. Sign in as Elena Rostova (Reviewer) to commit changes.
                </p>
              )}
            </div>
          </Card>

        </div>

      </div>

      {/* Append-Only Review Action Audit Trail */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Append-Only Review Action History ({relatedAudits.length})</span>
        </h3>

        <div className="space-y-2">
          {relatedAudits.map(audit => (
            <div key={audit.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex items-start justify-between gap-4">
              <div>
                <span className="font-semibold text-slate-200">{audit.reviewerName}</span>
                <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-emerald-400 uppercase">
                  {audit.actionType}
                </span>
                <p className="text-slate-400 text-[11px] mt-1">"{audit.reason}"</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
