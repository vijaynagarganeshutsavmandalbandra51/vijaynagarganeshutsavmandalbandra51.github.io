import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n.service';
import { PageBanner } from '../../shared/page-banner/page-banner';
import { PeopleGrid } from '../../shared/people-grid';

/** /committee – Committee Members, and Helpers below it (content: data/committee.json) */
@Component({
  selector: 'app-committee',
  imports: [PageBanner, PeopleGrid],
  template: `
    <app-page-banner
      [title]="i18n.tr(data()?.committee, 'title') || i18n.t('committee')"
      [subtitle]="(i18n.isMr() ? 'गणेशोत्सव ' : 'Ganeshotsav ') + i18n.digits(data()?.year ?? '')"
    />

    @if (data(); as c) {
      <section class="section section--blush">
        <div class="container">
          <app-people-grid [people]="c.committee.members" />
        </div>
      </section>

      @if (c.helpers?.members?.length) {
        <section class="section section--warm">
          <div class="container">
            <h2 class="section-title">{{ i18n.tr(c.helpers, 'title') }}</h2>
            <app-people-grid [people]="c.helpers!.members" variant="compact" />
          </div>
        </section>
      }
    } @else {
      <p class="loading">Loading…</p>
    }
  `,
  styles: `
    .section-title { margin-bottom: 32px; }
  `,
})
export class CommitteePage {
  protected readonly i18n = inject(I18nService);
  protected readonly data = toSignal(inject(ContentService).committee());
}
