import { z } from 'zod';
import { 
  DisasterReport, 
  ConsolidatedIncident, 
  AiTriageResult, 
  ReportCategory, 
  UrgencyLevel, 
  GroundedLocation 
} from '../types';

// Runtime Zod schema for validated AI triage output
export const AiTriageOutputSchema = z.object({
  summary: z.string().min(5),
  originalLanguage: z.string().min(2),
  translation: z.object({
    language: z.string(),
    text: z.string(),
  }).nullable().optional(),
  category: z.enum([
    'rescue',
    'medical',
    'food_water',
    'shelter',
    'transport',
    'missing_persons',
    'infrastructure',
    'other'
  ]),
  urgency: z.enum(['critical', 'high', 'moderate', 'low', 'unknown']),
  urgencyExplanation: z.string().min(5),
  confidenceScore: z.number().min(0).max(1),
  facts: z.array(z.string()),
  inferences: z.array(z.string()),
  missingInfo: z.array(z.string()),
  contradictions: z.array(z.string()),
  reviewReasons: z.array(z.string()),
  suggestedDuplicateReportIds: z.array(z.string()).optional(),
  extractedPeopleAffected: z.number().nullable().optional(),
  groundedLocation: z.object({
    description: z.string(),
    address: z.string().optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional(),
    uncertaintyRadiusMeters: z.number().optional(),
    isUnknown: z.boolean(),
    source: z.enum(['user_reported', 'geocoded_verified', 'approximate_zone', 'unknown'])
  })
});

export type ValidatedAiTriageOutput = z.infer<typeof AiTriageOutputSchema>;

/**
 * Deterministic Mock AI Triage Engine
 * Handles multilingual translation, uncertainty detection, and duplicate scoring offline.
 */
