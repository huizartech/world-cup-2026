export interface WatchParty {
  venue: string;
  neighborhood: string;
  notes?: string;
}

// San Diego soccer bars / watch party venues
export const SD_WATCH_PARTIES: WatchParty[] = [
  { venue: "Shakespeare Pub", neighborhood: "Mission Hills", notes: "Premier League pub, big screens" },
  { venue: "Bluefoot Bar & Lounge", neighborhood: "North Park", notes: "Soccer-focused bar" },
  { venue: "The Harp", neighborhood: "Ocean Beach", notes: "Irish pub, always shows matches" },
  { venue: "Queenstown Public House", neighborhood: "Little Italy", notes: "Large outdoor screens" },
  { venue: "Proud Mary's", neighborhood: "Kearny Mesa", notes: "Southern food + big sports screens" },
  { venue: "The Local Eatery & Drinking Hole", neighborhood: "Pacific Beach" },
  { venue: "Rabbit Hole", neighborhood: "Normal Heights", notes: "Craft cocktails + soccer" },
  { venue: "Novo Brazil Brewing", neighborhood: "Chula Vista", notes: "Brazilian brewery, big watch party vibes" },
];
