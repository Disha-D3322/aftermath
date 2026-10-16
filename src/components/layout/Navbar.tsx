import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AlertTriangle, 
  MapPin, 
  HandHelping, 
  Award, 
  ClipboardCheck, 
  Building2, 
  Bell, 
  Menu, 
  X, 
  CheckCircle2, 
  User, 
  ShieldAlert, 
  RotateCcw, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui';

export const Navbar: React.FC = () => {
  const { currentUser, volunteerProfile, switchUser, switchRole, toggleVolunteerStatus, availableUsers } = useAuth();
  const { notifications, markNotificationRead, resetDemoData } = useData();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const navLinks = [
    { name: 'Live Incidents', path: '/incidents', icon: MapPin },
    { name: 'Request Assistance', path: '/report', icon: AlertTriangle, highlight: true },
    { name: 'Volunteer Portal', path: '/volunteer', icon: HandHelping },
    { name: 'Verified Impact', path: '/impact', icon: Award },
    { name: 'Review Console', path: '/review', icon: ClipboardCheck, privileged: ['reviewer', 'coordinator', 'admin'] },
    { name: 'Corporate Partners', path: '/partners', icon: Building2 },
  ];

  const filteredLinks = navLinks.filter(link => {
    if (!link.privileged) return true;
    return currentUser?.roles.some(r => link.privileged?.includes(r));
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Emergency Guidance Top Banner */}
      <div className="bg-red-950/80 border-b border-red-800/40 px-4 py-1.5 text-xs text-red-200 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse flex-shrink-0" />
          <span>
            <strong>LIFE THREATENING EMERGENCY?</strong> Please dial <strong>911 / 112</strong> or your local emergency dispatch immediately. AfterMath coordinates humanitarian community assistance.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-emerald-500/40 bg-black flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:border-emerald-400 transition-all">
              <img 
                src="/logo.jpg" 
                alt="AfterMath Ripple Contour" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  After<span className="text-emerald-400">Math</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI Triage
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Disaster Intelligence & Volunteer Coordination
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {filteredLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    link.highlight 
                      ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30' 
                      : isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight ? 'text-red-400' : isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Persona Switcher & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Persona Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleModal(!showRoleModal)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-200 transition-colors"
                title="Switch persona for evaluation"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-medium max-w-[120px] truncate">
                  {currentUser?.displayName || 'User'}
                </span>
                <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-400 uppercase font-semibold">
                  {currentUser?.currentRole}
                </span>
              </button>

              {/* Persona Selector Modal / Popover */}
              {showRoleModal && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Hackathon Evaluation Personas
                    </span>
                    <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {availableUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUser(user.id);
                          setShowRoleModal(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg transition-colors flex items-start justify-between ${
                          user.id === currentUser?.id 
                            ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200' 
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-slate-100">{user.displayName}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{user.roles.join(', ')}</div>
                        </div>
                        {user.id === currentUser?.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        resetDemoData();
                        setShowRoleModal(false);
                      }}
                      className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Demo Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Volunteer Opt-in / Status Pill */}
            {currentUser && (
              <button
                onClick={toggleVolunteerStatus}
                className={`hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                  currentUser.isVolunteer
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
                title="Single account: Toggle volunteer readiness"
              >
                <span className={`w-2 h-2 rounded-full ${currentUser.isVolunteer ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{currentUser.isVolunteer ? 'Volunteer Ready' : 'Volunteer Off'}</span>
              </button>
            )}

            {/* In-App Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-slate-950">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="font-semibold text-xs text-slate-200">Notifications</span>
                    <span className="text-[10px] text-emerald-400">{unreadNotifs.length} unread</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1.5">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 6).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            notif.read ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-800/80 text-slate-200 border border-slate-700/50'
                          }`}
                        >
                          <div className="font-medium text-slate-100 flex items-center justify-between">
                            <span>{notif.title}</span>
                            <span className="text-[9px] text-slate-500">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[11px] mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {filteredLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={toggleVolunteerStatus}
              className="w-full text-left px-3 py-2 text-sm text-emerald-400 font-medium"
            >
              {currentUser?.isVolunteer ? '✓ Volunteer Mode Active' : '+ Opt-in to Volunteer'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
