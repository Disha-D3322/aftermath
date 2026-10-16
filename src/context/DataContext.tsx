import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DisasterReport, 
  ConsolidatedIncident, 
  VolunteerTask, 
  VerifiedContribution, 
  CorporateOrganization, 
  ResourcePledge, 
  InAppNotification, 
  ReviewActionAudit,
  TaskStatus,
  ResourcePledgeStatus,
  VerificationStatus,
  UrgencyLevel
} from '../types';
import { 
  SEED_REPORTS, 
  SEED_INCIDENTS, 
  SEED_TASKS, 
  SEED_CONTRIBUTIONS, 
  SEED_ORGANIZATIONS, 
  SEED_PLEDGES, 
  SEED_NOTIFICATIONS, 
  SEED_REVIEW_ACTIONS 
} from '../lib/seedData';
import { triageDisasterReport } from '../lib/gemini';

interface DataContextType {
  reports: DisasterReport[];
  incidents: ConsolidatedIncident[];
  tasks: VolunteerTask[];
  contributions: VerifiedContribution[];
  organizations: CorporateOrganization[];
  pledges: ResourcePledge[];
  audits: ReviewActionAudit[];
  notifications: InAppNotification[];
  isProcessingAi: boolean;
  
  // Action Handlers
  submitReport: (reportData: {
    title: string;
    originalMessage: string;
    category: DisasterReport['category'];
    locationDescription: string;
    address?: string;
    coordinates?: { lat: number; lng: number };
    peopleAffectedCount?: number | null;
    immediateDanger: boolean;
    mediaUrls?: string[];
    reporterId: string;
    reporterName: string;
    reporterContact?: string;
  }) => Promise<DisasterReport>;

  verifyIncident: (incidentId: string, reviewerName: string, notes: string) => void;
  correctIncidentFields: (incidentId: string, updates: Partial<ConsolidatedIncident>, reviewerName: string, reason: string) => void;
  mergeIncidents: (primaryIncidentId: string, reportIdToMerge: string, reviewerName: string, reason: string) => void;
  unmergeIncident: (primaryIncidentId: string, reportIdToUnmerge: string, reviewerName: string, reason: string) => void;
  markLocationUnknown: (incidentId: string, reviewerName: string, reason: string) => void;
  rejectReport: (reportId: string, reviewerName: string, reason: string) => void;
  
  // Volunteer & Tasks
  createTask: (task: Omit<VolunteerTask, 'id' | 'createdAt' | 'updatedAt'>) => VolunteerTask;
  acceptTask: (taskId: string, volunteerId: string, volunteerName: string) => boolean;
  declineTask: (taskId: string, volunteerId: string) => void;
  submitTaskVerification: (taskId: string, notes: string) => void;
  verifyTaskAndAwardPoints: (
    taskId: string, 
    volunteerId: string, 
    pointsAwarded: number, 
    coordinatorName: string,
    onSuccessPointsAwarded?: (pts: number) => void
  ) => { success: boolean; message: string };

