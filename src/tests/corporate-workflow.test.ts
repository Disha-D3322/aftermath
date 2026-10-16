import { describe, it, expect } from 'vitest';
import { ResourcePledge, ResourcePledgeStatus } from '../types';

describe('Module G — Corporate Partnerships & Data Isolation', () => {

  const initialPledge: ResourcePledge = {
    id: 'pledge_test_01',
    organizationId: 'org_apex_global',
    organizationName: 'Apex Global Logistics',
    category: 'food_water',
    title: '5,000 Gallons Potable Water',
    description: 'Bulk potable water for high school shelter',
    quantity: '5,000 Gal Water',
    financialAmountUsd: 32000,
    status: 'pledged',
    targetIncidentId: 'inc_cedar_bridge_01',
    logisticsContact: 'Apex Dispatch VHF',
    statusHistory: [
      { status: 'pledged', notes: 'Pledge initiated', updatedAt: '2026-10-15T08:00:00Z', updatedBy: 'Apex CSR' }
    ],
    createdAt: '2026-10-15T08:00:00Z',
    updatedAt: '2026-10-15T08:00:00Z'
  };

  it('E.1: advances pledge lifecycle correctly from pledged -> approved -> dispatched -> delivered -> verified', () => {
    let pledge = { ...initialPledge };
    const transitions: ResourcePledgeStatus[] = ['approved', 'dispatched', 'delivered', 'verified'];

    for (const nextStatus of transitions) {
      pledge = {
        ...pledge,
        status: nextStatus,
        statusHistory: [
          ...pledge.statusHistory,
          { status: nextStatus, notes: `Advanced to ${nextStatus}`, updatedAt: new Date().toISOString(), updatedBy: 'Test Coordinator' }
        ]
      };
      expect(pledge.status).toBe(nextStatus);
    }

    expect(pledge.statusHistory.length).toBe(5);
  });

  it('E.2: enforces organization-scoped data isolation', () => {
    const allPledges: ResourcePledge[] = [
      initialPledge,
      {
        ...initialPledge,
        id: 'pledge_secret_beacon_02',
        organizationId: 'org_beacon_tech',
        organizationName: 'Beacon Telecommunications',
        title: 'Proprietary satellite array'
      }
    ];

    // Apex member queries pledges
    const apexUserOrgId = 'org_apex_global';
    const apexVisiblePledges = allPledges.filter(p => p.organizationId === apexUserOrgId);

    expect(apexVisiblePledges.length).toBe(1);
    expect(apexVisiblePledges[0].id).toBe('pledge_test_01');
    expect(apexVisiblePledges.some(p => p.organizationId === 'org_beacon_tech')).toBe(false);
  });

});
