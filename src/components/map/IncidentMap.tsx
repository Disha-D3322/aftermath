import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Layers, 
  Filter, 
  AlertCircle, 
  ShieldAlert, 
  HelpCircle, 
  List, 
  Map as MapIcon, 
  Info, 
  ChevronRight,
  Radio,
  CheckCircle2,
  Users
} from 'lucide-react';
import { ConsolidatedIncident, DisasterReport, UrgencyLevel, ReportCategory } from '@/types';
import { UrgencyBadge, StatusPill, Button, Card } from '@/components/ui';

interface IncidentMapProps {
  incidents: ConsolidatedIncident[];
  unlocatedReports: DisasterReport[];
  onSelectIncident?: (incident: ConsolidatedIncident) => void;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  unlocatedReports,
  onSelectIncident
}) => {
  const [selectedIncident, setSelectedIncident] = useState<ConsolidatedIncident | null>(incidents[0] || null);
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showUnlocatedDrawer, setShowUnlocatedDrawer] = useState(false);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      if (urgencyFilter !== 'all' && inc.urgency !== urgencyFilter) return false;
      if (categoryFilter !== 'all' && inc.category !== categoryFilter) return false;
      return true;
    });
  }, [incidents, urgencyFilter, categoryFilter]);

  // Map center coordinates (Cedar Valley, OR)
  const mapCenter = { lat: 44.055, lng: -123.085 };

  // Calculate pixel position on tactical map container
  const getMarkerPixel = (lat: number, lng: number) => {
    // Range: lat [44.040, 44.070], lng [-123.100, -123.070]
    const minLat = 44.045, maxLat = 44.068;
    const minLng = -123.098, maxLng = -123.072;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      left: `${Math.min(Math.max(x, 8), 92)}%`,
      top: `${Math.min(Math.max(y, 8), 92)}%`
    };
  };

  const getUrgencyMarkerColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white shadow-red-500/50 border-red-300 animate-pulse';
      case 'high': return 'bg-amber-500 text-slate-950 shadow-amber-500/50 border-amber-300';
      case 'moderate': return 'bg-blue-500 text-white shadow-blue-500/50 border-blue-300';
      case 'low': return 'bg-emerald-500 text-white shadow-emerald-500/50 border-emerald-300';
      default: return 'bg-slate-500 text-white border-slate-300';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[620px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      
      {/* Top Filter Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-20">
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'map' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map Grounding</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          {/* Unlocated Queue Pill */}
          <button
            onClick={() => setShowUnlocatedDrawer(!showUnlocatedDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              unlocatedReports.length > 0
                ? 'bg-amber-950/40 border-amber-600/40 text-amber-300 hover:bg-amber-900/50'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Unlocated Queue ({unlocatedReports.length})</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Urgency */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Urgencies</option>
            <option value="critical">🔴 Critical Priority</option>
            <option value="high">🟠 High Urgency</option>
            <option value="moderate">🔵 Moderate</option>
            <option value="low">🟢 Low Priority</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="rescue">Rescue / Evacuation</option>
            <option value="medical">Medical Assistance</option>
            <option value="food_water">Food & Potable Water</option>
            <option value="shelter">Shelter & Bedding</option>
            <option value="infrastructure">Infrastructure / Power</option>
          </select>

          <span className="text-xs text-slate-400 ml-2 hidden sm:inline">
            {filteredIncidents.length} Grounded Points
          </span>
        </div>
      </div>

      {/* Main Map + Sidebar Workspace */}
      <div className="relative flex-1 flex overflow-hidden">
        
        {/* Tactical Map Canvas */}
        {viewMode === 'map' ? (
          <div className="relative flex-1 bg-[#0b101b] overflow-hidden flex items-center justify-center select-none">
            
            {/* Grid & Elevation Ripple Contour Background */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                backgroundSize: '40px 40px, 80px 80px, 80px 80px'
              }}
            />

            {/* River corridor representation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M -50,150 Q 250,220 500,280 T 1000,420 T 1600,480" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="48" 
                strokeLinecap="round" 
                strokeOpacity="0.4"
              />
              <path 
                d="M -50,150 Q 250,220 500,280 T 1000,420 T 1600,480" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="12" 
                strokeDasharray="16,8"
                strokeOpacity="0.8"
              />
            </svg>

            {/* Geographical labels */}
            <div className="absolute top-6 left-6 text-xs text-slate-500 font-mono tracking-wider pointer-events-none">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
                <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
                CEDAR VALLEY RIVER BASIN SECTOR 04
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Grounded Coordinates: 44.055° N, 123.085° W | Flood Surge Ingress
              </div>
            </div>

            {/* Incident Markers */}
            {filteredIncidents.map(inc => {
              if (!inc.location.coordinates || inc.location.isUnknown) return null;
              const pos = getMarkerPixel(inc.location.coordinates.lat, inc.location.coordinates.lng);
              const isSelected = selectedIncident?.id === inc.id;

              return (
                <div
                  key={inc.id}
                  style={{ left: pos.left, top: pos.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  onClick={() => {
                    setSelectedIncident(inc);
                    if (onSelectIncident) onSelectIncident(inc);
                  }}
                >
                  {/* Uncertainty radius halo */}
                  <div 
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all ${
                      isSelected 
                        ? 'w-24 h-24 border-2 border-emerald-400/80 bg-emerald-500/15 animate-ping' 
                        : 'w-16 h-16 border border-slate-600/40 bg-slate-800/10'
                    }`}
                  />

                  {/* Marker Pin */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-xl transition-all transform group-hover:scale-125 ${
                      getUrgencyMarkerColor(inc.urgency)
                    } ${isSelected ? 'ring-4 ring-emerald-400 scale-110' : ''}`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>

                  {/* Label tooltip */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 text-slate-200 text-[11px] px-2.5 py-1 rounded-md shadow-2xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    <span className="font-semibold">{inc.title}</span>
                    <span className="text-[10px] text-slate-400 block">{inc.affectedPeople} affected</span>
                  </div>
                </div>
              );
            })}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 shadow-xl backdrop-blur-md">
              <div className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Humanitarian Legend
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Critical (Immediate Life Danger)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>High (Time-Sensitive Medical / Supply)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Moderate Relief</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full border border-dashed border-emerald-400" />
                  <span>Uncertainty Radius (Reported Bounds)</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Alternative List View for Mobile & Accessibility */
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950">
            {filteredIncidents.length === 0 ? (
              <p className="text-slate-400 text-center py-10 text-sm">No incidents match current filter criteria.</p>
            ) : (
              filteredIncidents.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncident(inc);
                    if (onSelectIncident) onSelectIncident(inc);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedIncident?.id === inc.id
                      ? 'border-emerald-500/50 bg-emerald-950/20 shadow-lg shadow-emerald-950/30'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <UrgencyBadge urgency={inc.urgency} />
                        <StatusPill status={inc.verificationStatus} />
                      </div>
                      <h4 className="font-semibold text-slate-100 text-sm">{inc.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{inc.summary}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0 mt-2" />
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {inc.location.description}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      {inc.affectedPeople} reported
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Selected Incident Detail Drawer / Sidebar */}
        {selectedIncident && (
          <aside className="w-full md:w-96 border-l border-slate-800 bg-slate-900/95 overflow-y-auto p-5 space-y-5 shadow-2xl z-20">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
                  INCIDENT #{selectedIncident.id}
                </span>
                <h3 className="font-bold text-slate-100 text-base leading-snug mt-0.5">
                  {selectedIncident.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="flex items-center gap-2">
              <UrgencyBadge urgency={selectedIncident.urgency} />
              <StatusPill status={selectedIncident.verificationStatus} />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
              <div className="text-slate-400 font-medium">Summary:</div>
              <p className="text-slate-200 leading-relaxed">{selectedIncident.summary}</p>
            </div>

            {/* Location Grounding & Uncertainty */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Grounded Location
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  ±{selectedIncident.location.uncertaintyRadiusMeters || 50}m Radius
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-slate-200">
                <div className="font-semibold">{selectedIncident.location.description}</div>
                {selectedIncident.location.address && (
                  <div className="text-[11px] text-slate-400 mt-0.5">{selectedIncident.location.address}</div>
                )}
                {selectedIncident.location.coordinates && (
                  <div className="text-[10px] font-mono text-slate-500 mt-1">
                    GPS: {selectedIncident.location.coordinates.lat.toFixed(4)}, {selectedIncident.location.coordinates.lng.toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            {/* Outstanding Needs */}
            <div className="space-y-2 text-xs">
              <div className="text-slate-400 font-medium">Outstanding Humanitarian Needs:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedIncident.outstandingNeeds.map((need, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
                    • {need}
                  </span>
                ))}
              </div>
            </div>

            {/* Consolidated Reports */}
            <div className="space-y-2 text-xs">
              <div className="text-slate-400 font-medium flex items-center justify-between">
                <span>Associated Source Reports:</span>
                <span className="text-[10px] text-slate-500 font-mono">{selectedIncident.associatedReportIds.length} Linked</span>
              </div>
              <div className="space-y-1.5">
                {selectedIncident.associatedReportIds.map(repId => (
                  <div key={repId} className="p-2 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-emerald-400">{repId}</span>
                    <span className="text-[10px] text-slate-400">Verified Evidence</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <a
                href={`/incidents/${selectedIncident.id}`}
                className="flex-1 text-center py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-colors"
              >
                View Full Incident
              </a>
              <a
                href={`/review/incidents/${selectedIncident.id}`}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              >
                Audit / Review
              </a>
            </div>
          </aside>
        )}

        {/* Unlocated Reports Slide-over Drawer */}
        {showUnlocatedDrawer && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-amber-500/40 p-5 shadow-2xl z-30 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-slate-100 text-sm">Unlocated Reports Queue</h4>
              </div>
              <button onClick={() => setShowUnlocatedDrawer(false)} className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800">
                Close
              </button>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed mb-4 p-3 rounded-lg bg-amber-950/30 border border-amber-700/40">
              <strong>Humanitarian Safety Rule:</strong> Reports with missing or vague GPS coordinates are <em>never</em> placed at fabricated coordinates. They are held here for cell-tower triangulation or dispatch clarification.
            </p>

            <div className="space-y-3">
              {unlocatedReports.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">All active reports have grounded coordinates.</p>
              ) : (
                unlocatedReports.map(rep => (
                  <div key={rep.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <UrgencyBadge urgency={rep.aiTriage?.urgency || 'unknown'} />
                      <span className="text-[10px] font-mono text-slate-500">{rep.id}</span>
                    </div>
                    <div className="font-semibold text-slate-100">{rep.title}</div>
                    <p className="text-slate-400 line-clamp-2">{rep.originalMessage}</p>
                    <div className="text-[11px] text-amber-400/90 font-mono">
                      Location: {rep.location.description}
                    </div>
                    <div className="pt-2 flex justify-end">
                      <a
                        href={`/review/incidents/${rep.id}`}
                        className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Triangulate & Ground Location →
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
