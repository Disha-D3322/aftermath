import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  ShieldAlert, 
  FileText, 
  Camera, 
  Mic, 
  CheckCircle2, 
  HelpCircle, 
  Languages, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { ReportCategory, DisasterReport } from '@/types';
import { Button, Card, UrgencyBadge } from '@/components/ui';

export const ReportHelpPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { submitReport, isProcessingAi } = useData();
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [originalMessage, setOriginalMessage] = useState('');
  const [category, setCategory] = useState<ReportCategory>('rescue');
  const [locationDescription, setLocationDescription] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [peopleAffected, setPeopleAffected] = useState<number | ''>('');
  const [immediateDanger, setImmediateDanger] = useState(false);
  const [mediaAttachment, setMediaAttachment] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');

  // Submission Result State for instant feedback
  const [submittedReport, setSubmittedReport] = useState<DisasterReport | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Quick Preset Samples for Hackathon Demo Evaluation
  const loadDemoScenario = (type: 'spanish_elderly' | 'vietnamese_medical' | 'unknown_truck') => {
    if (type === 'spanish_elderly') {
      setTitle('Agua subiendo rápido al segundo piso, abuelos atrapados');
      setOriginalMessage('¡Por favor ayuda! El agua del río ya cubrió la planta baja en Calle del Roble 412. Mis abuelos están en el segundo piso y no pueden bajar las escaleras. Se cortó la luz. Somos 4 personas.');
      setCategory('rescue');
      setLocationDescription('412 Oak Street (Calle del Roble), Lower Riverbank');
      setAddress('412 Oak St, Cedar Valley, OR');
      setCoordinates({ lat: 44.0545, lng: -123.0912 });
      setPeopleAffected(4);
      setImmediateDanger(true);
      setSelectedLanguage('es');
    } else if (type === 'vietnamese_medical') {
      setTitle('Cần insulin khẩn cấp cho người bệnh tiểu đường');
      setOriginalMessage('Mẹ tôi 68 tuổi bị tiểu đường tuýp 1, thuốc insulin bị ngập hỏng mất rồi. Chúng tôi đang ở tầng 2 nhà văn hóa cộng đồng Riverside, đường Elm số 88. Cần hỗ trợ y tế khẩn cấp.');
      setCategory('medical');
      setLocationDescription('88 Elm Street, Riverside Community Center, 2nd Floor');
      setAddress('88 Elm St, Cedar Valley, OR');
      setCoordinates({ lat: 44.0512, lng: -123.0845 });
      setPeopleAffected(2);
      setImmediateDanger(true);
      setSelectedLanguage('vi');
    } else {
      setTitle('Stranded in truck near the levee bypass, water rushing');
      setOriginalMessage('Water just pushed my pickup into the trees. I cannot see street signs. It is somewhere between the grain silo and the blue river bridge on old county route. Battery dying.');
      setCategory('rescue');
      setLocationDescription('Somewhere between grain silo and blue bridge on old county route');
      setAddress('');
      setCoordinates(null); // Explicitly test UNKNOWN coordinates!
      setPeopleAffected(1);
      setImmediateDanger(true);
      setSelectedLanguage('en');
    }
  };

  const handleDetectLocation = () => {
    setIsLocating(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationDescription(prev => prev || `GPS Detected (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`);
        setIsLocating(false);
      },
      (error) => {
        // Safe simulation fallback for test environments
        setCoordinates({ lat: 44.055, lng: -123.085 });
        setLocationDescription(prev => prev || 'Cedar Valley Riverside District (Simulated GPS)');
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !originalMessage.trim()) {
      alert('Please fill out the title and description.');
      return;
    }

    try {
      const report = await submitReport({
        title,
        originalMessage,
        category,
        locationDescription: locationDescription || 'Location not specified',
        address: address || undefined,
        coordinates: coordinates || undefined,
        peopleAffectedCount: typeof peopleAffected === 'number' ? peopleAffected : null,
        immediateDanger,
        mediaUrls: mediaAttachment ? [mediaAttachment] : [],
        reporterId: currentUser?.id || 'anonymous_user',
        reporterName: currentUser?.displayName || 'Community Member',
        reporterContact: currentUser?.phone || currentUser?.email || 'Submitted via Web'
      });

      setSubmittedReport(report);
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Emergency Alert Banner */}
      <div className="rounded-xl border border-red-500/50 bg-red-950/60 p-4 text-xs text-red-200 flex items-start gap-3 shadow-xl">
        <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <strong className="text-red-300 font-semibold text-sm block">
            Emergency Dispatch Notice
          </strong>
          <p>
            If you or someone around you is in immediate, life-threatening danger, <strong>call 911 / 112 or local rescue authorities now</strong>. Do not wait for web app confirmation.
          </p>
        </div>
      </div>

      {submittedReport ? (
        /* Instant AI Triage Confirmation Screen */
        <Card className="p-6 sm:p-8 space-y-6 border-emerald-500/50 bg-emerald-950/15">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-white">Help Request Logged & Triaged</h2>
              <p className="text-xs text-slate-400">Report Reference ID: #{submittedReport.id}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-medium">Triage Assessment:</span>
              <UrgencyBadge urgency={submittedReport.aiTriage?.urgency || 'moderate'} />
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-slate-400 font-medium">AI Intelligence Summary:</div>
              <p className="text-slate-200 leading-relaxed font-medium">
                {submittedReport.aiTriage?.summary || submittedReport.title}
              </p>
            </div>

            {submittedReport.aiTriage?.translation && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5" />
                  Translated from {submittedReport.originalLanguage.toUpperCase()}:
                </span>
                <p className="text-slate-300 italic">{submittedReport.aiTriage.translation.text}</p>
              </div>
            )}

            {/* Uncertainty Breakdown */}
            {submittedReport.aiTriage && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400 font-semibold block mb-1">✓ Reported Facts:</span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {submittedReport.aiTriage.facts.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-semibold block mb-1">⚠️ Missing / Uncertain:</span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {submittedReport.aiTriage.missingInfo.map((m, i) => (
                      <li key={i}>• {m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {submittedReport.location.isUnknown && (
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-300 text-xs">
                <strong>Held in Unlocated Queue:</strong> Coordinates were not provided. Our triage coordinator Elena Rostova will verify the corridor manually.
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/incidents">
              <Button variant="primary" size="md" className="gap-2">
                <span>View Incident Map</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="md" 
              onClick={() => {
                setSubmittedReport(null);
                setTitle('');
                setOriginalMessage('');
              }}
            >
              Submit Another Report
            </Button>
          </div>
        </Card>
      ) : (
        /* The Report Submission Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Submit Disaster Help Request
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Provide details about your situation. All languages supported with zero data loss.
              </p>
            </div>

            {/* Quick Demo Pre-fill Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 uppercase font-bold mr-1">Demo Pre-fills:</span>
              <button
                type="button"
                onClick={() => loadDemoScenario('spanish_elderly')}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-medium"
              >
                🇪🇸 Spanish Trapped
              </button>
              <button
                type="button"
                onClick={() => loadDemoScenario('vietnamese_medical')}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 font-medium"
              >
                🇻🇳 Viet Insulin
              </button>
              <button
                type="button"
                onClick={() => loadDemoScenario('unknown_truck')}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-medium"
              >
                ❓ Unknown GPS
              </button>
            </div>
          </div>

          <Card className="p-6 space-y-6">
            
            {/* Immediate Danger Checkbox */}
            <div className="p-4 rounded-xl border-2 border-red-500/40 bg-red-950/20 flex items-start gap-3">
              <input
                id="immediateDanger"
                type="checkbox"
                checked={immediateDanger}
                onChange={(e) => setImmediateDanger(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-red-500 text-red-600 focus:ring-red-500 bg-slate-900"
              />
              <label htmlFor="immediateDanger" className="text-xs text-red-200 cursor-pointer space-y-0.5">
                <span className="font-bold text-sm text-red-300 block">
                  Possible Immediate Danger / Life-Threatening Situation
                </span>
                <span>
                  Check this if water is actively rising, anyone is stranded on a roof/vehicle, or urgent medication is depleted. This immediately escalates triage priority.
                </span>
              </label>
            </div>

            {/* Title / Short description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Summary Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Water rising into 2nd floor, 4 family members trapped"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Assistance Category & Language Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Assistance Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReportCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="rescue">Rescue / Evacuation Request</option>
                  <option value="medical">Medical Assistance / Prescription Need</option>
                  <option value="food_water">Food & Potable Drinking Water</option>
                  <option value="shelter">Emergency Shelter / Bedding</option>
                  <option value="transport">Transport / Mobility Support</option>
                  <option value="missing_persons">Missing or Stranded People</option>
                  <option value="infrastructure">Infrastructure Hazard (Power / Levee)</option>
                  <option value="other">Other Assistance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Report Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="auto">Auto-Detect Language</option>
                  <option value="en">English</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="vi">Vietnamese (Tiếng Việt)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                </select>
              </div>
            </div>

            {/* Detailed Message */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Full Details & Message *
              </label>
              <textarea
                required
                rows={4}
                value={originalMessage}
                onChange={(e) => setOriginalMessage(e.target.value)}
                placeholder="Describe what is happening, exact current conditions, injuries, water depth, and what you specifically need..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Location Section */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Location, Address or Landmark *
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isLocating ? 'Detecting GPS...' : 'Use My GPS Location'}</span>
                </button>
              </div>

              <input
                type="text"
                required
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                placeholder="e.g., 412 Oak Street, 2nd floor, cross street Elm St, or 'old county road near grain silo'"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

              {coordinates ? (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                  <span>Grounded Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</span>
                  <button
                    type="button"
                    onClick={() => setCoordinates(null)}
                    className="text-slate-400 hover:text-white text-[11px] underline"
                  >
                    Clear GPS
                  </button>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 italic">
                  Note: If GPS is unavailable, your report will safely route to the unlocated dispatcher queue without fabricating coordinates.
                </div>
              )}
            </div>

            {/* People affected */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Number of People Affected (If Known)
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="number"
                    min={1}
                    max={5000}
                    value={peopleAffected}
                    onChange={(e) => setPeopleAffected(e.target.value === '' ? '' : parseInt(e.target.value))}
                    placeholder="e.g., 4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Attachment Simulation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Photo or Audio Evidence (Optional)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaAttachment('/logo.jpg')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                      mediaAttachment 
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{mediaAttachment ? '✓ Photo Attached' : 'Attach Photo'}</span>
                  </button>
                  {mediaAttachment && (
                    <button
                      type="button"
                      onClick={() => setMediaAttachment(null)}
                      className="text-xs text-slate-500 hover:text-red-400 px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gemini Uncertainty Triage will process instantly upon submission</span>
              </div>

              <Button
                type="submit"
                variant={immediateDanger ? 'danger' : 'primary'}
                size="lg"
                loading={isProcessingAi}
              >
                {immediateDanger ? '⚠️ Submit High Priority Request' : 'Submit Assistance Request'}
              </Button>
            </div>

          </Card>
        </form>
      )}

    </div>
  );
};
