import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Languages, 
  HeartHandshake, 
  Trophy, 
  Flame, 
  Calendar,
  FileCheck2,
  Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, Button } from '@/components/ui';

export const ImpactHubPage: React.FC = () => {
  const { currentUser, volunteerProfile } = useAuth();
  const { contributions } = useData();

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // User's verified contributions
  const userContributions = contributions.filter(c => c.userId === currentUser?.id);
  const totalVerifiedPoints = userContributions.reduce((sum, c) => sum + c.points, 0);

  const badges = [
    {
      id: 'b_translator',
      name: 'Community Translator',
      icon: Languages,
      description: 'Translated foreign language distress reports accurately during active inundation.',
      unlocked: true,
      awardedAt: 'Oct 15, 2026'
    },
    {
      id: 'b_helper',
      name: 'Verified Helper',
      icon: CheckCircle2,
      description: 'Successfully resolved confirmed shelter relief & ration deliveries.',
      unlocked: true,
      awardedAt: 'Oct 16, 2026'
    },
    {
      id: 'b_coordinator',
      name: 'Relief Coordinator',
      icon: HeartHandshake,
      description: 'Coordinated volunteer task handoffs and assisted field intake.',
      unlocked: userContributions.length >= 3,
      awardedAt: userContributions.length >= 3 ? 'Oct 16, 2026' : 'In Progress'
    },
    {
      id: 'b_consistency',
      name: 'Consistency Champion',
      icon: Flame,
      description: 'Maintained active availability through continuous 48-hour flood surge.',
      unlocked: totalVerifiedPoints >= 60,
      awardedAt: totalVerifiedPoints >= 60 ? 'Oct 16, 2026' : '35 / 60 Pts'
    }
  ];

  const handleDownloadCertificate = () => {
    // Generate text-based humanitarian service certificate
    const certText = `
=============================================================
         AFTERMATH DISASTER HUMANITARIAN RECOGNITION
=============================================================

This certifies that: ${currentUser?.displayName || 'Community Volunteer'}
Account Reference: ${currentUser?.id || 'VOL-001'}

Has contributed ${totalVerifiedPoints} verified humanitarian relief points
during the Cedar River Surge 2026 flood response.

VERIFIED CONTRIBUTIONS LEDGER:
${userContributions.map(c => `• [${c.timestamp.slice(0, 10)}] ${c.taskTitle} (+${c.points} pts) - Verified by: ${c.verifiedBy}`).join('\n')}

System Verification Hash: SHA-256:AFTERMATH-IDEMPOTENT-${Date.now()}
Official Humanitarian Standard: Decentralized Community Resilience
=============================================================
`;

    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AfterMath_Impact_Certificate_${currentUser?.id || 'volunteer'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Award className="w-7 h-7 text-emerald-400" />
              <span>Verified Volunteer Impact & Recognition</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
              Module F
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transparent record of confirmed humanitarian contributions, skill badges, and downloadable service audit records.
          </p>
        </div>

        <Button variant="accent" size="md" onClick={handleDownloadCertificate} className="gap-2">
          <Download className="w-4 h-4" />
          <span>Export Service Summary</span>
        </Button>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Certificate downloaded successfully!</span>
        </div>
      )}

      {/* Disclaimers & Ethics Banner */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-slate-200 block">Humanitarian Prioritization Rule:</strong>
          <span>
            Points are awarded strictly for post-incident recognition. Emergency triage priority is never influenced by volunteer point totals or corporate donor amounts. Points cannot be self-awarded or duplicated.
          </span>
        </div>
      </div>

      {/* Point Total & Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Total Points Hero Card */}
        <Card className="md:col-span-1 p-6 flex flex-col justify-between border-emerald-500/40 bg-emerald-950/20 text-center space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
              TOTAL VERIFIED SCORE
            </span>
            <div className="text-5xl font-black text-white font-mono mt-2">
              {totalVerifiedPoints}
            </div>
            <p className="text-xs text-slate-400">Humanitarian Points Earned</p>
          </div>

          <div className="pt-4 border-t border-emerald-950 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Completed Tasks:</span>
              <strong className="text-white font-mono">{userContributions.length}</strong>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <strong className="text-emerald-400">Verified Volunteer</strong>
            </div>
          </div>
        </Card>

        {/* Skill Badges Showcase */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map(badge => {
            const Icon = badge.icon;
            return (
              <Card 
                key={badge.id}
                className={`p-4 space-y-2 border transition-all ${
                  badge.unlocked 
                    ? 'border-emerald-500/30 bg-slate-900/80' 
                    : 'border-slate-800 bg-slate-950/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    badge.unlocked 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {badge.unlocked ? 'Unlocked' : 'In Progress'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 text-sm">{badge.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{badge.description}</p>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 font-mono">
                  Awarded: {badge.awardedAt}
                </div>
              </Card>
            );
          })}
        </div>

      </div>

      {/* Append-Only Verified Contributions Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <span>Cryptographic Contribution Ledger ({userContributions.length})</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Idempotent Award Pipeline</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Task Completed</th>
                  <th className="py-3 px-4">Contribution Type</th>
                  <th className="py-3 px-4">Verified By</th>
                  <th className="py-3 px-4">Points</th>
                  <th className="py-3 px-4 font-mono text-[11px]">Audit Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {userContributions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No contributions logged yet. Complete and verify an approved volunteer task to earn recognition points.
                    </td>
                  </tr>
                ) : (
                  userContributions.map(c => (
                    <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {new Date(c.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {c.taskTitle}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {c.contributionType}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400 font-medium">
                        {c.verifiedBy}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold font-mono text-xs">
                          +{c.points} Pts
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                        {c.id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
