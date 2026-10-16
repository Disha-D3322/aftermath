import { 
  DisasterReport, 
  ConsolidatedIncident, 
  VolunteerTask, 
  UserProfile, 
  VolunteerProfile, 
  CorporateOrganization, 
  ResourcePledge, 
  VerifiedContribution,
  InAppNotification,
  ReviewActionAudit
} from '../types';

export const SEED_USERS: UserProfile[] = [
  {
    id: 'user_maria_101',
    email: 'maria.santos@demo.aftermath.org',
    displayName: 'Maria Santos',
    phone: '+1-555-019-4421',
    roles: ['user'],
    currentRole: 'user',
    isVolunteer: true,
    createdAt: '2026-10-14T08:00:00Z',
    updatedAt: '2026-10-16T10:00:00Z'
  },
  {
    id: 'reviewer_elena_202',
    email: 'elena.rostova@demo.aftermath.org',
    displayName: 'Elena Rostova (Lead Triage)',
    phone: '+1-555-019-8832',
    roles: ['user', 'reviewer'],
    currentRole: 'reviewer',
    isVolunteer: true,
    createdAt: '2026-10-12T09:30:00Z',
    updatedAt: '2026-10-16T12:00:00Z'
  },
  {
    id: 'coordinator_marcus_303',
    email: 'marcus.vance@demo.aftermath.org',
    displayName: 'Marcus Vance (Field Ops)',
    phone: '+1-555-019-7711',
    roles: ['user', 'coordinator', 'reviewer'],
    currentRole: 'coordinator',
    isVolunteer: true,
    createdAt: '2026-10-10T14:15:00Z',
    updatedAt: '2026-10-16T14:00:00Z'
  },
  {
    id: 'corp_techcorp_404',
    email: 'csr@apexrelief.global',
    displayName: 'Apex Global Logistics (CSR)',
    phone: '+1-555-019-3390',
    roles: ['user', 'corporate_partner'],
    currentRole: 'corporate_partner',
    isVolunteer: false,
    organizationId: 'org_apex_global',
    createdAt: '2026-10-08T11:00:00Z',
    updatedAt: '2026-10-16T15:00:00Z'
  },
  {
    id: 'admin_sys_505',
    email: 'admin@aftermath.org',
    displayName: 'System Administrator',
    roles: ['user', 'reviewer', 'coordinator', 'corporate_partner', 'admin'],
    currentRole: 'admin',
    isVolunteer: true,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-16T16:00:00Z'
  }
];

export const SEED_VOLUNTEER_PROFILES: Record<string, VolunteerProfile> = {
  'user_maria_101': {
    userId: 'user_maria_101',
    isAvailable: true,
    skills: ['Spanish Translation', 'First Aid Basic', 'Community Outreach', 'Food Logistics'],
    languages: ['Spanish (Native)', 'English (Fluent)', 'Portuguese (Basic)'],
    serviceArea: {
      city: 'Cedar Valley',
      state: 'OR',
      radiusKm: 25,
      coordinates: { lat: 44.0521, lng: -123.0868 }
    },
    verifiedPoints: 85,
    completedTaskCount: 3,
    badges: [
      {
        id: 'b_translator',
        name: 'Community Translator',
        icon: 'Languages',
        awardedAt: '2026-10-15T18:20:00Z',
        description: 'Verified 3+ urgent foreign language distress dispatches.'
      },
      {
        id: 'b_verified_helper',
        name: 'Verified Helper',
        icon: 'Award',
        awardedAt: '2026-10-16T09:15:00Z',
        description: 'Successfully resolved confirmed shelter relief assignments.'
      }
    ],
    createdAt: '2026-10-14T08:15:00Z',
    updatedAt: '2026-10-16T12:00:00Z'
  }
};

