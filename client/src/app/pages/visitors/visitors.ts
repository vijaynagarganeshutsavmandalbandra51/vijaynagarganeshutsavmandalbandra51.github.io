import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n.service';
import { Visitor } from '../../core/models';
import { Lightbox } from '../../shared/lightbox';
import { PageBanner } from '../../shared/page-banner/page-banner';
import { Reveal } from '../../shared/reveal.directive';

/**
 * /visitors – leaders and public figures who visited the pandal.
 * Add a person: copy one block in public/data/visitors.json and put the photo in public/images/visitors/.
 */
@Component({
  selector: 'app-visitors',
  imports: [PageBanner, Reveal, Lightbox],
  template: `
    <app-page-banner [title]="i18n.t('visitors')" [subtitle]="data() ? i18n.tr(data()!, 'intro') : ''" />

    <section class="section section--warm">
      <div class="container">
        @for (g of groups(); track g.year) {
          <h2 class="year">
            <span>{{ i18n.isMr() ? 'गणेशोत्सव' : 'Ganeshotsav' }} {{ i18n.digits(g.year) }}</span>
          </h2>
          <div class="grid">
            @for (v of g.items; track v.photo) {
              <article class="vcard" appReveal>
                <button type="button" class="vcard__img" (click)="openPhoto(v)" [attr.aria-label]="i18n.tr(v, 'name')">
                  <img [src]="v.photo" [alt]="i18n.tr(v, 'name')" loading="lazy" />
                </button>
                <div class="vcard__body">
                  <h3>{{ i18n.tr(v, 'name') }}</h3>
                  @if (i18n.tr(v, 'role')) {
                    <p class="role">{{ i18n.tr(v, 'role') }}</p>
                  }
                  @if (i18n.tr(v, 'text')) {
                    <p class="text">{{ i18n.tr(v, 'text') }}</p>
                  }
                </div>
              </article>
            }
          </div>
        } @empty {
          <p class="loading">Loading…</p>
        }
      </div>
    </section>

    <app-lightbox [items]="photos()" [(index)]="open" />
  `,
  styles: `
    .year { display: flex; align-items: center; gap: 16px; color: var(--accent); margin: 0 0 22px; }
    .year::after { content: ''; flex: 1; height: 2px; background: linear-gradient(90deg, rgba(232,119,34,.5), transparent); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; margin-bottom: 56px; }
    .vcard { background: #fff; border-radius: 18px; overflow: hidden; border: 1px solid rgba(232,119,34,.2);
      box-shadow: 0 24px 44px -28px rgba(20,40,80,.55); display: flex; flex-direction: column; }
    .vcard__img { display: block; padding: 0; border: 0; cursor: zoom-in; background: var(--primary); aspect-ratio: 4 / 3; overflow: hidden; }
    .vcard__img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
    .vcard__img:hover img { transform: scale(1.04); }
    .vcard__body { padding: 18px 20px 22px; }
    h3 { margin: 0 0 6px; color: var(--primary); font-size: 1.3rem; }
    .role { margin: 0 0 10px; color: var(--accent); font-weight: 600; font-size: .95rem; line-height: 1.5; }
    .text { margin: 0; color: #555; line-height: 1.6; }
    @media (max-width: 600px) {
      .grid { grid-template-columns: 1fr; gap: 20px; margin-bottom: 40px; }
    }
  `,
})
export class VisitorsPage {
  protected readonly i18n = inject(I18nService);
  protected readonly data = toSignal(inject(ContentService).visitors());
  protected readonly open = signal<number | null>(null);

  /** Newest year first; within a year, in the order written in the JSON. */
  protected readonly groups = computed(() => {
    const list = this.data()?.visitors ?? [];
    const years = [...new Set(list.map((v) => v.year))].sort((a, b) => b - a);
    return years.map((year) => ({ year, items: list.filter((v) => v.year === year) }));
  });

  private readonly flat = computed(() => this.groups().flatMap((g) => g.items));
  protected readonly photos = computed(() =>
    this.flat().map((v) => ({ src: v.photo, caption: `${this.i18n.tr(v, 'name')} – ${this.i18n.digits(v.year)}` })),
  );

  protected openPhoto(v: Visitor): void {
    this.open.set(this.flat().indexOf(v));
  }
}
