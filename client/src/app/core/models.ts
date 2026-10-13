// Shapes of the JSON files in /public/data.
// Any text field can have a Marathi twin with the same name + "Mr" (e.g. title / titleMr).
// If you add a field to a JSON file, add it here too so TypeScript knows about it.

export interface Text {
  text: string;
  textMr?: string;
}

export interface HeroSlide {
  image: string;
  /** optional CSS object-position, e.g. "center 30%" to keep Bappa's face in view */
  position?: string;
  title: string;
  titleMr?: string;
  subtitle?: string;
  subtitleMr?: string;
}

export interface AartiTiming {
  label: string;
  labelMr?: string;
  time: string;
}

export interface Stat {
  value: string;
  label: string;
  labelMr?: string;
}

export interface Announcement {
  date: string;
  title: string;
  titleMr?: string;
  text: string;
  textMr?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  titleMr?: string;
  text: string;
  textMr?: string;
}

export interface VideoItem {
  title: string;
  titleMr?: string;
  text?: string;
  textMr?: string;
  youtubeId?: string;
  year?: string;
  showOnHome?: boolean;
}

export interface MandalInfo {
  shortName: string;
  name: string;
  nameMr: string;
  tagline: string;
  taglineMr?: string;
  established: number;
  /** Year of the very first Ganeshotsav (used to say "58th year" etc.) */
  firstUtsavYear?: number;
  logo: string;
  address: string;
  addressMr?: string;
  marquee: Text[];
  heroSlides: HeroSlide[];
  festival: {
    year: number;
    startDate: string;
    visarjanDate: string;
    theme?: string;
    themeMr?: string;
  };
  aartiTimings: AartiTiming[];
  featuredVideo?: VideoItem;
  history: {
    image: string;
    paragraphs: string[];
    paragraphsMr?: string[];
    timeline: TimelineItem[];
  };
  stats: Stat[];
  awards: Text[];
  announcements: Announcement[];
  about: { short: string; shortMr?: string };
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    mapEmbedUrl?: string;
    mapLink?: string;
  };
  social: {
    youtube?: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  live: {
    note?: string;
    noteMr?: string;
    youtubeChannelId?: string;
    youtubeLiveVideoId?: string;
  };
  donation: {
    enabled: boolean;
    upiId: string;
    payeeName: string;
    note?: string;
    noteMr?: string;
    bank?: {
      accountName: string;
      accountNumber: string;
      ifsc: string;
      bankName: string;
    };
  };
}

export interface ScheduleEvent {
  time: string;
  title: string;
  titleMr?: string;
  description?: string;
  descriptionMr?: string;
}

export interface ScheduleDay {
  day: number;
  date: string; // yyyy-MM-dd
  title: string;
  titleMr?: string;
  events: ScheduleEvent[];
}

export interface Schedule {
  year: number;
  /** false = programme not announced yet; the Schedule page shows a countdown instead */
  published?: boolean;
  note?: string;
  noteMr?: string;
  days: ScheduleDay[];
}

export interface YearImage {
  src: string;
  caption?: string;
  captionMr?: string;
}

export type YearVideo = { type: 'file'; src: string } | { type: 'youtube'; id: string };

/** One folder in public/media/years/<year>/ (generated into data/years.json). */
export interface YearEntry {
  year: number;
  /** 1 = first Ganeshotsav. 2026 -> 58 */
  edition: number | null;
  title?: string;
  titleMr?: string;
  text?: string;
  textMr?: string;
  cover: string;
  /** optional "made by" credit with a group photo (info.json → team) */
  team?: { photo: string; title?: string; titleMr?: string; text?: string; textMr?: string };
  images: YearImage[];
  videos: YearVideo[];
}

export interface YearsManifest {
  firstUtsavYear: number;
  years: YearEntry[];
}

export interface CommitteeMember {
  name: string;
  nameMr?: string;
  role?: string;
  roleMr?: string;
  photo?: string;
  phone?: string;
}

/** A titled list of people, e.g. "Committee Members" or "Helpers". */
export interface PeopleGroup {
  title: string;
  titleMr?: string;
  members: CommitteeMember[];
}

export interface Committee {
  year: string;
  committee: PeopleGroup;
  helpers?: PeopleGroup;
}

export interface Initiative {
  icon: string;
  title: string;
  titleMr?: string;
  text: string;
  textMr?: string;
  image?: string;
}

export interface Initiatives {
  social: Initiative[];
  educational: Initiative[];
}

export interface Videos {
  videos: VideoItem[];
}

/** public/data/visitors.json – leaders / public figures who visited the pandal */
export interface Visitor {
  year: number;
  name: string;
  nameMr?: string;
  role?: string;
  roleMr?: string;
  text?: string;
  textMr?: string;
  photo: string;
}

export interface Visitors {
  intro?: string;
  introMr?: string;
  visitors: Visitor[];
}