export const SEED_ORGANIZATIONS: CorporateOrganization[] = [
  {
    id: 'org_apex_global',
    name: 'Apex Global Logistics & Cold Chain',
    industry: 'Freight, Logistics & Storage',
    contactEmail: 'disaster-response@apexrelief.global',
    website: 'https://apexrelief.global',
    logoUrl: '/logo.jpg',
    description: 'Specialized overland heavy fleet and temperature-controlled medical & ration distribution.',
    totalPledgedUsd: 125000,
    totalDeliveredResourcesCount: 4200,
    employeeVolunteersActive: 48,
    verified: true,
    createdAt: '2026-10-05T09:00:00Z'
  },
  {
    id: 'org_beacon_tech',
    name: 'Beacon Telecommunications',
    industry: 'Satellite & Emergency Mesh Comms',
    contactEmail: 'mesh-aid@beacontech.io',
    website: 'https://beacontech.io',
    description: 'Providing solar-powered satellite Wi-Fi hotspots and emergency battery powerbanks for relief hubs.',
    totalPledgedUsd: 75000,
    totalDeliveredResourcesCount: 350,
    employeeVolunteersActive: 19,
    verified: true,
    createdAt: '2026-10-07T14:30:00Z'
  }
];

export const SEED_PLEDGES: ResourcePledge[] = [
  {
    id: 'pledge_apex_water_01',
    organizationId: 'org_apex_global',
    organizationName: 'Apex Global Logistics & Cold Chain',
    category: 'food_water',
    title: '5,000 Gallons Potable Water & 2,000 MRE Rations',
    description: 'High-speed flatbed delivery direct to Central Shelter & staging area.',
    quantity: '5,000 Gal Water + 2,000 Rations',
    financialAmountUsd: 32000,
    status: 'delivered',
    targetIncidentId: 'inc_cedar_bridge_01',
    targetIncidentTitle: 'Cedar Bridge Highschool Evacuation Center Surge',
    logisticsContact: 'Apex Dispatch Desk (VHF Ch 16 / dispatch@apexrelief.global)',
    statusHistory: [
      { status: 'pledged', notes: 'Initial corporate pledge registered.', updatedAt: '2026-10-15T08:00:00Z', updatedBy: 'Apex CSR' },
      { status: 'approved', notes: 'Approved by Coordinator Marcus Vance for direct drop.', updatedAt: '2026-10-15T09:30:00Z', updatedBy: 'Marcus Vance' },
      { status: 'dispatched', notes: '2 semi-trailers en route via Route 126 bypass.', updatedAt: '2026-10-15T13:00:00Z', updatedBy: 'Apex Logistics' },
      { status: 'delivered', notes: 'Offloaded and verified by shelter quartermaster.', updatedAt: '2026-10-16T11:45:00Z', updatedBy: 'Elena Rostova' },
      { status: 'verified', notes: 'Full receipt logged with zero breakage.', updatedAt: '2026-10-16T12:00:00Z', updatedBy: 'System Auto-Audit' }
    ],
    createdAt: '2026-10-15T08:00:00Z',
    updatedAt: '2026-10-16T12:00:00Z'
  },
  {
    id: 'pledge_beacon_hotspots_02',
    organizationId: 'org_beacon_tech',
    organizationName: 'Beacon Telecommunications',
    category: 'equipment',
    title: '15 Starlink Mobile Terminals & 50 Solar Battery Generators',
    description: 'Rapid mesh backhaul deployment to restore 911 relay and volunteer reporting in blacked-out sectors.',
    quantity: '15 Terminals + 50 Power Hubs',
    financialAmountUsd: 28500,
    status: 'dispatched',
    targetIncidentId: 'inc_willamette_levee_02',
    targetIncidentTitle: 'Willamette North Levee Breach & Power Outage',
    logisticsContact: 'Beacon Emergency Mesh Field Unit (+1-555-019-9020)',
    statusHistory: [
      { status: 'pledged', notes: 'Mesh kit offered for blacked-out district.', updatedAt: '2026-10-16T07:00:00Z', updatedBy: 'Beacon Tech' },
      { status: 'approved', notes: 'Priority clearance issued by Emergency Services.', updatedAt: '2026-10-16T08:15:00Z', updatedBy: 'Marcus Vance' },
      { status: 'dispatched', notes: 'Loaded onto 4x4 high-clearance convoy.', updatedAt: '2026-10-16T10:00:00Z', updatedBy: 'Beacon Ops' }
    ],
    createdAt: '2026-10-16T07:00:00Z',
    updatedAt: '2026-10-16T10:00:00Z'
  }
];

