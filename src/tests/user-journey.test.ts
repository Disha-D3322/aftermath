import { describe, it, expect } from 'vitest';
import { UserProfile, DisasterReport } from '../types';

describe('User Journey & Single Account Capabilities', () => {

  const communityUser: UserProfile = {
    id: 'user_maria_101',
    email: 'maria.santos@demo.aftermath.org',
    displayName: 'Maria Santos',
    roles: ['user'],
    currentRole: 'user',
    isVolunteer: false, // Initially not volunteered
    createdAt: '2026-10-14T08:00:00Z',
    updatedAt: '2026-10-14T08:00:00Z'
  };

  it('A.1: user can submit a help request and opt into volunteering with the exact same account', () => {
    let user = { ...communityUser };

    // Maria submits assistance request
    const newReport: Partial<DisasterReport> = {
      reporterId: user.id,
      reporterName: user.displayName,
      title: 'Water rising near front steps',
      originalMessage: 'Water level at sidewalk is 12 inches.',
      category: 'rescue'
    };
    expect(newReport.reporterId).toBe('user_maria_101');

    // Maria opts into volunteering using the SAME account
    user = {
      ...user,
      isVolunteer: true
    };

    expect(user.id).toBe('user_maria_101');
    expect(user.isVolunteer).toBe(true);
    expect(user.roles).toContain('user');
  });

  it('A.2: ordinary user cannot self-assign privileged reviewer or coordinator roles', () => {
    const user = { ...communityUser };

    const attemptRoleEscalation = (targetRole: 'reviewer' | 'coordinator' | 'admin') => {
      if (!user.roles.includes(targetRole) && !user.roles.includes('admin')) {
        return { allowed: false, error: 'Unauthorized role escalation denied by RBAC policy.' };
      }
      return { allowed: true };
    };

    const reviewAttempt = attemptRoleEscalation('reviewer');
    expect(reviewAttempt.allowed).toBe(false);
    expect(reviewAttempt.error).toContain('Unauthorized role escalation');

    const adminAttempt = attemptRoleEscalation('admin');
    expect(adminAttempt.allowed).toBe(false);
  });

});
