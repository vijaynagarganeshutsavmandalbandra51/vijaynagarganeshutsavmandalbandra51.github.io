import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n.service';
import { PageBanner } from '../../shared/page-banner/page-banner';
import { Reveal } from '../../shared/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [PageBanner, Reveal, RouterLink],
  template: `
    <app-page-banner
      [title]="i18n.t('history')"
      [subtitle]="i18n.isMr() ? i18n.digits(mandal()?.established ?? '') + ' पासून बाप्पाचा उत्सव' : 'Celebrating Bappa together since ' + (mandal()?.established ?? '')"
    />

    @if (mandal(); as m) {
      <section class="section section--blush">
        <div class="container story">
          <div class="story__text" appReveal="left">
            @for (p of i18n.trList(m.history, 'paragraphs'); track $index) {
              <p [class.lead]="$first">{{ p }}</p>
            }
          </div>
          <aside class="story__card" appReveal="right">
            <img [src]="m.history.image" alt="" loading="lazy" />
            <div class="stats">
              @for (s of m.stats; track s.label) {
                <div class="stat">
                  <strong>{{ i18n.digits(s.value) }}</strong>
                  <span>{{ i18n.tr(s, 'label') }}</span>
                </div>
              }
            </div>
          </aside>
        </div>
      </section>

      <section class="section section--warm">
        <div class="container">
          <h2 class="section-title">{{ i18n.isMr() ? 'आमचा प्रवास' : 'Our Journey' }}</h2>
          <ol class="timeline">
            @for (t of m.history.timeline; track t.year) {
              <li appReveal>
                <span class="timeline__year">{{ i18n.digits(t.year) }}</span>
                <div class="timeline__card">
                  <h3>{{ i18n.tr(t, 'title') }}</h3>
                  <p>{{ i18n.tr(t, 'text') }}</p>
                </div>
              </li>
            }
          </ol>
          <p class="center">
            <a routerLink="/years" class="btn btn--primary">{{ i18n.t('years') }} →</a>
          </p>
        </div>
      </section>
    }
  `,
  styles: `
    .story { display: grid; grid-template-columns: 1.4fr 1fr; gap: 48px; align-items: start; }
    .story__text p { font-size: 1.08rem; }
    .lead { font-size: 1.3rem !important; color: var(--primary-deep); }
    .story__card img { width: 100%; border-radius: 18px; border: 4px solid #fff; box-shadow: 0 25px 50px -25px rgba(20,40,80,.6); }
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
    .stat { padding: 16px; border-radius: 14px; color: #fff; background: linear-gradient(140deg, var(--accent), var(--primary)); }
    .stat strong { display: block; font-family: var(--font-display); font-size: 2rem; line-height: 1; }
    .stat span { font-size: .9rem; opacity: .9; }

    .timeline { list-style: none; padding: 0; margin: 32px auto 0; max-width: 760px; position: relative; }
    .timeline::before { content: ''; position: absolute; left: 44px; top: 0; bottom: 0; width: 3px; background: var(--accent); opacity: .3; }
    .timeline li { display: grid; grid-template-columns: 90px 1fr; gap: 20px; align-items: center; margin-bottom: 22px; position: relative; }
    .timeline__year {
      z-index: 1; justify-self: center; display: grid; place-items: center; width: 80px; height: 80px; border-radius: 50%;
      background: var(--accent); color: #fff; font-weight: 700; font-size: 1.1rem; border: 4px solid #fff;
      box-shadow: 0 8px 20px -8px rgba(20,40,80,.6);
    }
    .timeline__card { padding: 18px 22px; border-radius: 14px; background: #fff; border: 1px solid #f5dcb8; }
    .timeline__card h3 { margin-bottom: 4px; color: var(--accent); }
    .timeline__card p { margin: 0; color: var(--ink-soft); }
    .center { text-align: center; margin-top: 40px; }
    @media (max-width: 820px) { .story { grid-template-columns: 1fr; } }
    @media (max-width: 600px) {
      .lead { font-size: 1.12rem !important; }
      .timeline::before { left: 30px; }
      .timeline li { grid-template-columns: 60px 1fr; gap: 12px; }
      .timeline__year { width: 58px; height: 58px; font-size: .9rem; border-width: 3px; }
      .timeline__card { padding: 14px 16px; }
    }
  `,
})
export class About {
  protected readonly i18n = inject(I18nService);
  protected readonly mandal = inject(ContentService).mandal;
}
