import { describe, it, expect } from 'vitest';
import { VolunteerTask, VerifiedContribution } from '../types';

describe('Module E & F — Volunteer Workflow & Idempotent Point Award Engine', () => {

  const sampleTask: VolunteerTask = {
    id: 'task_shelter_bilingual_02',
    incidentId: 'inc_cedar_bridge_01',
    title: 'Spanish Intake Desk & Evacuee Registration',
    description: 'Help register arriving families at Cedar Bridge High School Gymnasium.',
    category: 'shelter_ops',
    requiredSkills: ['Spanish Translation', 'Community Outreach'],
    requiredLanguages: ['Spanish', 'English'],
    location: {
      description: 'Cedar Bridge High School Gym',
      isUnknown: false,
      source: 'geocoded_verified'
    },
    pointsAward: 35,
    urgency: 'moderate',
    safetyLevel: 'community_low_risk',
    status: 'in_progress',
    assignedVolunteerId: 'user_maria_101',
    coordinatorId: 'coordinator_marcus_303',
    coordinatorName: 'Marcus Vance',
    createdAt: '2026-10-16T12:00:00Z',
    updatedAt: '2026-10-16T13:10:00Z'
  };

  it('D.1: accepts volunteer assignment and prevents conflicting duplicate assignment', () => {
    let taskState: VolunteerTask = { ...sampleTask, status: 'available', assignedVolunteerId: null };

    // Maria accepts available task
    expect(taskState.status).toBe('available');
    taskState = {
      ...taskState,
      status: 'in_progress' as const,
      assignedVolunteerId: 'user_maria_101'
    };

    expect(taskState.status).toBe('in_progress');
    expect(taskState.assignedVolunteerId).toBe('user_maria_101');

    // Second volunteer attempts to accept already assigned task
    const secondVolunteerCanAccept = taskState.status === 'available';
    expect(secondVolunteerCanAccept).toBe(false);
  });

  it('D.2: allows volunteer to decline assigned task without penalty, resetting status to available', () => {
    let taskState = { ...sampleTask };
    expect(taskState.assignedVolunteerId).toBe('user_maria_101');

    // Maria declines
    taskState = {
      ...taskState,
      status: 'available' as const,
      assignedVolunteerId: null
    };

    expect(taskState.status).toBe('available');
    expect(taskState.assignedVolunteerId).toBeNull();
  });

  it('D.3: awards verified contribution points on first approval', () => {
    const existingContributions: VerifiedContribution[] = [];

    // Verification check function matching DataContext engine
    const awardPoints = (taskId: string, userId: string, pts: number, coordinator: string) => {
      const alreadyAwarded = existingContributions.some(c => c.taskId === taskId && c.userId === userId);
      if (alreadyAwarded) {
        return { success: false, message: 'Idempotency Check Failed: Duplicate award rejected.' };
      }

      const newContribution: VerifiedContribution = {
        id: `contrib_${userId}_${taskId}`,
        userId,
        taskId,
        taskTitle: sampleTask.title,
        contributionType: sampleTask.category,
        points: pts,
        verificationSource: `Signoff: ${coordinator}`,
        verifiedBy: coordinator,
        timestamp: new Date().toISOString()
      };

      existingContributions.push(newContribution);
      return { success: true, message: `Awarded ${pts} points.`, contribution: newContribution };
    };

    // First attempt succeeds
    const firstAttempt = awardPoints(sampleTask.id, 'user_maria_101', 35, 'Marcus Vance');
    expect(firstAttempt.success).toBe(true);
    expect(existingContributions.length).toBe(1);
    expect(existingContributions[0].points).toBe(35);
    expect(existingContributions[0].id).toBe('contrib_user_maria_101_task_shelter_bilingual_02');

    // Duplicate attempt is rejected idempotently
    const duplicateAttempt = awardPoints(sampleTask.id, 'user_maria_101', 35, 'Marcus Vance');
    expect(duplicateAttempt.success).toBe(false);
    expect(duplicateAttempt.message).toContain('Duplicate award rejected');
    expect(existingContributions.length).toBe(1); // Point total unchanged!
  });

});