export const SEED_REPORTS: DisasterReport[] = [
  // Cluster A: Spanish distress report (Elderly trapped in attic)
  {
    id: 'rep_flood_esp_001',
    reporterId: 'user_anonymous_survivor_1',
    reporterName: 'Carlos M.',
    reporterContact: '+1-555-012-7811',
    title: 'Agua subiendo rápido al segundo piso, abuelos atrapados',
    originalMessage: '¡Por favor ayuda! El agua del río ya cubrió la planta baja en Calle del Roble 412. Mis abuelos están en el segundo piso y no pueden bajar las escaleras. Se cortó la luz. Somos 4 personas, dos adultos mayores.',
    category: 'rescue',
    status: 'needs_review',
    location: {
      description: '412 Oak Street (Calle del Roble), Lower Riverbank District',
      address: '412 Oak St, Cedar Valley, OR 97401',
      coordinates: { lat: 44.0545, lng: -123.0912 },
      uncertaintyRadiusMeters: 50,
      isUnknown: false,
      source: 'user_reported'
    },
    peopleAffectedCount: 4,
    immediateDanger: true,
    mediaUrls: ['/logo.jpg'],
    originalLanguage: 'es',
    translation: {
      language: 'en',
      text: 'Please help! River water has already flooded the ground floor at 412 Oak Street. My grandparents are on the second floor and cannot come down the stairs. Power is out. We are 4 people, including two elderly adults.'
    },
    aiTriage: {
      summary: 'Immediate rescue required: 4 people including 2 mobility-impaired elderly trapped on 2nd floor with rising floodwater and power blackout.',
      originalLanguage: 'es',
      translation: {
        language: 'en',
        text: 'Please help! River water has already flooded the ground floor at 412 Oak Street. My grandparents are on the second floor and cannot come down the stairs. Power is out. We are 4 people, including two elderly adults.'
      },
      category: 'rescue',
      urgency: 'critical',
      urgencyExplanation: 'Active flood ingress into living floors with vulnerable elderly individuals unable to evacuate unassisted. Severe hypothermia & trapping risk.',
      confidenceScore: 0.94,
      facts: [
        'Location: 412 Oak Street (Calle del Roble)',
        '4 individuals affected, 2 are elderly with mobility limitations',
        'Ground floor completely submerged',
        'Power is cut'
      ],
      inferences: [
        'Water likely rising above 1.5 meters based on ground floor submersion',
        'Requires boat or high-water vehicle for extrication'
      ],
      missingInfo: [
        'Current water velocity outside house',
        'Attic/roof access availability if second floor breaches'
      ],
      contradictions: [],
      reviewReasons: [
        'Life safety emergency requires human verification and dispatch escalation',
        'Confirm if medical equipment or oxygen is required by elderly individuals'
      ],
      suggestedDuplicateReportIds: ['rep_flood_eng_002'],
      extractedPeopleAffected: 4,
      groundedLocation: {
        description: '412 Oak Street, Lower Riverbank District',
        coordinates: { lat: 44.0545, lng: -123.0912 },
        uncertaintyRadiusMeters: 50,
        isUnknown: false,
        source: 'user_reported'
      },
      processedAt: '2026-10-16T14:02:10Z',
      isMockProvider: true
    },
    incidentId: 'inc_oak_street_rescue_01',
    createdAt: '2026-10-16T14:00:30Z',
    updatedAt: '2026-10-16T14:05:00Z'
  },

  // Cluster A duplicate/neighbouring report (English)
  {
    id: 'rep_flood_eng_002',
    reporterId: 'user_anonymous_survivor_2',
    reporterName: 'Neighbor Jason T.',
    reporterContact: '+1-555-018-9923',
    title: 'Oak Street flooded, elderly neighbors trapped next door',
    originalMessage: 'Water is waist high on Oak St near 414 / 412. I paddled out on a kayak. The elderly couple at 412 are shouting from second floor window. There may be 5 people inside now because their daughter came over.',
    category: 'rescue',
    status: 'needs_review',
    location: {
      description: 'Oak St near 412-414 Oak Street',
      address: '412-414 Oak St, Cedar Valley, OR',
      coordinates: { lat: 44.0547, lng: -123.0909 },
      uncertaintyRadiusMeters: 80,
      isUnknown: false,
      source: 'user_reported'
    },
    peopleAffectedCount: 5,
    immediateDanger: true,
    mediaUrls: [],
    originalLanguage: 'en',
    aiTriage: {
      summary: 'Neighbor confirms elderly couple trapped at 412 Oak St; estimates 5 occupants including visiting daughter; waist-high floodwaters.',
      originalLanguage: 'en',
      category: 'rescue',
      urgency: 'critical',
      urgencyExplanation: 'Corroborates active trapping at 412 Oak Street. High life safety priority.',
      confidenceScore: 0.91,
      facts: [
        'Location: 412-414 Oak Street',
        'Water depth at street is waist-high',
        'Elderly couple at 412 shouting from window'
      ],
      inferences: [
        'High probability of being identical to report rep_flood_esp_001',
        'Occupant count may be 4 or 5'
      ],
      missingInfo: [
        'Exact occupant count discrepancy (4 vs 5)'
      ],
      contradictions: [
        'Report 1 states 4 people; Report 2 estimates 5 people'
      ],
      reviewReasons: [
        'Potential duplicate of rep_flood_esp_001',
        'Resolve occupant count discrepancy'
      ],
      suggestedDuplicateReportIds: ['rep_flood_esp_001'],
      extractedPeopleAffected: 5,
      groundedLocation: {
        description: '412-414 Oak St, Cedar Valley, OR',
        coordinates: { lat: 44.0547, lng: -123.0909 },
        uncertaintyRadiusMeters: 80,
        isUnknown: false,
        source: 'user_reported'
      },
      processedAt: '2026-10-16T14:12:00Z',
      isMockProvider: true
    },
    incidentId: 'inc_oak_street_rescue_01',
    createdAt: '2026-10-16T14:10:00Z',
    updatedAt: '2026-10-16T14:12:30Z'
  },

  // Case B: Uncertain Location Report (Crucial humanitarian requirement)
  {
    id: 'rep_uncertain_loc_003',
    reporterId: 'user_distress_unknown',
    reporterName: 'Unknown Caller (Cell relay)',
    title: 'Stranded in truck near the levee bypass road, water rushing',
    originalMessage: 'Water just pushed my pickup into the trees. I cannot see street signs. It is somewhere between the grain silo and the blue river bridge on old county route. Battery dying. Water over tires.',
    category: 'rescue',
    status: 'needs_review',
    location: {
      description: 'Old county route between grain silo and blue river bridge, approximate zone',
      isUnknown: true,
      source: 'unknown',
      uncertaintyRadiusMeters: 2500
    },
    peopleAffectedCount: 1,
    immediateDanger: true,
    mediaUrls: [],
    originalLanguage: 'en',
    aiTriage: {
      summary: 'Driver stranded in pickup truck pinned in trees by swift water on rural route. Battery failing. Location imprecise.',
      originalLanguage: 'en',
      category: 'rescue',
      urgency: 'critical',
      urgencyExplanation: 'Immediate drowning risk. Vehicle unstable in swift current with imminent communication loss.',
      confidenceScore: 0.45, // Low confidence on exact spot, but urgency remains CRITICAL!
      facts: [
        'Single occupant in pickup truck pinned against trees',
        'Water above tires and rushing',
        'Phone battery dying'
      ],
      inferences: [
        'Probable County Rd 32 or Levee Access Spur near Old Blue Bridge'
      ],
      missingInfo: [
        'Exact GPS coordinates',
        'Exact vehicle make and color',
        'Direction of travel'
      ],
      contradictions: [],
      reviewReasons: [
        'CRITICAL RESCUE with UNKNOWN COORDINATES. DO NOT FABRICATE COORDINATES.',
        'Requires immediate county dispatcher cell tower triangulation.'
      ],
      extractedPeopleAffected: 1,
      groundedLocation: {
        description: 'Uncertain corridor between Silo and Blue Bridge',
        isUnknown: true,
        uncertaintyRadiusMeters: 2500,
        source: 'unknown'
      },
      processedAt: '2026-10-16T14:22:00Z',
      isMockProvider: true
    },
    incidentId: null, // Left in unlocated queue!
    createdAt: '2026-10-16T14:20:00Z',
    updatedAt: '2026-10-16T14:22:30Z'
  },

  // Case C: Vietnamese language medical / insulin distress
  {
    id: 'rep_flood_viet_004',
    reporterId: 'user_viet_01',
    reporterName: 'Nguyen Thi Mai',
    reporterContact: '+1-555-014-6652',
    title: 'Cần insulin khẩn cấp cho người bệnh tiểu đường tại khu tạm cư',
    originalMessage: 'Mẹ tôi 68 tuổi bị tiểu đường tuýp 1, thuốc insulin bị ngập hỏng mất rồi. Chúng tôi đang ở tầng 2 nhà văn hóa cộng đồng Riverside, đường Elm số 88. Cần hỗ trợ y tế khẩn cấp.',
    category: 'medical',
    status: 'needs_review',
    location: {
      description: '88 Elm Street, Riverside Community Center, 2nd Floor',
      address: '88 Elm St, Cedar Valley, OR 97401',
      coordinates: { lat: 44.0512, lng: -123.0845 },
      uncertaintyRadiusMeters: 30,
      isUnknown: false,
      source: 'user_reported'
    },
    peopleAffectedCount: 2,
    immediateDanger: true,
    mediaUrls: [],
    originalLanguage: 'vi',
    translation: {
      language: 'en',
      text: 'My 68-year-old mother has type 1 diabetes, her insulin was ruined by the floodwater. We are on the 2nd floor of Riverside Community Cultural Center, 88 Elm Street. Urgent medical support needed.'
    },
    aiTriage: {
      summary: 'Urgent medical assistance: 68-year-old female with Type-1 Diabetes has lost refrigerated insulin due to flooding at Riverside Community Center.',
      originalLanguage: 'vi',
      translation: {
        language: 'en',
        text: 'My 68-year-old mother has type 1 diabetes, her insulin was ruined by the floodwater. We are on the 2nd floor of Riverside Community Cultural Center, 88 Elm Street. Urgent medical support needed.'
      },
      category: 'medical',
      urgency: 'high',
      urgencyExplanation: 'Type-1 diabetes without insulin leads to life-threatening Diabetic Ketoacidosis (DKA) within hours.',
      confidenceScore: 0.95,
      facts: [
        'Location: 88 Elm Street (Riverside Community Center, 2nd Floor)',
        'Patient: 68-year-old female, Type-1 diabetic',
        'Insulin destroyed by water damage'
      ],
      inferences: [
        'Requires cold-chain transport for replacement insulin vial and syringes'
      ],
      missingInfo: [
        'Specific insulin brand/type (e.g., Lantus, Humalog, Novolog)'
      ],
      contradictions: [],
      reviewReasons: [
        'Requires authorized medical coordinator verification and pharmacy relay'
      ],
      extractedPeopleAffected: 2,
      groundedLocation: {
        description: '88 Elm Street, Riverside Community Center',
        coordinates: { lat: 44.0512, lng: -123.0845 },
        uncertaintyRadiusMeters: 30,
        isUnknown: false,
        source: 'user_reported'
      },
      processedAt: '2026-10-16T14:35:00Z',
      isMockProvider: true
    },
    incidentId: 'inc_riverside_insulin_03',
    createdAt: '2026-10-16T14:33:00Z',
    updatedAt: '2026-10-16T14:36:00Z'
  },

  // Case D: Shelter drinking water & sanitation outage
  {
    id: 'rep_shelter_water_005',
    reporterId: 'user_volunteer_shelter',
    reporterName: 'Shelter Lead David B.',
    title: 'Clean water shortage at Cedar Bridge High School Shelter',
    originalMessage: 'Municipal tap water has a boil notice and water pressure just dropped to zero. We have 185 evacuees including 34 children. We need bulk bottled drinking water and portable sanitation kits immediately.',
    category: 'food_water',
    status: 'verified',
    location: {
      description: 'Cedar Bridge High School, Gymnasium A, 1200 Cascade Way',
      address: '1200 Cascade Way, Cedar Valley, OR',
      coordinates: { lat: 44.0620, lng: -123.0780 },
      uncertaintyRadiusMeters: 20,
      isUnknown: false,
      source: 'user_reported'
    },
    peopleAffectedCount: 185,
    immediateDanger: false,
    mediaUrls: [],
    originalLanguage: 'en',
    aiTriage: {
      summary: 'Bulk potable water emergency for 185 evacuees at designated shelter following municipal water cutoff.',
      originalLanguage: 'en',
      category: 'food_water',
      urgency: 'high',
      urgencyExplanation: 'High-density vulnerable population facing total loss of drinking water and sanitation.',
      confidenceScore: 0.98,
      facts: [
        'Location: Cedar Bridge High School (1200 Cascade Way)',
        '185 individuals present, 34 children',
        'Tap water pressure failed and boil notice active'
      ],
      inferences: [
        'Ideal match for corporate resource pledge from Apex Global Logistics'
      ],
      missingInfo: [],
      contradictions: [],
      reviewReasons: [
        'Approved by Reviewer Elena Rostova; assigned to corporate supply drop'
      ],
      extractedPeopleAffected: 185,
      groundedLocation: {
        description: '1200 Cascade Way, Cedar Bridge High School',
        coordinates: { lat: 44.0620, lng: -123.0780 },
        uncertaintyRadiusMeters: 20,
        isUnknown: false,
        source: 'user_reported'
      },
      processedAt: '2026-10-16T11:00:00Z',
      isMockProvider: true
    },
    incidentId: 'inc_cedar_bridge_01',
    createdAt: '2026-10-16T10:55:00Z',
    updatedAt: '2026-10-16T11:15:00Z'
  }
];

