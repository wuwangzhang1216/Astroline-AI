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
  Career = 'Career',
  Health = 'Health',
  Marriage = 'Getting married',
  Travel = 'Traveling the world',
  Education = 'Education',
  Friends = 'Friends',
  Children = 'Children',
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
}

export interface AstrologyResult {
  sunSign: string;
  moonSign: string;
  ascendant: string;
  prediction: string;
  powerWord: string;
}

export enum AppStep {
  LANDING,
  BIRTH_DATE,
  BIRTH_TIME,
  BIRTH_PLACE,
  PROCESSING_CHART, // Visual buffer
  RELATIONSHIP,
  GOALS,
  COLOR,
  ELEMENT,
  PROCESSING_ACCURACY, // Visual buffer
  PALM_INTRO,
  PALM_UPLOAD,
  PROCESSING_PALM, // AI Call happens here
  RESULTS_PREVIEW,
  FULL_REPORT
}