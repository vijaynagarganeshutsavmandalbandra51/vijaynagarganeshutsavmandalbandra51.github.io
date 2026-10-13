import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n.service';
import { PageBanner } from '../../shared/page-banner/page-banner';
import { Reveal } from '../../shared/reveal.directive';

/** /initiatives?tab=social|educational  (content: data/initiatives.json) */
@Component({
  selector: 'app-initiatives',
  imports: [PageBanner, RouterLink, Reveal],
  template: `
    <app-page-banner [title]="i18n.t('initiatives')" [subtitle]="i18n.isMr() ? 'उत्सवासोबतच वर्षभर समाजसेवा' : 'Serving the community throughout the year, not just during the festival.'" />

    <section class="section section--blush">
      <div class="container">
        <div class="tabs" role="tablist">
          <a role="tab" routerLink="/initiatives" [queryParams]="{ tab: 'social' }" [class.active]="current() === 'social'" [attr.aria-selected]="current() === 'social'">
            🤝 {{ i18n.t('socialInitiatives') }}
          </a>
          <a role="tab" routerLink="/initiatives" [queryParams]="{ tab: 'educational' }" [class.active]="current() === 'educational'" [attr.aria-selected]="current() === 'educational'">
            📚 {{ i18n.t('educationalInitiatives') }}
          </a>
        </div>

        @if (data(); as d) {
          <div class="grid">
            @for (item of d[current()]; track item.title) {
              <article class="card" appReveal="zoom">
                @if (item.image) {
                  <img [src]="item.image" [alt]="i18n.tr(item, 'title')" loading="lazy" />
                } @else {
                  <span class="icon" aria-hidden="true">{{ item.icon }}</span>
                }
                <h3>{{ i18n.tr(item, 'title') }}</h3>
                <p>{{ i18n.tr(item, 'text') }}</p>
              </article>
            }
          </div>
        } @else {
          <p class="loading">Loading…</p>
        }
      </div>
    </section>
  `,
  styles: `
    .tabs { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-bottom: 40px; }
    .tabs a { padding: 10px 22px; border-radius: 999px; border: 1px solid #f5dcb8; background: #fff;
      color: var(--ink); font-weight: 600; text-decoration: none; }
    .tabs a.active { background: var(--accent); color: #fff; border-color: var(--accent); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
    .card { padding: 28px; border-radius: 18px; background: #fff; border: 1px solid #f5dcb8; text-align: center;
      box-shadow: 0 14px 30px -20px rgba(20,40,80,.55); transition: transform .25s ease; }
    .card:hover { transform: translateY(-5px); }
    .card img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; border-radius: 12px; margin-bottom: 16px; }
    .icon { display: inline-grid; place-items: center; width: 72px; height: 72px; margin-bottom: 14px;
      border-radius: 50%; background: #ffedd5; font-size: 2rem; }
    h3 { color: var(--accent); }
    p { margin: 0; color: var(--ink-soft); }
    @media (max-width: 600px) {
      .tabs { margin-bottom: 24px; }
      .tabs a { flex: 1; text-align: center; padding: 10px 12px; font-size: .9rem; }
      .card { padding: 20px; }
    }
  `,
})
export class InitiativesPage {
  protected readonly i18n = inject(I18nService);
  protected readonly data = toSignal(inject(ContentService).initiatives());
  /** ?tab=… query param */
  readonly tab = input<string>();
  protected readonly current = computed<'social' | 'educational'>(() => (this.tab() === 'educational' ? 'educational' : 'social'));
}
