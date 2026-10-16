import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HandHelping, 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Clock, 
  FileText, 
  UploadCloud, 
  Users, 
  AlertTriangle, 
  RotateCcw 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { UrgencyBadge, StatusPill, Card, Button } from '@/components/ui';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, volunteerProfile } = useAuth();
  const { 
    tasks, 
    acceptTask, 
    declineTask, 
    submitTaskVerification, 
    verifyTaskAndAwardPoints, 
    contributions 
  } = useData();

  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [evidenceSubmitted, setEvidenceSubmitted] = useState(false);
  const [pointsFeedback, setPointsFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Task Not Found</h2>
        <p className="text-xs text-slate-400">The task ID #{id} does not exist.</p>
        <Link to="/volunteer">
          <Button variant="outline" size="sm">Back to Volunteer Hub</Button>
        </Link>
      </div>
    );
  }

  const isAssignedToMe = currentUser && task.assignedVolunteerId === currentUser.id;
  const isCoordinator = currentUser?.roles.some(r => ['coordinator', 'reviewer', 'admin'].includes(r));
  const existingContribution = contributions.find(c => c.taskId === task.id);

  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceNotes.trim()) return;
    submitTaskVerification(task.id, evidenceNotes);
    setEvidenceSubmitted(true);
  };

  const handleCoordinatorSignoff = () => {
    if (!task.assignedVolunteerId) return;
    const result = verifyTaskAndAwardPoints(
      task.id,
      task.assignedVolunteerId,
      task.pointsAward,
      currentUser?.displayName || 'Coordinator Marcus Vance'
    );
    setPointsFeedback(result);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <Link to="/volunteer" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Volunteer Hub</span>
      </Link>

      {/* Main Task Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold">TASK #{task.id}</span>
              <StatusPill status={task.status} />
              <UrgencyBadge urgency={task.urgency} />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {task.title}
            </h1>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center">
            <span className="text-2xl font-black text-emerald-400 font-mono">+{task.pointsAward}</span>
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Verified Points</span>
          </div>
        </div>

        {/* Description & Requirements */}
        <div className="space-y-4 text-xs">
          <div>
            <h3 className="text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Task Description & Objectives
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              {task.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block">Required Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {task.requiredSkills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block">Safety & Authorization</span>
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="capitalize">{task.safetyLevel.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Untrained volunteers are strictly barred from high-risk flood water entry.
              </p>
            </div>
          </div>

          {/* Location & Coordinator */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200 font-medium">{task.location.description}</span>
            </div>
            <div className="text-slate-400">
              Responsible Coordinator: <strong className="text-slate-200">{task.coordinatorName}</strong>
            </div>
          </div>
        </div>

        {/* Existing Contribution Receipt if already awarded */}
        {existingContribution && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-200 space-y-1">
            <div className="font-bold flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Idempotent Contribution Receipt: Verified</span>
            </div>
            <p>
              Awarded: <strong>+{existingContribution.points} Points</strong> on {new Date(existingContribution.timestamp).toLocaleString()} by {existingContribution.verifiedBy}.
            </p>
            <span className="text-[10px] text-slate-400 font-mono">
              Audit Hash: {existingContribution.id}
            </span>
          </div>
        )}

        {/* Submission of Evidence form (for assigned volunteer) */}
        {isAssignedToMe && task.status === 'in_progress' && (
          <form onSubmit={handleSubmitEvidence} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Submit Task Completion Evidence for Verification</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 uppercase font-semibold">Evidence Notes & Summary *</label>
              <textarea
                required
                rows={3}
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                placeholder="Detail what was completed (e.g. translated 4 distress recordings into English, or unloaded 40 cases of water at Shelter Cafeteria)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Points will be awarded automatically once Coordinator verifies submission.
              </span>
              <Button type="submit" variant="accent" size="sm">
                Submit for Verification
              </Button>
            </div>
          </form>
        )}

        {/* Evidence Submitted Confirmation */}
        {(evidenceSubmitted || task.status === 'submitted_for_verification') && (
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Completion evidence submitted! Awaiting coordinator verification.</span>
          </div>
        )}

        {/* Coordinator Verification Desk (Role capability test) */}
        {isCoordinator && (task.status === 'submitted_for_verification' || task.status === 'in_progress') && (
          <div className="p-5 rounded-xl bg-slate-950 border-2 border-emerald-500/40 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Coordinator Approval Desk (Evaluation Controls)</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Assigned: {task.assignedVolunteerId}</span>
            </div>

            <p className="text-slate-300">
              Verify this volunteer task to grant <strong>+{task.pointsAward} points</strong>. Tests the idempotent backend calculation engine.
            </p>

            {pointsFeedback && (
              <div className={`p-3 rounded-lg text-xs font-semibold ${pointsFeedback.success ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' : 'bg-red-950 text-red-300 border border-red-500'}`}>
                {pointsFeedback.message}
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleCoordinatorSignoff}
                disabled={Boolean(existingContribution)}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Approve & Award Points Idempotently
              </Button>

              {/* Duplicate award test button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCoordinatorSignoff}
                title="Test idempotency defense"
              >
                Test Duplicate Award Rejection
              </Button>
            </div>
          </div>
        )}

        {/* Task Acceptance & Decline Actions */}
        {task.status === 'available' && currentUser && (
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={() => acceptTask(task.id, currentUser.id, currentUser.displayName)}
            >
              Accept Volunteer Assignment
            </Button>
          </div>
        )}

      </Card>

    </div>
  );
};
