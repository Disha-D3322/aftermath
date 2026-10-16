import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ReportHelpPage } from './pages/ReportHelpPage';
import { IncidentListPage } from './pages/IncidentListPage';
import { IncidentDetailPage } from './pages/IncidentDetailPage';
import { ReviewQueuePage } from './pages/ReviewQueuePage';
import { ReviewDetailPage } from './pages/ReviewDetailPage';
import { VolunteerHubPage } from './pages/VolunteerHubPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { ImpactHubPage } from './pages/ImpactHubPage';
import { CorporatePortalPage } from './pages/CorporatePortalPage';
import { CorporateDashboardPage } from './pages/CorporateDashboardPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage, RegisterPage, DashboardPage } from './pages/AuthPages';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Module A: Reporting */}
                <Route path="/report" element={<ReportHelpPage />} />
                
                {/* Module D: Incident Map & Registry */}
                <Route path="/incidents" element={<IncidentListPage />} />
                <Route path="/incidents/:id" element={<IncidentDetailPage />} />
                
                {/* Module C: Reviewer Console */}
                <Route path="/review" element={<ReviewQueuePage />} />
                <Route path="/review/incidents/:id" element={<ReviewDetailPage />} />
                
                {/* Module E: Volunteer Portal */}
                <Route path="/volunteer" element={<VolunteerHubPage />} />
                <Route path="/volunteer/tasks/:id" element={<TaskDetailPage />} />
                
                {/* Module F: Verified Impact & Points */}
                <Route path="/impact" element={<ImpactHubPage />} />
                
                {/* Module G: Corporate Partnerships */}
                <Route path="/partners" element={<CorporatePortalPage />} />
                <Route path="/partners/dashboard" element={<CorporateDashboardPage />} />
                
                {/* Admin */}
                <Route path="/admin" element={<AdminPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
