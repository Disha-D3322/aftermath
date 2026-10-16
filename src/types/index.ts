export type UserRole = 'user' | 'reviewer' | 'coordinator' | 'corporate_partner' | 'admin';

export type ReportCategory = 
  | 'rescue' 
  | 'medical' 
  | 'food_water' 
  | 'shelter' 
  | 'transport' 
  | 'missing_persons' 
  | 'infrastructure' 
  | 'other';

export type ReportStatus = 
  | 'received' 
  | 'processing' 
  | 'needs_review' 
  | 'verified' 
  | 'assigned' 
  | 'in_progress' 
  | 'resolved' 
  | 'rejected' 
  | 'merged';

export type UrgencyLevel = 'critical' | 'high' | 'moderate' | 'low' | 'unknown';

export type VerificationStatus = 'unverified' | 'needs_review' | 'verified' | 'resolved' | 'dismissed';

export type TaskSafetyLevel = 'safe_remote' | 'community_low_risk' | 'specialized_approved';

export type TaskStatus = 
  | 'available' 
  | 'offered' 
  | 'accepted' 
  | 'in_progress' 
  | 'submitted_for_verification' 
  | 'completed' 
  | 'cancelled';

export type ResourcePledgeStatus = 'pledged' | 'approved' | 'dispatched' | 'delivered' | 'verified';

export type ResourceCategory = 
  | 'food_water' 
  | 'hygiene_kits' 
  | 'transport' 
  | 'equipment' 
  | 'shelter_supplies' 
  | 'financial' 
  | 'employee_volunteers' 
  | 'other';

export interface GroundedLocation {
  description: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  uncertaintyRadiusMeters?: number;
  isUnknown: boolean;
  source: 'user_reported' | 'geocoded_verified' | 'approximate_zone' | 'unknown';
}

export interface AiTriageResult {
  summary: string;
  originalLanguage: string;
  translation?: {
    language: string;
    text: string;
  } | null;
  category: ReportCategory;
  urgency: UrgencyLevel;
  urgencyExplanation: string;
  confidenceScore: number; // 0.0 - 1.0 calibrated
  facts: string[];
  inferences: string[];
  missingInfo: string[];
  contradictions: string[];
  reviewReasons: string[];
  suggestedDuplicateReportIds?: string[];
  extractedPeopleAffected?: number;
  groundedLocation: GroundedLocation;
  processedAt: string;
  isMockProvider: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  roles: UserRole[];
  currentRole: UserRole; // Active view capability
  isVolunteer: boolean;
  organizationId?: string; // If corporate partner
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerProfile {
  userId: string;
  isAvailable: boolean;
  skills: string[];
  languages: string[];
  serviceArea: {
    city: string;
    state: string;
    radiusKm: number;
    coordinates?: { lat: number; lng: number };
  };
  verifiedPoints: number;
  completedTaskCount: number;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    awardedAt: string;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DisasterReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterContact?: string;
  title: string;
  originalMessage: string;
  category: ReportCategory;
  status: ReportStatus;
  location: GroundedLocation;
  peopleAffectedCount: number | null;
  immediateDanger: boolean;
  mediaUrls: string[];
  originalLanguage: string;
  translation?: {
    language: string;
    text: string;
  } | null;
  aiTriage?: AiTriageResult | null;
  incidentId?: string | null;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsolidatedIncident {
  id: string;
  title: string;
  summary: string;
  category: ReportCategory;
  urgency: UrgencyLevel;
  verificationStatus: VerificationStatus;
  location: GroundedLocation;
  affectedPeople: number;
  primaryReportId: string;
  associatedReportIds: string[];
  outstandingNeeds: string[];
  assignedCoordinatorId?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewActionAudit {
  id: string;
  incidentId: string;
  reportId?: string;
  reviewerId: string;
  reviewerName: string;
  actionType: 
    | 'verify' 
    | 'correct_fields' 
    | 'merge_duplicates' 
    | 'unmerge' 
    | 'escalate' 
    | 'reject' 
    | 'mark_unknown_location' 
    | 'update_urgency';
  previousState: Record<string, any>;
  newState: Record<string, any>;
  reason: string;
  timestamp: string;
}

export interface VolunteerTask {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  requiredLanguages: string[];
  location: GroundedLocation;
  pointsAward: number;
  urgency: UrgencyLevel;
  safetyLevel: TaskSafetyLevel;
  status: TaskStatus;
  assignedVolunteerId?: string | null;
  coordinatorId: string;
  coordinatorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  volunteerId: string;
  volunteerName: string;
  status: TaskStatus;
  evidenceSubmission?: {
    notes: string;
    attachments: string[];
    submittedAt: string;
  };
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  createdAt: string;
}

export interface VerifiedContribution {
  id: string; // Idempotent key
  userId: string;
  taskId: string;
  taskTitle: string;
  contributionType: string;
  points: number;
  verificationSource: string;
  verifiedBy: string;
  timestamp: string;
}

export interface CorporateOrganization {
  id: string;
  name: string;
  industry: string;
  contactEmail: string;
  website: string;
  logoUrl?: string;
  description: string;
  totalPledgedUsd: number;
  totalDeliveredResourcesCount: number;
  employeeVolunteersActive: number;
  verified: boolean;
  createdAt: string;
}

export interface ResourcePledge {
  id: string;
  organizationId: string;
  organizationName: string;
  category: ResourceCategory;
  title: string;
  description: string;
  quantity: string;
  financialAmountUsd?: number | null;
  status: ResourcePledgeStatus;
  targetIncidentId?: string | null;
  targetIncidentTitle?: string | null;
  logisticsContact: string;
  statusHistory: Array<{
    status: ResourcePledgeStatus;
    notes: string;
    updatedAt: string;
    updatedBy: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  recipientUserId: string;
  title: string;
  message: string;
  type: 
    | 'report_update' 
    | 'clarification_needed' 
    | 'task_match' 
    | 'verification_success' 
    | 'points_awarded' 
    | 'pledge_update'
    | 'system_alert';
  link?: string;
  read: boolean;
  createdAt: string;
}
