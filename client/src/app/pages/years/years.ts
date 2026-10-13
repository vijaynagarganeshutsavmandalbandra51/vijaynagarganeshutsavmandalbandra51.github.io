import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n.service';
import { PageBanner } from '../../shared/page-banner/page-banner';
import { Reveal } from '../../shared/reveal.directive';

/** /years – one card per folder in public/media/years */
@Component({
  selector: 'app-years',
  imports: [PageBanner, RouterLink, Reveal],
  template: `
    <app-page-banner [title]="i18n.t('years')" [subtitle]="subtitle()" />

    <section class="section section--blush">
      <div class="container">
        @if (manifest(); as mf) {
          <div class="grid">
            @for (y of mf.years; track y.year) {
              <a class="card" [routerLink]="['/years', y.year]" appReveal="zoom">
                <div class="card__img">
                  @if (y.cover) {
                    <img [src]="y.cover" [alt]="'Ganpati ' + y.year" loading="lazy" />
                  }
                  <span class="card__edition">{{ i18n.edition(y.edition) }}</span>
                </div>
                <div class="card__body">
                  <span class="card__year">{{ i18n.digits(y.year) }}</span>
                  @if (y.title) {
                    <h3>{{ i18n.tr(y, 'title') }}</h3>
                  }
                  <span class="card__meta">
                    📷 {{ i18n.digits(y.images.length) }}
                    @if (y.videos.length) {
                      · 🎬 {{ i18n.digits(y.videos.length) }}
                    }
                  </span>
                </div>
              </a>
            } @empty {
              <p class="loading">{{ i18n.t('noPhotos') }}</p>
            }
          </div>
        } @else {
          <p class="loading">Loading…</p>
        }
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; }
    .card {
      display: flex; flex-direction: column; overflow: hidden; border-radius: 18px; text-decoration: none; color: inherit;
      background: var(--white); border: 1px solid #f5dcb8; box-shadow: 0 14px 30px -20px rgba(20,40,80,.6);
      transition: transform .25s ease, box-shadow .25s ease;
    }
    .card:hover { transform: translateY(-6px); box-shadow: 0 24px 40px -20px rgba(20,40,80,.7); }
    .card__img { position: relative; aspect-ratio: 3 / 4; overflow: hidden; background: var(--primary); }
    .card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
    .card:hover .card__img img { transform: scale(1.06); }
    .card__edition {
      position: absolute; top: 12px; left: 12px; padding: 4px 12px; border-radius: 999px;
      background: var(--accent); color: #fff; font-size: .82rem; font-weight: 700;
    }
    .card__body { padding: 16px 18px 18px; }
    .card__year { display: block; font-family: var(--font-display); font-size: 2rem; font-weight: 700; line-height: 1; color: var(--accent); }
    h3 { font-family: var(--font-body); font-size: 1.02rem; font-weight: 600; margin: 8px 0 6px; color: var(--ink); }
    .card__meta { font-size: .85rem; color: var(--ink-soft); }
    @media (max-width: 600px) {
      .grid { grid-template-columns: 1fr 1fr; gap: 12px; }
      .card { border-radius: 14px; }
      .card__body { padding: 10px 12px 12px; }
      .card__year { font-size: 1.5rem; }
      .card__edition { top: 8px; left: 8px; font-size: .72rem; padding: 3px 9px; }
      h3 { font-size: .88rem; }
    }
  `,
})
export class YearsPage {
  protected readonly i18n = inject(I18nService);
  private readonly content = inject(ContentService);
  protected readonly manifest = toSignal(this.content.years());

  protected subtitle(): string {
    const first = this.manifest()?.firstUtsavYear ?? this.content.mandal()?.firstUtsavYear;
    if (!first) return '';
    return this.i18n.isMr()
      ? `${this.i18n.digits(first)} पासून आमच्या बाप्पाची छायाचित्रे व व्हिडिओ`
      : `Photos and videos of our Bappa, year by year, since ${first}`;
  }
}
