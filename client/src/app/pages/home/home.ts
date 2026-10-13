import { DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { festivalPhase } from '../../core/festival';
import { I18nService } from '../../core/i18n.service';
import { Reveal } from '../../shared/reveal.directive';
import { YoutubeEmbed } from '../../shared/youtube-embed';
import { PeopleGrid } from '../../shared/people-grid';
import { Swipe } from '../../shared/swipe.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe, Reveal, YoutubeEmbed, PeopleGrid, Swipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly content = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly i18n = inject(I18nService);
  protected readonly mandal = this.content.mandal;

  private readonly videos = toSignal(this.content.videos());
  private readonly years = toSignal(this.content.years());
  protected readonly committee = toSignal(this.content.committee());

  // ---------- hero slider ----------
  protected readonly slide = signal(0);
  private sliderPaused = false;

  // ---------- awards carousel ----------
  protected readonly award = signal(0);

  // ---------- countdown ----------
  private readonly now = signal(Date.now());

  protected readonly phase = computed(() => {
    const m = this.mandal();
    return m ? festivalPhase(this.now(), m.festival.startDate, m.festival.visarjanDate) : undefined;
  });

  protected readonly countdown = computed(() => {
    const p = this.phase();
    return p?.kind === 'upcoming' ? p : null;
  });

  protected readonly ongoing = computed(() => {
    const p = this.phase();
    return p?.kind === 'ongoing' ? p : null;
  });

  /** featuredVideos list, or the older single featuredVideo */
  protected readonly featured = computed(() => {
    const m = this.mandal();
    return m?.featuredVideos ?? (m?.featuredVideo ? [m.featuredVideo] : []);
  });

  protected readonly homeVideos = computed(() => (this.videos()?.videos ?? []).filter((v) => v.showOnHome && !!v.youtubeId));
  /** Latest year folders for the "Through the years" strip. */
  protected readonly recentYears = computed(() => (this.years()?.years ?? []).slice(0, 8));
  /** First photos across the newest years for the masonry preview. */
  protected readonly galleryPreview = computed(() =>
    (this.years()?.years ?? []).flatMap((y) => y.images.map((img) => ({ ...img, year: y.year }))).slice(0, 6),
  );

  protected readonly mapUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.mandal()?.contact.mapEmbedUrl;
    if (!url || !/^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(url)) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  constructor() {
    let ticks = 0;
    const id = setInterval(() => {
      this.now.set(Date.now());
      ticks++;
      if (ticks % 6 === 0 && !this.sliderPaused) this.nextSlide();
      if (ticks % 5 === 0) this.nextAward();
    }, 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected pauseSlider(paused: boolean): void {
    this.sliderPaused = paused;
  }

  protected goSlide(i: number): void {
    const n = this.mandal()?.heroSlides.length ?? 0;
    if (n) this.slide.set((i + n) % n);
  }

  protected nextSlide(): void {
    this.goSlide(this.slide() + 1);
  }

  protected prevSlide(): void {
    this.goSlide(this.slide() - 1);
  }

  protected goAward(i: number): void {
    const n = this.mandal()?.awards.length ?? 0;
    if (n) this.award.set((i + n) % n);
  }

  protected nextAward(): void {
    this.goAward(this.award() + 1);
  }

  /** Alternate the background of the video sections like the reference design. */
  protected videoBg(i: number): string {
    return ['section--warm', 'section--glow', 'section--warm'][i % 3];
  }
}
