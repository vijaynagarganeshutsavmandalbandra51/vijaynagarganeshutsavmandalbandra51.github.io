import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n.service';
import { Lightbox } from '../../shared/lightbox';
import { PageBanner } from '../../shared/page-banner/page-banner';
import { Reveal } from '../../shared/reveal.directive';
import { YoutubeEmbed } from '../../shared/youtube-embed';

/** /years/:year – all photos and videos from public/media/years/<year>/ */
@Component({
  selector: 'app-year-detail',
  imports: [PageBanner, RouterLink, Lightbox, YoutubeEmbed, Reveal],
  template: `
    <app-page-banner
      [marathi]="entry() ? i18n.edition(entry()!.edition) : ''"
      [title]="i18n.t('utsavYear') + ' ' + i18n.digits(year())"
      [subtitle]="entry() ? i18n.tr(entry()!, 'title') : ''"
    />

    <section class="section section--blush">
      <div class="container">
        @if (manifest()) {
          @if (entry(); as y) {
            @if (y.text) {
              <p class="intro" appReveal>{{ i18n.tr(y, 'text') }}</p>
            }

            @if (y.images.length) {
              <h2 class="section-title">📷 {{ i18n.t('photos') }}</h2>
              <div class="masonry">
                @for (img of y.images; track img.src; let i = $index) {
                  <button type="button" class="tile" (click)="open.set(i)" appReveal="zoom">
                    <img [src]="img.src" [alt]="i18n.tr(img, 'caption') || 'Ganpati ' + y.year" loading="lazy" />
                    @if (img.caption) {
                      <span class="tile__cap">{{ i18n.tr(img, 'caption') }}</span>
                    }
                  </button>
                }
              </div>
            } @else {
              <p class="loading">{{ i18n.t('noPhotos') }}</p>
            }

            @if (y.videos.length) {
              <h2 class="section-title videos-title">🎬 {{ i18n.t('videos') }}</h2>
              <div class="videos">
                @for (v of y.videos; track $index) {
                  <div appReveal>
                    @if (v.type === 'youtube') {
                      <app-youtube [videoId]="v.id" [title]="'Ganeshotsav ' + y.year" />
                    } @else {
                      <video [src]="v.src" controls preload="metadata" playsinline></video>
                    }
                  </div>
                }
              </div>
            }
          } @else {
            <p class="loading">{{ i18n.t('noPhotos') }}</p>
          }

          <nav class="pager">
            @if (newer(); as n) {
              <a [routerLink]="['/years', n]" class="btn btn--ghost">← {{ i18n.digits(n) }}</a>
            } @else {
              <span></span>
            }
            <a routerLink="/years" class="btn btn--primary">{{ i18n.t('allYears') }}</a>
            @if (older(); as o) {
              <a [routerLink]="['/years', o]" class="btn btn--ghost">{{ i18n.digits(o) }} →</a>
            } @else {
              <span></span>
            }
          </nav>
        } @else {
          <p class="loading">Loading…</p>
        }
      </div>
    </section>

    <app-lightbox [items]="lightboxItems()" [(index)]="open" />
  `,
  styles: `
    .intro { max-width: 760px; margin: 0 auto 40px; text-align: center; font-size: 1.15rem; }
    .masonry { columns: 3 260px; column-gap: 16px; margin-top: 24px; }
    .tile {
      position: relative; display: block; width: 100%; margin: 0 0 16px; padding: 0; border: 0; cursor: zoom-in;
      overflow: hidden; border-radius: 14px; background: var(--cream-2); break-inside: avoid;
      box-shadow: 0 12px 25px -15px rgba(0,0,0,.45);
    }
    .tile img { width: 100%; transition: transform .5s ease; }
    .tile:hover img { transform: scale(1.05); }
    .tile__cap { position: absolute; left: 0; right: 0; bottom: 0; padding: 26px 14px 10px; text-align: left;
      color: #fff; font-weight: 600; background: linear-gradient(transparent, rgba(0,0,0,.65)); }
    @media (max-width: 600px) {
      .masonry { columns: 2; column-gap: 10px; }
      .tile { margin-bottom: 10px; border-radius: 10px; }
      .tile__cap { padding: 20px 8px 6px; font-size: .78rem; }
    }
    .videos-title { margin-top: 56px; }
    .videos { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-top: 24px; }
    video { width: 100%; border-radius: 16px; border: 3px solid var(--marigold); background: #000; }
    .pager { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; margin-top: 56px; }
    .pager > :first-child { justify-self: start; }
    .pager > :last-child { justify-self: end; }
    .pager .btn--ghost { color: var(--accent); }
    @media (max-width: 600px) {
      .intro { font-size: 1rem; margin-bottom: 24px; }
      .videos { grid-template-columns: 1fr; }
      .pager { gap: 6px; }
      .pager .btn { padding: 10px 14px; }
    }
  `,
})
export class YearDetailPage {
  protected readonly i18n = inject(I18nService);
  protected readonly manifest = toSignal(inject(ContentService).years());

  /** Route param :year (bound by withComponentInputBinding). */
  readonly year = input.required<string>();
  protected readonly open = signal<number | null>(null);

  protected readonly entry = computed(() => this.manifest()?.years.find((y) => String(y.year) === this.year()));

  private readonly index = computed(() => this.manifest()?.years.findIndex((y) => String(y.year) === this.year()) ?? -1);

  /** Years are sorted newest first. */
  protected readonly newer = computed(() => {
    const i = this.index();
    return i > 0 ? this.manifest()!.years[i - 1].year : null;
  });

  protected readonly older = computed(() => {
    const i = this.index();
    const ys = this.manifest()?.years ?? [];
    return i >= 0 && i < ys.length - 1 ? ys[i + 1].year : null;
  });

  protected readonly lightboxItems = computed(() =>
    (this.entry()?.images ?? []).map((img) => ({ src: img.src, caption: this.i18n.tr(img, 'caption') })),
  );
}
