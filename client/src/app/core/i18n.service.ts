import { Injectable, computed, signal } from '@angular/core';

export type Lang = 'en' | 'mr';

/**
 * Fixed words used in the site layout (menus, buttons, headings).
 * Content (history, schedule, etc.) lives in the JSON files: any field can have a
 * Marathi twin with the same name + "Mr", e.g. "title" and "titleMr".
 */
const LABELS = {
  home: { en: 'Home', mr: 'मुख्यपृष्ठ' },
  mandalInfo: { en: 'Mandal Info', mr: 'मंडळ माहिती' },
  history: { en: "Mandal's History", mr: 'मंडळाचा इतिहास' },
  committee: { en: 'Committee Members', mr: 'कार्यकारिणी सदस्य' },
  viewCommittee: { en: 'View full committee', mr: 'संपूर्ण कार्यकारिणी पहा' },
  decoration: { en: 'Decoration Theme', mr: 'देखावा' },
  visitors: { en: 'Distinguished Visitors', mr: 'मान्यवरांची भेट' },
  utsav: { en: 'Utsav', mr: 'उत्सव' },
  schedule: { en: 'Schedule & Events', mr: 'कार्यक्रम पत्रिका' },
  initiatives: { en: 'Initiatives', mr: 'उपक्रम' },
  socialInitiatives: { en: 'Social Initiatives', mr: 'सामाजिक उपक्रम' },
  educationalInitiatives: { en: 'Educational Initiatives', mr: 'शैक्षणिक उपक्रम' },
  media: { en: 'Media', mr: 'माध्यम' },
  gallery: { en: 'Gallery', mr: 'छायाचित्रे' },
  live: { en: 'Live Darshan', mr: 'थेट दर्शन' },
  videos: { en: 'Videos', mr: 'व्हिडिओ' },
  donate: { en: 'Donate', mr: 'देणगी' },
  contact: { en: 'Contact', mr: 'संपर्क' },
  more: { en: 'More', mr: 'अधिक' },
  readMore: { en: 'Read More', mr: 'अधिक वाचा' },
  viewGallery: { en: 'View Full Gallery', mr: 'संपूर्ण गॅलरी पहा' },
  photoGallery: { en: 'Photo Gallery', mr: 'छायाचित्र दालन' },
  awards: { en: 'Awards & Honours', mr: 'पुरस्कार व सन्मान' },
  donation: { en: 'Donation', mr: 'देणगी' },
  donateNow: { en: 'Donate Now', mr: 'आता देणगी द्या' },
  contactUs: { en: 'Contact Us', mr: 'संपर्क साधा' },
  aboutUs: { en: 'About Us', mr: 'आमच्याबद्दल' },
  importantLinks: { en: 'Important Links', mr: 'महत्त्वाच्या लिंक्स' },
  established: { en: 'Established', mr: 'स्थापना' },
  bappaComing: { en: 'Bappa is coming on', mr: 'बाप्पा येत आहेत' },
  days: { en: 'Days', mr: 'दिवस' },
  hours: { en: 'Hours', mr: 'तास' },
  minutes: { en: 'Minutes', mr: 'मिनिटे' },
  seconds: { en: 'Seconds', mr: 'सेकंद' },
  utsavOn: { en: 'Ganeshotsav is on!', mr: 'उत्सव सुरू आहे!' },
  dayOf: { en: 'Day', mr: 'दिवस' },
  seeYou: { en: 'See you next year!', mr: 'पुढच्या वर्षी लवकर या!' },
  todaysPrograms: { en: "Today's programs", mr: 'आजचे कार्यक्रम' },
  watchLive: { en: 'Watch Live', mr: 'थेट पहा' },
  aartiTimings: { en: 'Aarti & Darshan', mr: 'आरती व दर्शन' },
  phone: { en: 'Phone', mr: 'फोन' },
  email: { en: 'Email', mr: 'ईमेल' },
  address: { en: 'Address', mr: 'पत्ता' },
  getDirections: { en: 'Get directions', mr: 'मार्ग पहा' },
  videoComing: { en: 'Video will be added soon', mr: 'व्हिडिओ लवकरच' },
  all: { en: 'All', mr: 'सर्व' },
  scheduleShort: { en: 'Schedule', mr: 'कार्यक्रम' },
  liveShort: { en: 'Live', mr: 'थेट' },
  years: { en: 'Bappa Through the Years', mr: 'बाप्पा – वर्षानुवर्षे' },
  yearsShort: { en: 'Through the Years', mr: 'वर्षानुवर्षे' },
  photos: { en: 'Photos', mr: 'छायाचित्रे' },
  noPhotos: { en: 'Photos for this year will be added soon.', mr: 'या वर्षाची छायाचित्रे लवकरच.' },
  viewYear: { en: 'View photos', mr: 'छायाचित्रे पहा' },
  allYears: { en: 'All years', mr: 'सर्व वर्षे' },
  olderYear: { en: 'Older', mr: 'मागील' },
  newerYear: { en: 'Newer', mr: 'पुढील' },
  utsavYear: { en: 'Ganeshotsav', mr: 'गणेशोत्सव' },
} as const;

export type LabelKey = keyof typeof LABELS;

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly storageKey = 'mandal-lang';
  readonly lang = signal<Lang>(this.restore());
  readonly isMr = computed(() => this.lang() === 'mr');
  /** Locale id for Angular's date pipe: {{ d | date: 'd MMM y' : undefined : i18n.locale() }} */
  readonly locale = computed(() => (this.lang() === 'mr' ? 'mr' : 'en-US'));

  constructor() {
    document.documentElement.lang = this.lang();
  }

  toggle(): void {
    this.set(this.lang() === 'en' ? 'mr' : 'en');
  }

  set(lang: Lang): void {
    this.lang.set(lang);
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(this.storageKey, lang);
    } catch {
      /* private mode – ignore */
    }
  }

  /** UI label in the current language. */
  t(key: LabelKey): string {
    return LABELS[key][this.lang()];
  }

  /** Content field in the current language: uses `<field>Mr` when Marathi is selected and it exists. */
  tr<T extends object>(obj: T | null | undefined, field: keyof T & string): string {
    if (!obj) return '';
    const record = obj as Record<string, unknown>;
    if (this.lang() === 'mr') {
      const mr = record[field + 'Mr'];
      if (typeof mr === 'string' && mr) return mr;
    }
    const value = record[field];
    return typeof value === 'string' ? value : value == null ? '' : String(value);
  }

  /** Same as tr() but for string-array fields (e.g. paragraphs / paragraphsMr). */
  trList<T extends object>(obj: T | null | undefined, field: keyof T & string): string[] {
    if (!obj) return [];
    const record = obj as Record<string, unknown>;
    const mr = record[field + 'Mr'];
    if (this.lang() === 'mr' && Array.isArray(mr) && mr.length) return mr as string[];
    const value = record[field];
    return Array.isArray(value) ? (value as string[]) : [];
  }

  /** "58th year" / "५८ वे वर्ष" */
  edition(n: number | null | undefined): string {
    if (!n) return '';
    if (this.lang() === 'mr') return `${this.digits(n)} वे वर्ष`;
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return `${n}${s[(v - 20) % 10] || s[v] || s[0]} year`;
  }

  /** Devanagari digits in Marathi mode (2026 -> २०२६). */
  digits(n: number | string): string {
    const str = String(n);
    return this.lang() === 'mr' ? str.replace(/\d/g, (d) => '०१२३४५६७८९'[+d]) : str;
  }

  private restore(): Lang {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved === 'en' || saved === 'mr') return saved;
    } catch {
      /* ignore */
    }
    return 'en';
  }
}