export function runMockAiTriage(
  report: Partial<DisasterReport>,
  existingIncidents: ConsolidatedIncident[] = []
): AiTriageResult {
  const fullText = `${report.title || ''} ${report.originalMessage || ''}`.toLowerCase();
  const rawText = `${report.title || ''} ${report.originalMessage || ''}`;

  // Language Detection
  let detectedLang = 'en';
  let translation: { language: string; text: string } | null = null;

  if (/[áéíóúñ¿¡]/.test(rawText) || /ayuda|inundaci|segundo piso|abuelos|r[ií]o|agua/i.test(rawText)) {
    detectedLang = 'es';
    translation = {
      language: 'en',
      text: translateSpanishMock(rawText)
    };
  } else if (/[\u00C0-\u1EF9]/.test(rawText) || /cần|cứu|nước|ngập|tiểu đường|bệnh/i.test(rawText)) {
    detectedLang = 'vi';
    translation = {
      language: 'en',
      text: translateVietnameseMock(rawText)
    };
  } else if (/[\u0900-\u097F]/.test(rawText) || /मदद|पानी|बाढ़|फंसे/i.test(rawText)) {
    detectedLang = 'hi';
    translation = {
      language: 'en',
      text: 'Urgent assistance needed: rising flood waters surrounding family premises, require evacuation and drinking water.'
    };
  }

  // Category determination (preserve explicit category if valid)
  let category: ReportCategory = (report.category && report.category !== 'other') 
    ? report.category 
    : 'other';

  if (category === 'other') {
    if (/trap|roof|attic|boat|kayak|submerge|rescue|drown|escaleras|atrapados|cứu|khẩn cấp|strand/i.test(fullText)) {
      category = 'rescue';
    } else if (/insulin|diabet|bleed|medic|doctor|heart|patient|thuốc|tiểu đường|bệnh/i.test(fullText)) {
      category = 'medical';
    } else if (/potable|drinking water|food|ration|hungry|hunger|mre|thực phẩm/i.test(fullText)) {
      category = 'food_water';
    } else if (/shelter|evacuee|gym|blanket|bed|housing|trú ẩn/i.test(fullText)) {
      category = 'shelter';
    } else if (/levee breach|dam breach|power out|blackout|cắt điện/i.test(fullText)) {
      category = 'infrastructure';
    }
  }

  // Urgency & Life Safety evaluation
  let urgency: UrgencyLevel = 'moderate';
  let urgencyExplanation = 'Standard humanitarian assistance request; situation stable.';
  let confidence = 0.85;

  const hasImmediateDanger = Boolean(
    report.immediateDanger ||
    /critical|immediate|dying|trapped|stranded|submerged|cannot breathe|waist high|second floor|rising fast|water rushing|rushing|drowning|cắt điện|atrapados/i.test(fullText)
  );

  if (category === 'rescue' && hasImmediateDanger) {
    urgency = 'critical';
    urgencyExplanation = 'Credible indication of immediate threat to life with rapid water rise, swift currents, or entrapment.';
    confidence = 0.92;
  } else if (category === 'medical') {
    urgency = 'high';
    urgencyExplanation = 'Time-sensitive medical vulnerability identified requiring priority response to prevent acute decompensation.';
    confidence = 0.88;
  } else if (category === 'food_water' && /shelter|100|185|mass|large|many/i.test(fullText)) {
    urgency = 'high';
    urgencyExplanation = 'Large concentration of evacuees experiencing sudden potable water supply collapse.';
    confidence = 0.95;
  } else if (hasImmediateDanger) {
    urgency = 'critical';
    urgencyExplanation = 'Report indicates life-safety danger requiring prompt human escalation.';
  }

  // Location Grounding & Uncertainty Analysis
  let isLocationUnknown = false;
  let uncertaintyRadiusMeters = 50;
  let locationSource: GroundedLocation['source'] = 'user_reported';
  const locDesc = report.location?.description || 'Unknown area';

  if (/unknown|cannot see|somewhere|lost|no street signs|between/i.test(locDesc) || !report.location?.coordinates) {
    if (!report.location?.coordinates) {
      isLocationUnknown = true;
      locationSource = 'unknown';
      uncertaintyRadiusMeters = 2500;
      confidence = Math.min(confidence, 0.48); // Confidence drops, but urgency stays high!
    }
  }

  // Facts vs Inferences
  const facts: string[] = [];
  const inferences: string[] = [];
  const missingInfo: string[] = [];
  const contradictions: string[] = [];
  const reviewReasons: string[] = [];

  // Parse people affected
  const peopleReported = report.peopleAffectedCount;
  if (peopleReported && peopleReported > 0) {
    facts.push(`Report explicitly cites ${peopleReported} person(s) directly impacted.`);
  } else {
    missingInfo.push('Precise count of affected individuals not provided.');
  }

  facts.push(`Reported location: "${locDesc}".`);
  facts.push(`Communication channel: Web client submission.`);

  if (category === 'rescue') {
    inferences.push('Physical water extrication equipment (e.g. inflatable boat or high-wheel vehicle) likely necessary.');
    missingInfo.push('Current water current velocity and structural stability of refuge.');
    reviewReasons.push('Life-safety event requires immediate coordinator acknowledgment.');
  }

  if (isLocationUnknown) {
    reviewReasons.push('CRITICAL: Coordinates unknown. Human dispatcher or cell-tower triangulator required. DO NOT INVENT COORDINATES.');
  }

  if (detectedLang !== 'en') {
    facts.push(`Source message delivered in ${detectedLang.toUpperCase()}.`);
    inferences.push('Volunteer translator recommended for continuous survivor contact.');
  }

  // Duplicate detection against existing incidents
  const suggestedDuplicateReportIds: string[] = [];
  for (const inc of existingIncidents) {
    if (inc.category === category) {
      // Check spatial distance if coordinates exist
      if (
        report.location?.coordinates && 
        inc.location.coordinates
      ) {
        const distKm = computeHaversineDistance(
          report.location.coordinates.lat,
          report.location.coordinates.lng,
          inc.location.coordinates.lat,
          inc.location.coordinates.lng
        );
        if (distKm < 0.5) {
          suggestedDuplicateReportIds.push(inc.primaryReportId);
          contradictions.push(`Matches spatial corridor of existing Incident "${inc.title}" (~${Math.round(distKm * 1000)}m away).`);
          reviewReasons.push(`Evaluate potential duplicate consolidation with Incident ${inc.id}.`);
        }
      }
    }
  }

  const groundedLocation: GroundedLocation = {
    description: locDesc,
    address: report.location?.address,
    coordinates: report.location?.coordinates,
    uncertaintyRadiusMeters,
    isUnknown: isLocationUnknown,
    source: locationSource
  };

  return {
    summary: rawText.length > 120 ? rawText.slice(0, 117) + '...' : rawText,
    originalLanguage: detectedLang,
    translation,
    category,
    urgency,
    urgencyExplanation,
    confidenceScore: Number(confidence.toFixed(2)),
    facts,
    inferences,
    missingInfo,
    contradictions,
    reviewReasons,
    suggestedDuplicateReportIds,
    extractedPeopleAffected: peopleReported ?? undefined,
    groundedLocation,
    processedAt: new Date().toISOString(),
    isMockProvider: true
  };
}

