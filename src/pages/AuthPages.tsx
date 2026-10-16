import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  HandHelping, 
  Award, 
  Clock 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, Button, StatusPill, UrgencyBadge } from '@/components/ui';

export const LoginPage: React.FC = () => {
  const { loginDemo, switchUser, availableUsers } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const success = loginDemo(email);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use one of the demo actor buttons below for instant evaluation.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-black border border-emerald-500/40 p-1 mx-auto flex items-center justify-center">
          <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
        </div>
        <h1 className="text-2xl font-bold text-white">Sign In to AfterMath</h1>
        <p className="text-xs text-slate-400">Access humanitarian relief coordination and volunteer desk.</p>
      </div>

      <Card className="p-6 space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 uppercase font-semibold">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria.santos@demo.aftermath.org"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 uppercase font-semibold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full mt-2">
            Sign In
          </Button>
        </form>

        {/* Quick One-Click Demo Actor Buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Hackathon One-Click Evaluation Logins:
          </span>

          <div className="space-y-1.5 text-xs">
            {availableUsers.map(user => (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  switchUser(user.id);
                  navigate('/dashboard');
                }}
                className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-slate-200 flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-semibold block">{user.displayName}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{user.roles.join(', ')}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { switchUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [volunteerOptIn, setVolunteerOptIn] = useState(true);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to Maria Santos for seamless demo
    switchUser('user_maria_101');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Create an Account</h1>
        <p className="text-xs text-slate-400">One account to request assistance and volunteer.</p>
      </div>

      <Card className="p-6 space-y-4">
        <form onSubmit={handleRegister} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 uppercase font-semibold">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maria Santos"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 uppercase font-semibold">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2">
            <input
              id="optInVol"
              type="checkbox"
              checked={volunteerOptIn}
              onChange={(e) => setVolunteerOptIn(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-emerald-500 text-emerald-600 bg-slate-900"
            />
            <label htmlFor="optInVol" className="text-xs text-slate-300">
              <strong className="text-emerald-300 block">Enable Volunteer Capability</strong>
              Allow matching for community translation, shelter support, or logistics in my general service area.
            </label>
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full mt-2">
            Complete Registration
          </Button>
        </form>
      </Card>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { currentUser, volunteerProfile, toggleVolunteerStatus } = useAuth();
  const { reports, tasks, contributions } = useData();

  // Reports submitted by or assigned to me
  const myReports = reports.filter(r => r.reporterId === currentUser?.id);
  const myTasks = tasks.filter(t => t.assignedVolunteerId === currentUser?.id);
  const myContributions = contributions.filter(c => c.userId === currentUser?.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold">PERSONAL OVERVIEW</span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">
            Welcome back, {currentUser?.displayName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Single account active: You can submit help requests and participate in volunteer relief from this console.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/report">
            <Button variant="danger" size="sm" className="gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Request Help</span>
            </Button>
          </Link>
          <Link to="/volunteer">
            <Button variant="accent" size="sm" className="gap-1.5">
              <HandHelping className="w-4 h-4" />
              <span>Browse Tasks</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-800 bg-slate-900/60 text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold">My Help Requests</span>
          <div className="text-3xl font-black text-white font-mono mt-1">{myReports.length}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Tracked live with AI triage</span>
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60 text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold">Active Volunteer Tasks</span>
          <div className="text-3xl font-black text-teal-400 font-mono mt-1">{myTasks.length}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">In progress or submitted</span>
        </Card>

        <Card className="p-4 border-emerald-500/30 bg-emerald-950/15 text-center">
          <span className="text-xs text-emerald-400 uppercase font-semibold">Verified Points</span>
          <div className="text-3xl font-black text-white font-mono mt-1">
            {volunteerProfile?.verifiedPoints || myContributions.reduce((s, c) => s + c.points, 0)}
          </div>
          <span className="text-[10px] text-emerald-300 mt-1 block">Earned via verified contributions</span>
        </Card>
      </div>

      {/* Two-column layout: My Requests vs My Assigned Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* My Requests */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center justify-between">
            <span>My Submitted Help Requests ({myReports.length})</span>
            <Link to="/report" className="text-xs text-emerald-400 hover:underline">+ New Request</Link>
          </h2>

          <div className="space-y-3">
            {myReports.length === 0 ? (
              <p className="text-xs text-slate-500 p-6 rounded-xl border border-slate-800 bg-slate-950 text-center">
                You have not submitted any active assistance requests.
              </p>
            ) : (
              myReports.map(rep => (
                <Card key={rep.id} className="p-4 space-y-2 border-slate-800 bg-slate-900/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{rep.title}</span>
                    <StatusPill status={rep.status} />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{rep.originalMessage}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <UrgencyBadge urgency={rep.aiTriage?.urgency || 'moderate'} />
                    <span>Submitted {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* My Volunteer Tasks */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center justify-between">
            <span>My Volunteer Assignments ({myTasks.length})</span>
            <Link to="/volunteer" className="text-xs text-teal-400 hover:underline">Find Tasks</Link>
          </h2>

          <div className="space-y-3">
            {myTasks.length === 0 ? (
              <p className="text-xs text-slate-500 p-6 rounded-xl border border-slate-800 bg-slate-950 text-center">
                No active task assignments. Check the Volunteer Hub to accept tasks matching your skills.
              </p>
            ) : (
              myTasks.map(task => (
                <Card key={task.id} className="p-4 space-y-2 border-slate-800 bg-slate-900/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{task.title}</span>
                    <span className="font-mono text-emerald-400 font-bold">+{task.pointsAward} Pts</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{task.description}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <StatusPill status={task.status} />
                    <Link to={`/volunteer/tasks/${task.id}`} className="text-emerald-400 hover:underline">
                      Manage Task →
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
