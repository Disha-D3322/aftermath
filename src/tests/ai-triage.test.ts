import { describe, it, expect } from 'vitest';
import { runMockAiTriage, computeHaversineDistance, triageDisasterReport, AiTriageOutputSchema } from '../lib/gemini';
import { DisasterReport, ConsolidatedIncident } from '../types';

describe('Module B — AI Disaster Intelligence & Uncertainty Triage', () => {

  const existingIncidents: ConsolidatedIncident[] = [
    {
      id: 'inc_oak_street_rescue_01',
      title: 'Oak Street Trapped Elderly & Residents Extrication',
      summary: 'Rising floodwater reached 2nd floor at 412 Oak St; 4-5 individuals trapped.',
      category: 'rescue',
      urgency: 'critical',
      verificationStatus: 'verified',
      location: {
        description: '412 Oak Street',
        coordinates: { lat: 44.0545, lng: -123.0912 },
        uncertaintyRadiusMeters: 50,
        isUnknown: false,
        source: 'user_reported'
      },
      affectedPeople: 4,
      primaryReportId: 'rep_flood_esp_001',
      associatedReportIds: ['rep_flood_esp_001'],
      outstandingNeeds: ['Evacuation boat'],
      createdAt: '2026-10-16T14:00:00Z',
      updatedAt: '2026-10-16T14:05:00Z'
    }
  ];

  it('B.1: accurately triages Spanish distress report with translation and critical urgency', () => {
    const spanishReport: Partial<DisasterReport> = {
      title: 'Agua subiendo rápido al segundo piso, abuelos atrapados',
      originalMessage: '¡Por favor ayuda! El agua del río ya cubrió la planta baja en Calle del Roble 412. Mis abuelos están en el segundo piso y no pueden bajar las escaleras. Se cortó la luz. Somos 4 personas.',
      category: 'rescue',
      peopleAffectedCount: 4,
      immediateDanger: true,
      location: {
        description: '412 Oak Street (Calle del Roble)',
        coordinates: { lat: 44.0545, lng: -123.0912 },
        isUnknown: false,
        source: 'user_reported'
      }
    };

    const result = runMockAiTriage(spanishReport, []);

    expect(result.originalLanguage).toBe('es');
    expect(result.translation?.language).toBe('en');
    expect(result.translation?.text).toContain('412 Oak Street');
    expect(result.category).toBe('rescue');
    expect(result.urgency).toBe('critical');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.9);
    expect(result.facts.some(f => f.includes('4 person(s)'))).toBe(true);

    // Schema validation test
    const parsed = AiTriageOutputSchema.safeParse(result);
    expect(parsed.success).toBe(true);
  });

  it('B.2: surfaces uncertainty and never fabricates coordinates when location is unknown', () => {
    const uncertainReport: Partial<DisasterReport> = {
      title: 'Stranded in truck near the levee bypass road, water rushing',
      originalMessage: 'Water just pushed my pickup into the trees. I cannot see street signs. It is somewhere between the grain silo and the blue river bridge on old county route. Battery dying.',
      category: 'rescue',
      peopleAffectedCount: 1,
      immediateDanger: true,
      location: {
        description: 'Between grain silo and blue bridge on old county route',
        coordinates: undefined, // Unknown GPS
        isUnknown: true,
        source: 'unknown'
      }
    };

    const result = runMockAiTriage(uncertainReport, []);

    // Urgency remains critical because life safety is threatened, despite low confidence!
    expect(result.urgency).toBe('critical');
    expect(result.groundedLocation.isUnknown).toBe(true);
    expect(result.groundedLocation.coordinates).toBeUndefined();
    expect(result.groundedLocation.uncertaintyRadiusMeters).toBeGreaterThanOrEqual(2000);
    expect(result.reviewReasons.some(r => r.includes('DO NOT INVENT COORDINATES'))).toBe(true);
  });

  it('B.3: detects duplicates and identifies contradictions against existing incidents', () => {
    const neighboringReport: Partial<DisasterReport> = {
      title: 'Oak Street flooded, elderly neighbors trapped next door',
      originalMessage: 'Water is waist high on Oak St near 414 / 412. I paddled out on a kayak. The elderly couple at 412 are shouting from second floor window. There may be 5 people inside now.',
      category: 'rescue',
      peopleAffectedCount: 5,
      immediateDanger: true,
      location: {
        description: '412-414 Oak Street',
        coordinates: { lat: 44.0547, lng: -123.0909 }, // ~30 meters away from 412 Oak St!
        isUnknown: false,
        source: 'user_reported'
      }
    };

    const result = runMockAiTriage(neighboringReport, existingIncidents);

    expect(result.suggestedDuplicateReportIds).toContain('rep_flood_esp_001');
    expect(result.contradictions.some(c => c.includes('Matches spatial corridor'))).toBe(true);
    expect(result.reviewReasons.some(r => r.includes('duplicate consolidation'))).toBe(true);
  });

  it('B.4: haversine distance calculation is accurate for spatial duplicate clustering', () => {
    // Distance between 44.0545, -123.0912 and 44.0547, -123.0909 is ~32 meters (0.032 km)
    const dist = computeHaversineDistance(44.0545, -123.0912, 44.0547, -123.0909);
    expect(dist).toBeLessThan(0.1); // less than 100 meters
  });

  it('B.5: AI pipeline gracefully falls back to deterministic local triage without throwing or dropping reports', async () => {
    const report: Partial<DisasterReport> = {
      title: 'Power line down across creek bridge',
      originalMessage: 'Live electrical cable sparked into the flooded creek near 5th ave bridge.',
      category: 'infrastructure',
      immediateDanger: false,
      location: {
        description: '5th Ave Creek Bridge',
        isUnknown: true,
        source: 'unknown'
      }
    };

    // When API key is not provided or live API is bypassed, triage succeeds with mock engine
    const result = await triageDisasterReport(report, []);
    expect(result).toBeDefined();
    expect(result.category).toBe('infrastructure');
    expect(result.isMockProvider).toBe(true);
  });

});
