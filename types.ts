export enum Gender {
  Female = 'Female',
  Male = 'Male',
  NonBinary = 'Non-binary',
}

export enum RelationshipStatus {
  Relationship = 'In a relationship',
  BrokeUp = 'Just broke up',
  Engaged = 'Engaged',
  Married = 'Married',
  Looking = 'Looking for a soulmate',
  Single = 'Single',
}

export enum Goal {
  Family = 'Family harmony',
  Career = 'Career growth',
  Health = 'Physical vitality',
  Marriage = 'Finding a spouse',
  Travel = 'World exploration',
  Education = 'Higher learning',
  Friends = 'Social connections',
  Children = 'Starting a family',
}

export enum ZodiacSign {
  Aries = "Aries",
  Taurus = "Taurus",
  Gemini = "Gemini",
  Cancer = "Cancer",
  Leo = "Leo",
  Virgo = "Virgo",
  Libra = "Libra",
  Scorpio = "Scorpio",
  Sagittarius = "Sagittarius",
  Capricorn = "Capricorn",
  Aquarius = "Aquarius",
  Pisces = "Pisces"
}

export interface UserData {
  gender: Gender | null;
  birthDate: string; // YYYY-MM-DD
  birthTime: string | null; // HH:MM
  birthPlace: string;
  relationshipStatus: RelationshipStatus | null;
  goals: Goal[];
  favoriteColor: string | null;
  element: string | null;
  palmImage: string | null; // Base64
}

export interface PalmistryResult {
  loveScore: number;
  healthScore: number;
  wisdomScore: number;
  careerScore: number;
  loveText: string;
  healthText: string;
  wisdomText: string;
  careerText: string;
  summary: string;
  dominantHandPrediction: string;
}

export interface AstrologyResult {
  sunSign: ZodiacSign;
  moonSign: string;
  ascendant: string;
  prediction: string;
  powerWord: string;
  luckyColor: string;
  compatibilityNote: string;
}

export enum AppStep {
  LANDING,
  BIRTH_DATE,
  BIRTH_TIME,
  BIRTH_PLACE,
  PROCESSING_CHART,
  RELATIONSHIP,
  GOALS,
  COLOR,
  ELEMENT,
  PROCESSING_ACCURACY,
  PALM_INTRO,
  PALM_UPLOAD,
  PROCESSING_PALM,
  RESULTS_PREVIEW,
  FULL_REPORT
}