export const SEED_INCIDENTS: ConsolidatedIncident[] = [
  {
    id: 'inc_oak_street_rescue_01',
    title: 'Oak Street Trapped Elderly & Residents Extrication',
    summary: 'Rising floodwater reached 2nd floor at 412 Oak St; 4-5 individuals trapped with power cut and no stairs access.',
    category: 'rescue',
    urgency: 'critical',
    verificationStatus: 'verified',
    location: {
      description: '412-414 Oak Street, Lower Riverbank District',
      address: '412 Oak St, Cedar Valley, OR',
      coordinates: { lat: 44.0545, lng: -123.0912 },
      uncertaintyRadiusMeters: 50,
      isUnknown: false,
      source: 'geocoded_verified'
    },
    affectedPeople: 5,
    primaryReportId: 'rep_flood_esp_001',
    associatedReportIds: ['rep_flood_esp_001', 'rep_flood_eng_002'],
    outstandingNeeds: ['Shallow-draft evacuation boat', '2 EMTs for elderly transfer', 'Emergency hypothermia blankets'],
    assignedCoordinatorId: 'coordinator_marcus_303',
    verifiedBy: 'Elena Rostova',
    verifiedAt: '2026-10-16T14:15:00Z',
    createdAt: '2026-10-16T14:05:00Z',
    updatedAt: '2026-10-16T14:15:00Z'
  },
  {
    id: 'inc_cedar_bridge_01',
    title: 'Cedar Bridge Highschool Evacuation Center Surge',
    summary: 'Mass sheltering site with 185 evacuees requiring continuous potable water, hygiene packs, and bilingual registration support.',
    category: 'food_water',
    urgency: 'high',
    verificationStatus: 'verified',
    location: {
      description: '1200 Cascade Way, Cedar Bridge High School',
      address: '1200 Cascade Way, Cedar Valley, OR',
      coordinates: { lat: 44.0620, lng: -123.0780 },
      uncertaintyRadiusMeters: 20,
      isUnknown: false,
      source: 'geocoded_verified'
    },
    affectedPeople: 185,
    primaryReportId: 'rep_shelter_water_005',
    associatedReportIds: ['rep_shelter_water_005'],
    outstandingNeeds: ['Ongoing meal distribution', 'Volunteer Spanish interpreters', 'Charging station maintenance'],
    assignedCoordinatorId: 'coordinator_marcus_303',
    verifiedBy: 'Marcus Vance',
    verifiedAt: '2026-10-16T11:15:00Z',
    createdAt: '2026-10-16T11:00:00Z',
    updatedAt: '2026-10-16T13:00:00Z'
  },
  {
    id: 'inc_riverside_insulin_03',
    title: 'Riverside Center Type-1 Diabetic Insulin Delivery',
    summary: 'Elderly diabetic patient needing urgent replacement insulin at isolated community hub.',
    category: 'medical',
    urgency: 'high',
    verificationStatus: 'needs_review',
    location: {
      description: '88 Elm Street, Riverside Community Cultural Center',
      coordinates: { lat: 44.0512, lng: -123.0845 },
      uncertaintyRadiusMeters: 30,
      isUnknown: false,
      source: 'user_reported'
    },
    affectedPeople: 2,
    primaryReportId: 'rep_flood_viet_004',
    associatedReportIds: ['rep_flood_viet_004'],
    outstandingNeeds: ['Cold-chain insulin delivery', 'Vietnamese medical translator for dosage check'],
    assignedCoordinatorId: 'coordinator_marcus_303',
    createdAt: '2026-10-16T14:35:00Z',
    updatedAt: '2026-10-16T14:38:00Z'
  }
];

