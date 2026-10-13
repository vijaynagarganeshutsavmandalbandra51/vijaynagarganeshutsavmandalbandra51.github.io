import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n.service';
import { PageBanner } from '../../shared/page-banner/page-banner';
import { Reveal } from '../../shared/reveal.directive';

/**
 * /decoration – the decoration theme of every year.
 * Comes from the "title" / "text" in each media/years/<year>/info.json.
 */
@Component({
  selector: 'app-decoration',
  imports: [PageBanner, RouterLink, Reveal],
  template: `
    <app-page-banner [title]="i18n.t('decoration')" [subtitle]="i18n.isMr() ? 'दरवर्षीचा आमचा देखावा' : 'The decoration theme of our pandal, year by year.'" />

    <section class="section section--warm">
      <div class="container">
        @for (t of themes(); track t.year; let odd = $odd) {
          <article class="row" [class.row--flip]="odd" appReveal>
            <a class="row__img" [routerLink]="['/years', t.year]">
              @if (t.cover) {
                <img [src]="t.cover" [alt]="i18n.tr(t, 'title')" loading="lazy" />
              }
              <span class="row__year">{{ i18n.digits(t.year) }}</span>
            </a>
            <div class="row__text">
              <span class="row__edition">{{ i18n.edition(t.edition) }}</span>
              <h2>{{ i18n.tr(t, 'title') }}</h2>
              <p>{{ i18n.tr(t, 'text') }}</p>
              @if (t.team; as team) {
                <figure class="team">
                  <img [src]="team.photo" [alt]="i18n.tr(team, 'title')" loading="lazy" />
                  <figcaption>
                    <strong>🙏 {{ i18n.tr(team, 'title') }}</strong>
                    <span>{{ i18n.tr(team, 'text') }}</span>
                  </figcaption>
                </figure>
              }
              <a class="btn btn--primary" [routerLink]="['/years', t.year]">{{ i18n.t('viewYear') }} →</a>
            </div>
          </article>
        } @empty {
          <p class="loading">{{ manifest() ? i18n.t('noPhotos') : 'Loading…' }}</p>
        }
      </div>
    </section>
  `,
  styles: `
    .row { display: grid; grid-template-columns: 1fr 1.2fr; gap: 48px; align-items: center; margin-bottom: 72px; }
    .row:last-child { margin-bottom: 0; }
    .row--flip .row__img { order: 2; }
    .row__img { position: relative; display: block; overflow: hidden; border-radius: 18px; aspect-ratio: 4 / 3;
      background: var(--primary); border: 4px solid #fff; box-shadow: 0 30px 50px -25px rgba(20,40,80,.6); }
    .row__img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
    .row__img:hover img { transform: scale(1.05); }
    .row__year { position: absolute; left: 16px; bottom: 14px; color: #fff; font-family: var(--font-display);
      font-size: 2.6rem; font-weight: 700; text-shadow: 0 4px 16px rgba(0,0,0,.6); }
    .row__edition { display: inline-block; padding: 3px 12px; border-radius: 999px; background: var(--accent); color: #fff;
      font-size: .85rem; font-weight: 700; margin-bottom: 10px; }
    h2 { color: var(--accent); }
    .team { margin: 0 0 22px; border-radius: 16px; overflow: hidden; background: #fff;
      border: 1px solid rgba(232,119,34,.25); box-shadow: 0 18px 36px -24px rgba(20,40,80,.5); }
    .team img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; object-position: center 62%; }
    .team figcaption { padding: 14px 18px 16px; display: grid; gap: 6px; }
    .team strong { color: var(--primary); font-size: 1.05rem; }
    .team span { color: var(--muted, #555); font-size: .95rem; line-height: 1.55; }
    @media (max-width: 820px) {
      .row { grid-template-columns: 1fr; gap: 18px; margin-bottom: 48px; }
      .row__year { font-size: 2rem; }
      .row--flip .row__img { order: 0; }
    }
  `,
})
export class DecorationPage {
  protected readonly i18n = inject(I18nService);
  protected readonly manifest = toSignal(inject(ContentService).years());
  /** Only years whose info.json has a title. */
  protected readonly themes = computed(() => (this.manifest()?.years ?? []).filter((y) => !!y.title));
}
