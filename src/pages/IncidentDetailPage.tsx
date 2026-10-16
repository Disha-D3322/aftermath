import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Calendar, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Languages, 
  Layers, 
  Building2, 
  HandHelping,
  FileText
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { UrgencyBadge, StatusPill, Card, Button } from '@/components/ui';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { incidents, reports, tasks, pledges, audits } = useData();

  const incident = incidents.find(i => i.id === id);

  if (!incident) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Incident Not Found</h2>
        <p className="text-xs text-slate-400">The incident reference #{id} does not exist.</p>
        <Link to="/incidents">
          <Button variant="outline" size="sm">Back to Incidents</Button>
        </Link>
      </div>
    );
  }

  // Associated reports
  const associatedReports = reports.filter(r => incident.associatedReportIds.includes(r.id));
  
  // Associated tasks & pledges
  const incidentTasks = tasks.filter(t => t.incidentId === incident.id);
  const incidentPledges = pledges.filter(p => p.targetIncidentId === incident.id);
  const incidentAudits = audits.filter(a => a.incidentId === incident.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top back button & breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link to="/incidents" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Grounded Incident Map</span>
        </Link>
        <Link to={`/review/incidents/${incident.id}`}>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Open in Review Console</span>
          </Button>
        </Link>
      </div>

      {/* Main Header Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold">INCIDENT #{incident.id}</span>
              <UrgencyBadge urgency={incident.urgency} />
              <StatusPill status={incident.verificationStatus} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {incident.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-xl font-bold text-white block">{incident.affectedPeople}</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Affected People</span>
            </div>
          </div>
        </div>

        {/* Summary & Outstanding Needs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Consolidated Incident Summary
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {incident.summary}
              </p>
            </div>

            {/* Outstanding Needs */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Outstanding Humanitarian Needs
              </h3>
              <div className="flex flex-wrap gap-2">
                {incident.outstandingNeeds.map((need, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-medium">
                    • {need}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Location Grounding */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <h3 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Grounded Location
            </h3>
            
            <div className="text-slate-200 font-medium">{incident.location.description}</div>
            {incident.location.address && (
              <div className="text-slate-400 text-[11px]">{incident.location.address}</div>
            )}
            
            {incident.location.coordinates ? (
              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400">
                GPS: {incident.location.coordinates.lat.toFixed(4)}, {incident.location.coordinates.lng.toFixed(4)}
                <div className="text-slate-500 text-[10px] mt-0.5">
                  Uncertainty Radius: ±{incident.location.uncertaintyRadiusMeters || 50} meters
                </div>
              </div>
            ) : (
              <div className="text-amber-400 text-[11px]">Held in Unlocated Queue (No GPS)</div>
            )}

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              Verified by: <strong>{incident.verifiedBy || 'Pending Triage'}</strong>
            </div>
          </div>
        </div>
      </Card>

      {/* Associated Source Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Associated Source Reports ({associatedReports.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Preserved original survivor statements</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {associatedReports.map(report => (
            <Card key={report.id} className="p-5 space-y-3 border-slate-800 bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">{report.id}</span>
                <span className="text-slate-500">{new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <h4 className="font-semibold text-slate-100 text-sm">{report.title}</h4>

              {/* Multilingual original text */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 italic">
                "{report.originalMessage}"
              </div>

              {report.translation && (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
                  <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                    <Languages className="w-3 h-3" />
                    Translated from {report.originalLanguage.toUpperCase()}:
                  </span>
                  <p className="text-slate-200">{report.translation.text}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span>Reporter: {report.reporterName}</span>
                <span>{report.peopleAffectedCount ? `${report.peopleAffectedCount} people` : 'Count unknown'}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Volunteer Tasks & Corporate Aid Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Volunteer Tasks Board */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HandHelping className="w-5 h-5 text-teal-400" />
            <span>Active Volunteer Tasks ({incidentTasks.length})</span>
          </h2>

          <div className="space-y-3">
            {incidentTasks.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 rounded-xl border border-slate-800 bg-slate-950">
                No volunteer tasks currently active for this incident.
              </p>
            ) : (
              incidentTasks.map(task => (
                <Card key={task.id} className="p-4 space-y-2 border-slate-800 bg-slate-900/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{task.title}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[11px] font-bold">
                      +{task.pointsAward} Pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{task.description}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Required: {task.requiredSkills.join(', ')}</span>
                    <Link to={`/volunteer/tasks/${task.id}`} className="text-emerald-400 hover:underline">
                      View Task →
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Corporate Pledges & Drops */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span>Corporate Relief Deliveries ({incidentPledges.length})</span>
          </h2>

          <div className="space-y-3">
            {incidentPledges.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 rounded-xl border border-slate-800 bg-slate-950">
                No corporate pledges directly assigned to this incident yet.
              </p>
            ) : (
              incidentPledges.map(pledge => (
                <Card key={pledge.id} className="p-4 space-y-2 border-slate-800 bg-slate-900/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{pledge.organizationName}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase">
                      {pledge.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{pledge.title}</div>
                  <p className="text-[11px] text-slate-400">{pledge.quantity}</p>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Review & Consolidation Audit Trail */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Human-in-the-Loop Audit Trail ({incidentAudits.length})</span>
        </h3>

        <div className="space-y-2">
          {incidentAudits.map(audit => (
            <div key={audit.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex items-start justify-between gap-4">
              <div>
                <span className="font-semibold text-slate-200">{audit.reviewerName}</span>
                <span className="text-slate-500 ml-2">performed action:</span>
                <span className="ml-1 px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-emerald-300 uppercase">
                  {audit.actionType}
                </span>
                <p className="text-slate-400 text-[11px] mt-1 italic">"{audit.reason}"</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                {new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