export const SEED_TASKS: VolunteerTask[] = [
  {
    id: 'task_translate_viet_01',
    incidentId: 'inc_riverside_insulin_03',
    title: 'Vietnamese Medical Translation & Dosage Verification',
    description: 'Assist telemedicine volunteer in confirming exact insulin brand (Lantus vs Novolog) with patient at 88 Elm St via phone relay.',
    category: 'translation',
    requiredSkills: ['Vietnamese Translation', 'Remote Support'],
    requiredLanguages: ['Vietnamese', 'English'],
    location: {
      description: 'Remote / Virtual Call Relay',
      isUnknown: false,
      source: 'approximate_zone'
    },
    pointsAward: 20,
    urgency: 'high',
    safetyLevel: 'safe_remote',
    status: 'available',
    coordinatorId: 'coordinator_marcus_303',
    coordinatorName: 'Marcus Vance',
    createdAt: '2026-10-16T14:40:00Z',
    updatedAt: '2026-10-16T14:40:00Z'
  },
  {
    id: 'task_shelter_bilingual_02',
    incidentId: 'inc_cedar_bridge_01',
    title: 'Spanish Intake Desk & Evacuee Registration',
    description: 'Help register newly arriving families at Cedar Bridge High School Gymnasium A. Distribute wristbands and emergency hygiene kits.',
    category: 'shelter_ops',
    requiredSkills: ['Spanish Translation', 'Community Outreach'],
    requiredLanguages: ['Spanish', 'English'],
    location: {
      description: '1200 Cascade Way, Cedar Bridge High School Gym',
      coordinates: { lat: 44.0620, lng: -123.0780 },
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
  },
  {
    id: 'task_compare_duplicates_03',
    incidentId: 'inc_oak_street_rescue_01',
    title: 'Verify & Compare Oak Street Incident Duplicate Submissions',
    description: 'Review incoming bystander photos and audio messages for Oak Street corridor to confirm if 412 and 414 are the same structure.',
    category: 'data_verification',
    requiredSkills: ['Information Verification', 'Duplicate Review'],
    requiredLanguages: ['English'],
    location: {
      description: 'Virtual / Online Portal Task',
      isUnknown: false,
      source: 'approximate_zone'
    },
    pointsAward: 15,
    urgency: 'high',
    safetyLevel: 'safe_remote',
    status: 'available',
    coordinatorId: 'reviewer_elena_202',
    coordinatorName: 'Elena Rostova',
    createdAt: '2026-10-16T14:20:00Z',
    updatedAt: '2026-10-16T14:20:00Z'
  },
  {
    id: 'task_completed_ration_drop_04',
    incidentId: 'inc_cedar_bridge_01',
    title: 'Unload Potable Water Pallets at Secondary Depot',
    description: 'Assist in unloading 40 cases of bottled water from Apex Logistics trailer to shelter cafeteria storage.',
    category: 'logistics',
    requiredSkills: ['Food Logistics', 'Physical Capability'],
    requiredLanguages: ['English'],
    location: {
      description: 'Cedar Bridge High School Loading Dock',
      coordinates: { lat: 44.0620, lng: -123.0780 },
      isUnknown: false,
      source: 'geocoded_verified'
    },
    pointsAward: 30,
    urgency: 'moderate',
    safetyLevel: 'community_low_risk',
    status: 'completed',
    assignedVolunteerId: 'user_maria_101',
    coordinatorId: 'coordinator_marcus_303',
    coordinatorName: 'Marcus Vance',
    createdAt: '2026-10-15T15:00:00Z',
    updatedAt: '2026-10-16T10:00:00Z'
  }
];

export const SEED_CONTRIBUTIONS: VerifiedContribution[] = [
  {
    id: 'contrib_maria_task_04',
    userId: 'user_maria_101',
    taskId: 'task_completed_ration_drop_04',
    taskTitle: 'Unload Potable Water Pallets at Secondary Depot',
    contributionType: 'Logistics / Supply Handling',
    points: 30,
    verificationSource: 'Quartermaster On-Site Signoff',
    verifiedBy: 'Marcus Vance',
    timestamp: '2026-10-16T10:05:00Z'
  },
  {
    id: 'contrib_maria_translation_00',
    userId: 'user_maria_101',
    taskId: 'task_prev_trans_01',
    taskTitle: 'Urgent Spanish Flood Warning Broadcast Translation',
    contributionType: 'Language / Translation',
    points: 25,
    verificationSource: 'Lead Triage Officer',
    verifiedBy: 'Elena Rostova',
    timestamp: '2026-10-15T18:20:00Z'
  },
  {
    id: 'contrib_maria_duplicate_audit',
    userId: 'user_maria_101',
    taskId: 'task_prev_audit_02',
    taskTitle: 'Cascade Way Riverbank Duplicate Triage Cross-Check',
    contributionType: 'Non-Sensitive Data Verification',
    points: 30,
    verificationSource: 'Lead Triage Officer',
    verifiedBy: 'Elena Rostova',
    timestamp: '2026-10-16T09:15:00Z'
  }
];

export const SEED_REVIEW_ACTIONS: ReviewActionAudit[] = [
  {
    id: 'audit_01_verify_oak',
    incidentId: 'inc_oak_street_rescue_01',
    reportId: 'rep_flood_esp_001',
    reviewerId: 'reviewer_elena_202',
    reviewerName: 'Elena Rostova',
    actionType: 'verify',
    previousState: { verificationStatus: 'unverified', urgency: 'high' },
    newState: { verificationStatus: 'verified', urgency: 'critical' },
    reason: 'Audio transcript confirmed 2nd floor entrapment with cut power; escalated to Critical rescue dispatch.',
    timestamp: '2026-10-16T14:15:00Z'
  },
  {
    id: 'audit_02_merge_oak',
    incidentId: 'inc_oak_street_rescue_01',
    reportId: 'rep_flood_eng_002',
    reviewerId: 'reviewer_elena_202',
    reviewerName: 'Elena Rostova',
    actionType: 'merge_duplicates',
    previousState: { associatedReportIds: ['rep_flood_esp_001'] },
    newState: { associatedReportIds: ['rep_flood_esp_001', 'rep_flood_eng_002'] },
    reason: 'Neighbor report 002 confirms same house 412 Oak Street, consolidated under primary incident.',
    timestamp: '2026-10-16T14:18:00Z'
  }
];

export const SEED_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif_01',
    recipientUserId: 'user_maria_101',
    title: 'Contribution Verified (+30 Points)',
    message: 'Your completed logistics task at Cedar Bridge Shelter has been verified by Marcus Vance.',
    type: 'points_awarded',
    link: '/impact',
    read: false,
    createdAt: '2026-10-16T10:05:00Z'
  },
  {
    id: 'notif_02',
    recipientUserId: 'user_maria_101',
    title: 'Urgent Task Match In Your Area',
    message: 'A new high-priority translation task matches your Spanish and Portuguese skills.',
    type: 'task_match',
    link: '/volunteer',
    read: false,
    createdAt: '2026-10-16T14:40:00Z'
  },
  {
    id: 'notif_03',
    recipientUserId: 'corp_techcorp_404',
    title: 'Resource Delivery Confirmed',
    message: '5,000 Gallons Potable Water has been marked as Delivered at Cedar Bridge High School.',
    type: 'pledge_update',
    link: '/partners/dashboard',
    read: true,
    createdAt: '2026-10-16T12:00:00Z'
  }
];
