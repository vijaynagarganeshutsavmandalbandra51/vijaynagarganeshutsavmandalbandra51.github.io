import { Component, inject } from '@angular/core';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n.service';

/** Red news strip that scrolls right-to-left under the menu (texts from mandal.json → marquee). */
@Component({
  selector: 'app-marquee',
  template: `
    @if (mandal()?.marquee?.length) {
      <div class="strip" role="marquee" aria-label="News">
        <div class="track">
          @for (copy of [0, 1]; track copy) {
            <div class="group" [attr.aria-hidden]="copy === 1">
              @for (m of mandal()!.marquee; track $index) {
                <span class="item"><span class="dot" aria-hidden="true">✦</span>{{ i18n.tr(m, 'text') }}</span>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .strip {
      overflow: hidden;
      background: var(--primary-deep);
      color: var(--white);
      border-top: 1px solid rgba(255, 255, 255, .12);
      border-bottom: 3px solid var(--marigold);
    }
    .track { display: flex; width: max-content; animation: scroll 40s linear infinite; }
    .strip:hover .track { animation-play-state: paused; }
    .group { display: flex; flex-shrink: 0; }
    .item { padding: 9px 28px; white-space: nowrap; font-size: .95rem; }
    .dot { color: var(--marigold); margin-right: 12px; }
    @media (max-width: 600px) { .item { padding: 7px 20px; font-size: .85rem; } .track { animation-duration: 32s; } }
    @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  `,
})
export class Marquee {
  protected readonly mandal = inject(ContentService).mandal;
  protected readonly i18n = inject(I18nService);
}
