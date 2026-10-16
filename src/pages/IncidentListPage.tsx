import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Filter, 
  AlertTriangle, 
  ShieldCheck, 
  Users, 
  ExternalLink,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { IncidentMap } from '@/components/map/IncidentMap';
import { UrgencyBadge, StatusPill, Card, Button } from '@/components/ui';

export const IncidentListPage: React.FC = () => {
  const { incidents, reports } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Unlocated reports (missing grounded coordinates)
  const unlocatedReports = reports.filter(r => r.location.isUnknown || !r.location.coordinates);

  const searchedIncidents = incidents.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.location.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-7 h-7 text-emerald-400" />
            <span>Grounded Incident Map & Registry</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time geospatial visualization of validated disaster clusters, unlocated reports queue, and resource allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/report">
            <Button variant="danger" size="sm" className="gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Report Distress</span>
            </Button>
          </Link>
          <Link to="/review">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Reviewer Queue</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* The Core Incident Map Component */}
      <IncidentMap
        incidents={incidents}
        unlocatedReports={unlocatedReports}
      />

      {/* Search & Registry Table */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-200">Consolidated Incident Registry ({searchedIncidents.length})</h2>
          
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by street or keyword..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Incident Title</th>
                  <th className="py-3 px-4">Grounded Location</th>
                  <th className="py-3 px-4">Affected</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Source Reports</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {searchedIncidents.map(inc => (
                  <tr key={inc.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <UrgencyBadge urgency={inc.urgency} />
                    </td>
                    <td className="py-3.5 px-4">
                      <Link to={`/incidents/${inc.id}`} className="font-semibold text-slate-100 hover:text-emerald-400">
                        {inc.title}
                      </Link>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{inc.summary}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{inc.location.description}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Radius: ±{inc.location.uncertaintyRadiusMeters || 50}m
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-mono">
                      {inc.affectedPeople}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusPill status={inc.verificationStatus} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono">
                      {inc.associatedReportIds.length} Linked
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        to={`/incidents/${inc.id}`}
                        className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