  // Corporate & Pledges
  createResourcePledge: (pledge: Omit<ResourcePledge, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => ResourcePledge;
  updatePledgeStatus: (pledgeId: string, newStatus: ResourcePledgeStatus, notes: string, updatedBy: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // System / Demo reset
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<DisasterReport[]>(() => {
    const s = localStorage.getItem('aftermath_reports');
    return s ? JSON.parse(s) : SEED_REPORTS;
  });

  const [incidents, setIncidents] = useState<ConsolidatedIncident[]>(() => {
    const s = localStorage.getItem('aftermath_incidents');
    return s ? JSON.parse(s) : SEED_INCIDENTS;
  });

  const [tasks, setTasks] = useState<VolunteerTask[]>(() => {
    const s = localStorage.getItem('aftermath_tasks');
    return s ? JSON.parse(s) : SEED_TASKS;
  });

  const [contributions, setContributions] = useState<VerifiedContribution[]>(() => {
    const s = localStorage.getItem('aftermath_contributions');
    return s ? JSON.parse(s) : SEED_CONTRIBUTIONS;
  });

  const [organizations, setOrganizations] = useState<CorporateOrganization[]>(() => {
    const s = localStorage.getItem('aftermath_organizations');
    return s ? JSON.parse(s) : SEED_ORGANIZATIONS;
  });

  const [pledges, setPledges] = useState<ResourcePledge[]>(() => {
    const s = localStorage.getItem('aftermath_pledges');
    return s ? JSON.parse(s) : SEED_PLEDGES;
  });

  const [audits, setAudits] = useState<ReviewActionAudit[]>(() => {
    const s = localStorage.getItem('aftermath_audits');
    return s ? JSON.parse(s) : SEED_REVIEW_ACTIONS;
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const s = localStorage.getItem('aftermath_notifications');
    return s ? JSON.parse(s) : SEED_NOTIFICATIONS;
  });

  const [isProcessingAi, setIsProcessingAi] = useState(false);

  // Sync to local storage
  useEffect(() => { localStorage.setItem('aftermath_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('aftermath_incidents', JSON.stringify(incidents)); }, [incidents]);
  useEffect(() => { localStorage.setItem('aftermath_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('aftermath_contributions', JSON.stringify(contributions)); }, [contributions]);
  useEffect(() => { localStorage.setItem('aftermath_organizations', JSON.stringify(organizations)); }, [organizations]);
  useEffect(() => { localStorage.setItem('aftermath_pledges', JSON.stringify(pledges)); }, [pledges]);
  useEffect(() => { localStorage.setItem('aftermath_audits', JSON.stringify(audits)); }, [audits]);
  useEffect(() => { localStorage.setItem('aftermath_notifications', JSON.stringify(notifications)); }, [notifications]);

  // Submit help request with uncertainty AI triage
  const submitReport = async (reportData: {
    title: string;
    originalMessage: string;
    category: DisasterReport['category'];
    locationDescription: string;
    address?: string;
    coordinates?: { lat: number; lng: number };
    peopleAffectedCount?: number | null;
    immediateDanger: boolean;
    mediaUrls?: string[];
    reporterId: string;
    reporterName: string;
    reporterContact?: string;
  }): Promise<DisasterReport> => {
    setIsProcessingAi(true);

    const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const isLocationUnknown = !reportData.coordinates;

    const baseReport: DisasterReport = {
      id: reportId,
      reporterId: reportData.reporterId,
      reporterName: reportData.reporterName,
      reporterContact: reportData.reporterContact,
      title: reportData.title,
      originalMessage: reportData.originalMessage,
      category: reportData.category,
      status: 'received',
      location: {
        description: reportData.locationDescription,
        address: reportData.address,
        coordinates: reportData.coordinates,
        uncertaintyRadiusMeters: isLocationUnknown ? 2500 : 50,
        isUnknown: isLocationUnknown,
        source: isLocationUnknown ? 'unknown' : 'user_reported'
      },
      peopleAffectedCount: reportData.peopleAffectedCount ?? null,
      immediateDanger: reportData.immediateDanger,
      mediaUrls: reportData.mediaUrls || [],
      originalLanguage: 'en',
      createdAt: now,
      updatedAt: now
    };

    // Run AI triage
    let triageResult = null;
    try {
      triageResult = await triageDisasterReport(baseReport, incidents);
    } catch (err) {
      console.warn('AI Triage error (retaining report safely):', err);
    }

    const finalReport: DisasterReport = {
      ...baseReport,
      status: 'needs_review',
      originalLanguage: triageResult?.originalLanguage || 'en',
      translation: triageResult?.translation || null,
      aiTriage: triageResult
    };

    setReports(prev => [finalReport, ...prev]);

    // Push in-app alert for high/critical urgency
    if (finalReport.immediateDanger || triageResult?.urgency === 'critical') {
      const urgentAlert: InAppNotification = {
        id: `notif_${Date.now()}`,
        recipientUserId: 'reviewer_elena_202',
        title: '⚠️ CRITICAL Urgent Intake Alert',
        message: `High life-safety report received: "${finalReport.title}" requires immediate review.`,
        type: 'report_update',
        link: `/review/incidents/${finalReport.id}`,
        read: false,
        createdAt: now
      };
      setNotifications(prev => [urgentAlert, ...prev]);
    }

    setIsProcessingAi(false);
    return finalReport;
  };

  const verifyIncident = (incidentId: string, reviewerName: string, notes: string) => {
    const inc = incidents.find(i => i.id === incidentId);
    if (!inc) return;

    const now = new Date().toISOString();
    const prevStatus = inc.verificationStatus;

    setIncidents(prev => prev.map(i => {
      if (i.id === incidentId) {
        return {
          ...i,
          verificationStatus: 'verified',
          verifiedBy: reviewerName,
          verifiedAt: now,
          resolutionNotes: notes,
          updatedAt: now
        };
      }
      return i;
    }));

    // Update associated reports to verified
    setReports(prev => prev.map(r => {
      if (inc.associatedReportIds.includes(r.id)) {
        return { ...r, status: 'verified', updatedAt: now };
      }
      return r;
    }));

    // Append audit
    const audit: ReviewActionAudit = {
      id: `audit_${Date.now()}`,
      incidentId,
      reviewerId: 'reviewer_elena_202',
      reviewerName,
      actionType: 'verify',
      previousState: { verificationStatus: prevStatus },
      newState: { verificationStatus: 'verified', notes },
      reason: notes || 'Confirmed by authorized reviewer.',
      timestamp: now
    };
    setAudits(prev => [audit, ...prev]);
  };

  const correctIncidentFields = (
    incidentId: string, 
    updates: Partial<ConsolidatedIncident>, 
    reviewerName: string, 
    reason: string
  ) => {
    const inc = incidents.find(i => i.id === incidentId);
    if (!inc) return;

    const now = new Date().toISOString();
    const prev = { ...inc };

    setIncidents(prevInc => prevInc.map(i => {
      if (i.id === incidentId) {
        return { ...i, ...updates, updatedAt: now };
      }
      return i;
    }));

    const audit: ReviewActionAudit = {
      id: `audit_${Date.now()}`,
      incidentId,
      reviewerId: 'reviewer_elena_202',
      reviewerName,
      actionType: 'correct_fields',
      previousState: prev,
      newState: updates,
      reason,
      timestamp: now
    };
    setAudits(prev => [audit, ...prev]);
  };

  const mergeIncidents = (
    primaryIncidentId: string, 
    reportIdToMerge: string, 
    reviewerName: string, 
    reason: string
  ) => {
    const primary = incidents.find(i => i.id === primaryIncidentId);
    if (!primary) return;

    const now = new Date().toISOString();
    const prevAssociated = [...primary.associatedReportIds];

    if (!prevAssociated.includes(reportIdToMerge)) {
      setIncidents(prev => prev.map(i => {
        if (i.id === primaryIncidentId) {
          return {
            ...i,
            associatedReportIds: [...i.associatedReportIds, reportIdToMerge],
            updatedAt: now
          };
        }
        return i;
      }));

      setReports(prev => prev.map(r => {
        if (r.id === reportIdToMerge) {
          return {
            ...r,
            status: 'merged',
            incidentId: primaryIncidentId,
            updatedAt: now
          };
        }
        return r;
      }));

      const audit: ReviewActionAudit = {
        id: `audit_${Date.now()}`,
        incidentId: primaryIncidentId,
        reportId: reportIdToMerge,
        reviewerId: 'reviewer_elena_202',
        reviewerName,
        actionType: 'merge_duplicates',
        previousState: { associatedReportIds: prevAssociated },
        newState: { associatedReportIds: [...prevAssociated, reportIdToMerge] },
        reason,
        timestamp: now
      };
      setAudits(prev => [audit, ...prev]);
    }
  };

  const unmergeIncident = (
    primaryIncidentId: string, 
    reportIdToUnmerge: string, 
    reviewerName: string, 
    reason: string
  ) => {
    const primary = incidents.find(i => i.id === primaryIncidentId);
    if (!primary) return;

    const now = new Date().toISOString();
    setIncidents(prev => prev.map(i => {
      if (i.id === primaryIncidentId) {
        return {
          ...i,
          associatedReportIds: i.associatedReportIds.filter(id => id !== reportIdToUnmerge),
          updatedAt: now
        };
      }
      return i;
    }));

    setReports(prev => prev.map(r => {
      if (r.id === reportIdToUnmerge) {
        return {
          ...r,
          status: 'needs_review',
          incidentId: null,
          updatedAt: now
        };
      }
      return r;
    }));

    const audit: ReviewActionAudit = {
      id: `audit_${Date.now()}`,
      incidentId: primaryIncidentId,
      reportId: reportIdToUnmerge,
      reviewerId: 'reviewer_elena_202',
      reviewerName,
      actionType: 'unmerge',
      previousState: { associatedReportIds: primary.associatedReportIds },
      newState: { associatedReportIds: primary.associatedReportIds.filter(id => id !== reportIdToUnmerge) },
      reason,
      timestamp: now
    };
    setAudits(prev => [audit, ...prev]);
  };

  const markLocationUnknown = (incidentId: string, reviewerName: string, reason: string) => {
    const now = new Date().toISOString();
    setIncidents(prev => prev.map(i => {
      if (i.id === incidentId) {
        return {
          ...i,
          location: {
            ...i.location,
            coordinates: undefined,
            isUnknown: true,
            source: 'unknown',
            uncertaintyRadiusMeters: 3000
          },
          updatedAt: now
        };
      }
      return i;
    }));

    const audit: ReviewActionAudit = {
      id: `audit_${Date.now()}`,
      incidentId,
      reviewerId: 'reviewer_elena_202',
      reviewerName,
      actionType: 'mark_unknown_location',
      previousState: { isUnknown: false },
      newState: { isUnknown: true },
      reason,
      timestamp: now
    };
    setAudits(prev => [audit, ...prev]);
  };

  const rejectReport = (reportId: string, reviewerName: string, reason: string) => {
    const now = new Date().toISOString();
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'rejected',
          rejectionReason: reason,
          updatedAt: now
        };
      }
      return r;
    }));

    const audit: ReviewActionAudit = {
      id: `audit_${Date.now()}`,
      incidentId: 'none',
      reportId,
      reviewerId: 'reviewer_elena_202',
      reviewerName,
      actionType: 'reject',
      previousState: { status: 'needs_review' },
      newState: { status: 'rejected', reason },
      reason,
      timestamp: now
    };
    setAudits(prev => [audit, ...prev]);
  };

  // Volunteer Task handling
  const createTask = (taskData: Omit<VolunteerTask, 'id' | 'createdAt' | 'updatedAt'>): VolunteerTask => {
    const now = new Date().toISOString();
    const newTask: VolunteerTask = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      createdAt: now,
      updatedAt: now
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const acceptTask = (taskId: string, volunteerId: string, volunteerName: string): boolean => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask || targetTask.status !== 'available') {
      return false;
    }

    const now = new Date().toISOString();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'in_progress',
          assignedVolunteerId: volunteerId,
          updatedAt: now
        };
      }
      return t;
    }));

    const notif: InAppNotification = {
      id: `notif_${Date.now()}`,
      recipientUserId: volunteerId,
      title: 'Task Accepted',
      message: `You accepted "${targetTask.title}". Check details in your Volunteer Hub.`,
      type: 'task_match',
      link: `/volunteer/tasks/${taskId}`,
      read: false,
      createdAt: now
    };
    setNotifications(prev => [notif, ...prev]);
    return true;
  };

  const declineTask = (taskId: string, volunteerId: string) => {
    const now = new Date().toISOString();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.assignedVolunteerId === volunteerId) {
        return {
          ...t,
          status: 'available',
          assignedVolunteerId: null,
          updatedAt: now
        };
      }
      return t;
    }));
  };

  const submitTaskVerification = (taskId: string, notes: string) => {
    const now = new Date().toISOString();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'submitted_for_verification',
          updatedAt: now
        };
      }
      return t;
    }));
  };

  // IDEMPOTENT verified point award engine
  const verifyTaskAndAwardPoints = (
    taskId: string, 
    volunteerId: string, 
    pointsAwarded: number, 
    coordinatorName: string,
    onSuccessPointsAwarded?: (pts: number) => void
  ): { success: boolean; message: string } => {
    const existing = contributions.find(c => c.taskId === taskId && c.userId === volunteerId);
    if (existing) {
      return { 
        success: false, 
        message: `Idempotency Check: Points already awarded on ${new Date(existing.timestamp).toLocaleDateString()} (ID: ${existing.id}). Cannot double-claim points.` 
      };
    }

    const task = tasks.find(t => t.id === taskId);
    const now = new Date().toISOString();

    const contributionId = `contrib_${volunteerId}_${taskId}`;
    const newContribution: VerifiedContribution = {
      id: contributionId,
      userId: volunteerId,
      taskId,
      taskTitle: task?.title || 'Relief Contribution',
      contributionType: task?.category || 'Community Support',
      points: pointsAwarded,
      verificationSource: `Authorized Signoff: ${coordinatorName}`,
      verifiedBy: coordinatorName,
      timestamp: now
    };

    setContributions(prev => [newContribution, ...prev]);

    // Mark task completed
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'completed', updatedAt: now };
      }
      return t;
    }));

    // In-App Notification
    const notif: InAppNotification = {
      id: `notif_${Date.now()}`,
      recipientUserId: volunteerId,
      title: `🎉 +${pointsAwarded} Impact Points Verified!`,
      message: `Your task "${task?.title}" was approved by ${coordinatorName}.`,
      type: 'points_awarded',
      link: '/impact',
      read: false,
      createdAt: now
    };
    setNotifications(prev => [notif, ...prev]);

    if (onSuccessPointsAwarded) {
      onSuccessPointsAwarded(pointsAwarded);
    }

    return { 
      success: true, 
      message: `Successfully verified contribution and credited ${pointsAwarded} points (Ref: ${contributionId}).` 
    };
  };

  // Corporate Pledges
  const createResourcePledge = (
    pledgeData: Omit<ResourcePledge, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>
  ): ResourcePledge => {
    const now = new Date().toISOString();
    const newPledge: ResourcePledge = {
      ...pledgeData,
      id: `pledge_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: pledgeData.status,
          notes: 'Initial commitment pledge created.',
          updatedAt: now,
          updatedBy: pledgeData.organizationName
        }
      ]
    };
    setPledges(prev => [newPledge, ...prev]);
    return newPledge;
  };

  const updatePledgeStatus = (
    pledgeId: string, 
    newStatus: ResourcePledgeStatus, 
    notes: string, 
    updatedBy: string
  ) => {
    const now = new Date().toISOString();
    setPledges(prev => prev.map(p => {
      if (p.id === pledgeId) {
        return {
          ...p,
          status: newStatus,
          updatedAt: now,
          statusHistory: [
            ...p.statusHistory,
            { status: newStatus, notes, updatedAt: now, updatedBy }
          ]
        };
      }
      return p;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const resetDemoData = () => {
    setReports(SEED_REPORTS);
    setIncidents(SEED_INCIDENTS);
    setTasks(SEED_TASKS);
    setContributions(SEED_CONTRIBUTIONS);
    setOrganizations(SEED_ORGANIZATIONS);
    setPledges(SEED_PLEDGES);
    setAudits(SEED_REVIEW_ACTIONS);
    setNotifications(SEED_NOTIFICATIONS);
    localStorage.removeItem('aftermath_reports');
    localStorage.removeItem('aftermath_incidents');
    localStorage.removeItem('aftermath_tasks');
    localStorage.removeItem('aftermath_contributions');
    localStorage.removeItem('aftermath_organizations');
    localStorage.removeItem('aftermath_pledges');
    localStorage.removeItem('aftermath_audits');
    localStorage.removeItem('aftermath_notifications');
  };

  return (
    <DataContext.Provider
      value={{
        reports,
        incidents,
        tasks,
        contributions,
        organizations,
        pledges,
        audits,
        notifications,
        isProcessingAi,
        submitReport,
        verifyIncident,
        correctIncidentFields,
        mergeIncidents,
        unmergeIncident,
        markLocationUnknown,
        rejectReport,
        createTask,
        acceptTask,
        declineTask,
        submitTaskVerification,
        verifyTaskAndAwardPoints,
        createResourcePledge,
        updatePledgeStatus,
        markNotificationRead,
        clearNotifications,
        resetDemoData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
