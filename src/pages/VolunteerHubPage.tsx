import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HandHelping, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Languages, 
  ShieldCheck, 
  ChevronRight, 
  Filter, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  ToggleLeft, 
  ToggleRight, 
  Plus, 
  X 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { VolunteerTask, TaskSafetyLevel } from '@/types';
import { UrgencyBadge, StatusPill, Card, Button } from '@/components/ui';

export const VolunteerHubPage: React.FC = () => {
  const { 
    currentUser, 
    volunteerProfile, 
    toggleVolunteerStatus, 
    updateVolunteerSkills, 
    updateVolunteerAvailability 
  } = useAuth();
  
  const { tasks, acceptTask, declineTask } = useData();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSafety, setSelectedSafety] = useState('all');
  const [newSkill, setNewSkill] = useState('');

  const isOptedIn = Boolean(currentUser?.isVolunteer);
  const isAvailable = volunteerProfile?.isAvailable ?? false;
  const userSkills = volunteerProfile?.skills || [];
  const userLanguages = volunteerProfile?.languages || ['English'];

  // Match tasks based on skills and languages
  const computeMatchScore = (task: VolunteerTask) => {
    let score = 0;
    const reasons: string[] = [];

    // Check language match
    const hasLanguage = task.requiredLanguages.some(lang => 
      userLanguages.some(ul => ul.toLowerCase().includes(lang.toLowerCase()))
    );
    if (hasLanguage) {
      score += 40;
      reasons.push(`Language Match (${task.requiredLanguages.join(', ')})`);
    }

    // Check skill match
    const matchingSkills = task.requiredSkills.filter(reqSkill =>
      userSkills.some(us => us.toLowerCase().includes(reqSkill.toLowerCase()))
    );
    if (matchingSkills.length > 0) {
      score += 50;
      reasons.push(`Skill Match (${matchingSkills.join(', ')})`);
    }

    // Remote task bonus for general volunteer
    if (task.safetyLevel === 'safe_remote') {
      score += 10;
      reasons.push('Safe Virtual / Remote Participation');
    }

    return { score, reasons };
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    if (selectedSafety !== 'all' && task.safetyLevel !== selectedSafety) return false;
    return true;
  });

  const handleAddSkill = () => {
    if (!newSkill.trim() || userSkills.includes(newSkill.trim())) return;
    updateVolunteerSkills([...userSkills, newSkill.trim()], userLanguages);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    updateVolunteerSkills(userSkills.filter(s => s !== skillToRemove), userLanguages);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <HandHelping className="w-7 h-7 text-emerald-400" />
              <span>Volunteer Task Portal & Matching</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
              Module E
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Single account capability: Serve as a community volunteer, match tasks by verified skills, and earn recognition points.
          </p>
        </div>

        <Link to="/impact">
          <Button variant="accent" size="sm" className="gap-1.5">
            <Award className="w-4 h-4" />
            <span>My Verified Points ({volunteerProfile?.verifiedPoints || 0})</span>
          </Button>
        </Link>
      </div>

      {/* Volunteer Profile & Capability Settings Banner */}
      <Card className="p-6 border-slate-700 bg-slate-900/90 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
              {currentUser?.displayName.charAt(0) || 'V'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{currentUser?.displayName}</h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {currentUser?.currentRole}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Service Area: {volunteerProfile?.serviceArea.city || 'Cedar Valley'}, {volunteerProfile?.serviceArea.state || 'OR'} (±{volunteerProfile?.serviceArea.radiusKm || 25}km radius)
              </p>
            </div>
          </div>

          {/* Opt-in / Availability Toggles */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-300 block">Volunteer Capability:</span>
              <span className={`text-[11px] font-medium ${isOptedIn ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isOptedIn ? 'Opted In (Active)' : 'Opted Out'}
              </span>
            </div>
            <button
              onClick={toggleVolunteerStatus}
              className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                isOptedIn 
                  ? 'bg-emerald-600 text-white border-emerald-500' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {isOptedIn ? 'Opt Out' : 'Opt In Now'}
            </button>
          </div>
        </div>

        {/* Skills & Language Tags */}
        {isOptedIn && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <label className="font-semibold text-slate-300 uppercase tracking-wider block">
                Registered Volunteer Skills ({userSkills.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {userSkills.map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs">
                    <span>{skill}</span>
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400 ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill (e.g. First Aid, Driving, Cold Storage)..."
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700"
                >
                  + Add
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-slate-300 uppercase tracking-wider block">
                Languages Spoken ({userLanguages.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {userLanguages.map((lang, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-1">
                    <Languages className="w-3 h-3" />
                    <span>{lang}</span>
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Translations match disaster reports in Spanish, Vietnamese, Hindi, and English.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Task Filters */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">Filter Tasks:</span>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="translation">Translation & Audio</option>
            <option value="shelter_ops">Shelter Operations</option>
            <option value="data_verification">Duplicate / Data Check</option>
            <option value="logistics">Supply & Logistics</option>
          </select>

          <select
            value={selectedSafety}
            onChange={(e) => setSelectedSafety(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Safety Levels</option>
            <option value="safe_remote">Safe Remote (Virtual)</option>
            <option value="community_low_risk">Community Low-Risk</option>
            <option value="specialized_approved">Specialized / Approved</option>
          </select>
        </div>

        <span className="text-xs text-slate-400">
          {filteredTasks.length} Approved Tasks Available
        </span>
      </div>

      {/* Task Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => {
          const { score, reasons } = computeMatchScore(task);
          const isAssignedToMe = task.assignedVolunteerId === currentUser?.id;
          const isAvailableTask = task.status === 'available';

          return (
            <Card 
              key={task.id} 
              className={`p-5 space-y-4 flex flex-col justify-between border transition-all ${
                score >= 50 
                  ? 'border-emerald-500/40 bg-emerald-950/10' 
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="space-y-3">
                
                {/* Points & Urgency Header */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-extrabold border border-emerald-500/40">
                    +{task.pointsAward} Points
                  </span>
                  <StatusPill status={task.status} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-100 text-base leading-snug">
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Why This Matches You */}
                {reasons.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30 text-[11px] space-y-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Why This Matches You ({score}% Match):
                    </span>
                    <ul className="text-slate-300 space-y-0.5">
                      {reasons.map((r, i) => (
                        <li key={i}>✓ {r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety & Location Tag */}
                <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">{task.location.description}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span className="capitalize">{task.safetyLevel.replace(/_/g, ' ')}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <Link to={`/volunteer/tasks/${task.id}`} className="text-xs text-slate-400 hover:text-white underline">
                  View Details
                </Link>

                {isAssignedToMe ? (
                  <div className="flex items-center gap-2">
                    <Link to={`/volunteer/tasks/${task.id}`}>
                      <Button variant="accent" size="sm">
                        Submit Evidence
                      </Button>
                    </Link>
                    <button
                      onClick={() => declineTask(task.id, currentUser.id)}
                      className="text-xs text-slate-500 hover:text-red-400"
                      title="Decline without penalty"
                    >
                      Decline
                    </button>
                  </div>
                ) : isAvailableTask ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (!currentUser) return;
                      acceptTask(task.id, currentUser.id, currentUser.displayName);
                    }}
                  >
                    Accept Task
                  </Button>
                ) : (
                  <span className="text-xs text-slate-500 italic">Assigned</span>
                )}
              </div>

            </Card>
          );
        })}
      </div>

    </div>
  );
};
