import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n.service';
import { Lightbox } from '../../shared/lightbox';
import { PageBanner } from '../../shared/page-banner/page-banner';

/** /gallery – every photo from every year folder, with a year filter. */
@Component({
  selector: 'app-gallery',
  imports: [PageBanner, Lightbox, RouterLink],
  template: `
    <app-page-banner [title]="i18n.t('photoGallery')" [subtitle]="i18n.isMr() ? 'आमच्या गणेशोत्सवाच्या आठवणी' : 'Memories from our Ganeshotsav celebrations over the years.'" />

    <section class="section">
      <div class="container">
        @if (manifest(); as mf) {
          <div class="filters">
            <button type="button" [class.active]="year() === 'all'" (click)="pick('all')">{{ i18n.t('all') }}</button>
            @for (y of mf.years; track y.year) {
              @if (y.images.length) {
                <button type="button" [class.active]="year() === y.year" (click)="pick(y.year)">{{ i18n.digits(y.year) }}</button>
              }
            }
          </div>

          @if (year() !== 'all') {
            <p class="year-link">
              <a [routerLink]="['/years', year()]">{{ i18n.t('utsavYear') }} {{ i18n.digits(year()) }} – {{ i18n.t('photos') }} & {{ i18n.t('videos') }} →</a>
            </p>
          }

          <div class="masonry">
            @for (p of photos(); track p.src; let i = $index) {
              <button type="button" class="tile" (click)="open.set(i)" [attr.aria-label]="p.caption">
                <img [src]="p.src" [alt]="p.caption" loading="lazy" />
                <span class="tile__cap">{{ p.caption }}</span>
              </button>
            } @empty {
              <p class="loading">{{ i18n.t('noPhotos') }}</p>
            }
          </div>
        } @else {
          <p class="loading">Loading…</p>
        }
      </div>
    </section>

    <app-lightbox [items]="photos()" [(index)]="open" />
  `,
  styles: `
    .filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 20px; }
    @media (max-width: 600px) {
      .filters { flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto; margin: 0 -16px 16px; padding: 4px 16px; scrollbar-width: none; }
      .filters button { flex: none; }
    }
    .filters button {
      padding: 8px 18px; border-radius: 999px; border: 1px solid #f5dcb8; cursor: pointer;
      background: var(--white); font: 600 .95rem var(--font-body); color: var(--ink);
    }
    .filters button.active { background: var(--accent); color: #fff; border-color: var(--accent); }
    .year-link { text-align: center; margin: 0 0 24px; }
    .year-link a { color: var(--accent); font-weight: 600; }
    .masonry { columns: 3 260px; column-gap: 16px; margin-top: 16px; }
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
  `,
})
export class GalleryPage {
  protected readonly i18n = inject(I18nService);
  protected readonly manifest = toSignal(inject(ContentService).years());
  protected readonly year = signal<number | 'all'>('all');
  protected readonly open = signal<number | null>(null);

  protected readonly photos = computed(() => {
    const years = this.manifest()?.years ?? [];
    const chosen = this.year();
    return years
      .filter((y) => chosen === 'all' || y.year === chosen)
      .flatMap((y) =>
        y.images.map((img) => ({
          src: img.src,
          caption: this.i18n.tr(img, 'caption') || `${this.i18n.t('utsavYear')} ${this.i18n.digits(y.year)}`,
        })),
      );
  });

  pick(y: number | 'all'): void {
    this.open.set(null);
    this.year.set(y);
  }
}
