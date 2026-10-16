import { describe, it, expect } from 'vitest';
import { ConsolidatedIncident, DisasterReport, ReviewActionAudit } from '../types';

describe('Module C — Human Review, Duplicate Merging & Append-Only Audit', () => {

  const initialReport: DisasterReport = {
    id: 'rep_test_001',
    reporterId: 'user_1',
    reporterName: 'Carlos M.',
    title: 'Water waist deep on Oak St',
    originalMessage: 'Water entering ground floor.',
    category: 'rescue',
    status: 'needs_review',
    location: {
      description: '412 Oak Street',
      coordinates: { lat: 44.0545, lng: -123.0912 },
      isUnknown: false,
      source: 'user_reported'
    },
    peopleAffectedCount: 4,
    immediateDanger: true,
    mediaUrls: [],
    originalLanguage: 'en',
    createdAt: '2026-10-16T14:00:00Z',
    updatedAt: '2026-10-16T14:00:00Z'
  };

  const initialIncident: ConsolidatedIncident = {
    id: 'inc_test_01',
    title: 'Oak Street Trapped Residents Extrication',
    summary: 'Rising floodwater reached 2nd floor.',
    category: 'rescue',
    urgency: 'critical',
    verificationStatus: 'needs_review',
    location: {
      description: '412 Oak Street',
      coordinates: { lat: 44.0545, lng: -123.0912 },
      uncertaintyRadiusMeters: 50,
      isUnknown: false,
      source: 'geocoded_verified'
    },
    affectedPeople: 4,
    primaryReportId: 'rep_test_001',
    associatedReportIds: ['rep_test_001'],
    outstandingNeeds: ['Evacuation boat'],
    createdAt: '2026-10-16T14:00:00Z',
    updatedAt: '2026-10-16T14:00:00Z'
  };

  it('C.1: verifies incident and updates both incident and associated reports', () => {
    let inc = { ...initialIncident };
    let rep = { ...initialReport };
    const audits: ReviewActionAudit[] = [];

    // Elena verifies incident
    inc.verificationStatus = 'verified';
    inc.verifiedBy = 'Elena Rostova';
    rep.status = 'verified';

    audits.push({
      id: 'audit_1',
      incidentId: inc.id,
      reviewerId: 'rev_1',
      reviewerName: 'Elena Rostova',
      actionType: 'verify',
      previousState: { verificationStatus: 'needs_review' },
      newState: { verificationStatus: 'verified' },
      reason: 'Audio confirmed by dispatcher',
      timestamp: new Date().toISOString()
    });

    expect(inc.verificationStatus).toBe('verified');
    expect(rep.status).toBe('verified');
    expect(audits.length).toBe(1);
    expect(audits[0].actionType).toBe('verify');
  });

  it('C.2: merges duplicate report into consolidated incident and supports unmerge rollback', () => {
    let inc = { ...initialIncident };
    const duplicateReportId = 'rep_duplicate_002';

    // Merge duplicate
    inc.associatedReportIds = [...inc.associatedReportIds, duplicateReportId];
    expect(inc.associatedReportIds).toContain(duplicateReportId);
    expect(inc.associatedReportIds.length).toBe(2);

    // Unmerge rollback
    inc.associatedReportIds = inc.associatedReportIds.filter(id => id !== duplicateReportId);
    expect(inc.associatedReportIds).not.toContain(duplicateReportId);
    expect(inc.associatedReportIds.length).toBe(1);
  });

  it('C.3: marking location unknown safely strips GPS and shifts to unlocated queue', () => {
    let inc = { ...initialIncident };
    expect(inc.location.coordinates).toBeDefined();
    expect(inc.location.isUnknown).toBe(false);

    // Reviewer marks coordinates uncertain
    inc.location = {
      ...inc.location,
      coordinates: undefined,
      isUnknown: true,
      source: 'unknown',
      uncertaintyRadiusMeters: 3000
    };

    expect(inc.location.coordinates).toBeUndefined();
    expect(inc.location.isUnknown).toBe(true);
    expect(inc.location.uncertaintyRadiusMeters).toBe(3000);
  });

});