/**
 * Primary AI Triage Entrypoint.
 * Attempts Gemini API call if key is configured, with seamless deterministic fallback.
 */
export async function triageDisasterReport(
  report: Partial<DisasterReport>,
  existingIncidents: ConsolidatedIncident[] = []
): Promise<AiTriageResult> {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!geminiApiKey || import.meta.env.VITE_ENABLE_MOCK_AI === 'true') {
    // Deterministic Mock mode
    return runMockAiTriage(report, existingIncidents);
  }

  try {
    const prompt = `
You are the AfterMath Disaster Intelligence Agent.
Evaluate this disaster assistance report with STRICT UNCERTAINTY AWARENESS.
DO NOT hallucinate or invent coordinates, names, or victim numbers.
Distinguish explicitly between:
1. Reported facts
2. AI inferences
3. Unknown or unverified information

Report Content:
Title: ${report.title}
Message: ${report.originalMessage}
User Category: ${report.category}
Location: ${report.location?.description || 'Not provided'}
Coordinates: ${JSON.stringify(report.location?.coordinates || null)}
People: ${report.peopleAffectedCount || 'Unknown'}

Return ONLY valid JSON matching this schema:
{
  "summary": "Concise summary",
  "originalLanguage": "ISO-639-1 code (e.g. en, es, vi, hi)",
  "translation": {"language": "en", "text": "English translation if foreign, else null"},
  "category": "rescue|medical|food_water|shelter|transport|missing_persons|infrastructure|other",
  "urgency": "critical|high|moderate|low|unknown",
  "urgencyExplanation": "Reasoning for urgency",
  "confidenceScore": 0.0 to 1.0,
  "facts": ["Fact 1", "Fact 2"],
  "inferences": ["Inference 1"],
  "missingInfo": ["Missing 1"],
  "contradictions": ["Contradiction 1"],
  "reviewReasons": ["Why a human must inspect this"],
  "extractedPeopleAffected": number or null
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        }),
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Empty Gemini response text');
    }

    const parsed = JSON.parse(candidateText);
    
    // Merge grounded location safely
    const isLocationUnknown = !report.location?.coordinates;
    const result: AiTriageResult = {
      summary: parsed.summary || report.title || '',
      originalLanguage: parsed.originalLanguage || 'en',
      translation: parsed.translation || null,
      category: parsed.category || report.category || 'other',
      urgency: parsed.urgency || 'moderate',
      urgencyExplanation: parsed.urgencyExplanation || 'Processed via Gemini Live Triage.',
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.85,
      facts: Array.isArray(parsed.facts) ? parsed.facts : [],
      inferences: Array.isArray(parsed.inferences) ? parsed.inferences : [],
      missingInfo: Array.isArray(parsed.missingInfo) ? parsed.missingInfo : [],
      contradictions: Array.isArray(parsed.contradictions) ? parsed.contradictions : [],
      reviewReasons: Array.isArray(parsed.reviewReasons) ? parsed.reviewReasons : [],
      extractedPeopleAffected: parsed.extractedPeopleAffected ?? report.peopleAffectedCount ?? undefined,
      groundedLocation: {
        description: report.location?.description || 'Unknown',
        coordinates: report.location?.coordinates,
        uncertaintyRadiusMeters: isLocationUnknown ? 2000 : 50,
        isUnknown: isLocationUnknown,
        source: isLocationUnknown ? 'unknown' : 'user_reported'
      },
      processedAt: new Date().toISOString(),
      isMockProvider: false
    };

    // Runtime validate with Zod
    AiTriageOutputSchema.parse(result);
    return result;
  } catch (err) {
    console.warn('Gemini live call failed, gracefully falling back to deterministic local triage:', err);
    return runMockAiTriage(report, existingIncidents);
  }
}

// Helpers
function translateSpanishMock(text: string): string {
  if (/abuelos/i.test(text)) {
    return 'Please help! The river water has reached the second floor at 412 Oak Street. Grandparents are trapped upstairs without power.';
  }
  return 'Emergency help request regarding flood conditions and trapped residents.';
}

function translateVietnameseMock(text: string): string {
  if (/tiểu đường/i.test(text)) {
    return 'My 68-year-old mother with Type-1 Diabetes has had her insulin ruined by floodwaters at Riverside Community Center 2nd floor.';
  }
  return 'Medical assistance urgently needed for flood survivor.';
}

export function computeHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
