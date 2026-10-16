import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  Truck, 
  CheckCircle2, 
  Plus, 
  Download, 
  Clock, 
  ShieldCheck, 
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { ResourceCategory, ResourcePledgeStatus, ResourcePledge } from '@/types';
import { StatusPill, Card, Button } from '@/components/ui';

export const CorporateDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { organizations, pledges, incidents, createResourcePledge, updatePledgeStatus } = useData();

  // Active Organization (Apex Global Logistics by default for demo)
  const currentOrgId = currentUser?.organizationId || 'org_apex_global';
  const org = organizations.find(o => o.id === currentOrgId) || organizations[0];

  // Org-scoped pledges
  const orgPledges = pledges.filter(p => p.organizationId === org.id);

  // New Pledge Modal / Form state
  const [showNewPledgeModal, setShowNewPledgeModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ResourceCategory>('food_water');
  const [newQuantity, setNewQuantity] = useState('');
  const [newAmountUsd, setNewAmountUsd] = useState<number | ''>('');
  const [newDescription, setNewDescription] = useState('');
  const [targetIncidentId, setTargetIncidentId] = useState(incidents[0]?.id || '');
  const [logisticsContact, setLogisticsContact] = useState('');
  const [exportNotice, setExportNotice] = useState(false);

  const handleCreatePledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuantity.trim()) return;

    const targetInc = incidents.find(i => i.id === targetIncidentId);

    createResourcePledge({
      organizationId: org.id,
      organizationName: org.name,
      category: newCategory,
      title: newTitle,
      description: newDescription || 'Humanitarian aid commitment directly supporting disaster relief operations.',
      quantity: newQuantity,
      financialAmountUsd: typeof newAmountUsd === 'number' ? newAmountUsd : null,
      status: 'pledged',
      targetIncidentId: targetIncidentId || null,
      targetIncidentTitle: targetInc?.title || null,
      logisticsContact: logisticsContact || 'Apex Operations Central VHF'
    });

    setShowNewPledgeModal(false);
    setNewTitle('');
    setNewQuantity('');
  };

  const handleAdvanceStatus = (pledge: ResourcePledge) => {
    const nextStatusMap: Record<ResourcePledgeStatus, ResourcePledgeStatus> = {
      pledged: 'approved',
      approved: 'dispatched',
      dispatched: 'delivered',
      delivered: 'verified',
      verified: 'verified'
    };

    const next = nextStatusMap[pledge.status];
    updatePledgeStatus(
      pledge.id,
      next,
      `Status transition advanced to ${next.toUpperCase()} by CSR Director.`,
      currentUser?.displayName || 'Apex CSR'
    );
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Pledge ID,Organization,Category,Title,Quantity,Amount (USD),Status,Target Incident\n" +
      orgPledges.map(p => `"${p.id}","${p.organizationName}","${p.category}","${p.title}","${p.quantity}","${p.financialAmountUsd || 0}","${p.status}","${p.targetIncidentTitle || 'General'}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AfterMath_CSR_Impact_Report_${org.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/partners" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-medium mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Corporate Portal</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {org.name} — CSR Impact Desk
            </h1>
            <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-xs font-mono font-bold border border-teal-500/30">
              Org Scoped
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage pledged logistics, track fleet deliveries, and audit ESG social impact records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5">
            <Download className="w-4 h-4" />
            <span>Export ESG Impact CSV</span>
          </Button>

          <Button variant="primary" size="sm" onClick={() => setShowNewPledgeModal(true)} className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span>New Resource Pledge</span>
          </Button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Verified ESG Impact CSV generated and downloaded!</span>
        </div>
      )}

      {/* Org Metrics Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Pledged Aid</span>
          <div className="text-2xl font-black text-white font-mono mt-1">${(org.totalPledgedUsd / 1000).toFixed(0)}k USD</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">In-Kind & Financial Combined</span>
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase font-semibold">Pledged Relief Items</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{orgPledges.length} Active Drops</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Tracked from origin to intake</span>
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase font-semibold">Delivered Units</span>
          <div className="text-2xl font-black text-teal-400 font-mono mt-1">{org.totalDeliveredResourcesCount} Items</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Quartermaster verified on-site</span>
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase font-semibold">Employee Brigade</span>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">{org.employeeVolunteersActive} Active</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Approved corporate volunteers</span>
        </Card>
      </div>

      {/* Pledges Lifecycle Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Active Commitments & Real-Time Logistics Tracking</h2>
          <span className="text-xs text-slate-400 font-mono">
            Pipeline: Pledged → Approved → Dispatched → Delivered → Verified
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Pledge / Resource</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Target Incident</th>
                  <th className="py-3 px-4">Logistics Contact</th>
                  <th className="py-3 px-4 text-right">Progress Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orgPledges.map(pledge => (
                  <tr key={pledge.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusPill status={pledge.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{pledge.title}</div>
                      <div className="text-[11px] text-slate-500 capitalize">{pledge.category.replace(/_/g, ' ')}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {pledge.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {pledge.targetIncidentTitle || 'Central Staging Area'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {pledge.logisticsContact}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {pledge.status !== 'verified' ? (
                        <button
                          onClick={() => handleAdvanceStatus(pledge)}
                          className="px-2.5 py-1 rounded-md bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition-colors"
                        >
                          Advance Status →
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Complete & Verified
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Resource Pledge Modal */}
      {showNewPledgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 space-y-5 border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Register Corporate Relief Commitment</h3>
              <button onClick={() => setShowNewPledgeModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePledge} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 uppercase font-semibold">Title of Resource Pledge *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 10 Commercial Inflatable Rafts & 100 Life Vests"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 uppercase font-semibold">Resource Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ResourceCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="food_water">Food & Potable Water</option>
                    <option value="equipment">Heavy Equipment & Comms</option>
                    <option value="transport">Freight Fleet & Transport</option>
                    <option value="hygiene_kits">Hygiene & Medical Packs</option>
                    <option value="shelter_supplies">Shelter Supplies & Cots</option>
                    <option value="financial">Financial Grant Pledge</option>
                    <option value="employee_volunteers">Employee Volunteer Hours</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 uppercase font-semibold">Quantity Description *</label>
                  <input
                    type="text"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="e.g. 10 Rafts + 100 Vests"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 uppercase font-semibold">Target Disaster Incident</label>
                <select
                  value={targetIncidentId}
                  onChange={(e) => setTargetIncidentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  {incidents.map(inc => (
                    <option key={inc.id} value={inc.id}>
                      {inc.title} ({inc.location.description})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 uppercase font-semibold">Logistics Dispatch Contact</label>
                <input
                  type="text"
                  value={logisticsContact}
                  onChange={(e) => setLogisticsContact(e.target.value)}
                  placeholder="e.g. VHF Ch 16 / dispatch@apexrelief.global"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowNewPledgeModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Register Commitment
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};
