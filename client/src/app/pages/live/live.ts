import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n.service';
import { PageBanner } from '../../shared/page-banner/page-banner';
import { Reveal } from '../../shared/reveal.directive';
import { YoutubeEmbed } from '../../shared/youtube-embed';

/**
 * /live – Live darshan + all videos.
 * Live: mandal.json → live.youtubeLiveVideoId (a specific live stream) or live.youtubeChannelId (channel's current live).
 * Videos: data/videos.json
 */
@Component({
  selector: 'app-live',
  imports: [PageBanner, YoutubeEmbed, Reveal, RouterLink],
  template: `
    <app-page-banner [title]="'🔴 ' + i18n.t('live')" [subtitle]="i18n.tr(mandal()?.live, 'note')" />

    <section class="section section--warm">
      <div class="container narrow" appReveal>
        <app-youtube
          [videoId]="mandal()?.live?.youtubeLiveVideoId"
          [channelId]="mandal()?.live?.youtubeChannelId"
          [title]="i18n.t('live')"
        />
        @if (mandal()?.social?.youtube; as yt) {
          <a class="btn btn--primary yt" [href]="yt" target="_blank" rel="noopener">▶ YouTube</a>
        }
      </div>
    </section>

    <section class="section section--blush" id="videos">
      <div class="container">
        <h2 class="section-title">🎬 {{ i18n.t('videos') }}</h2>
        <div class="grid">
          @for (v of videos(); track v.title) {
            <article class="video" appReveal>
              <app-youtube [videoId]="v.youtubeId" [title]="i18n.tr(v, 'title')" />
              <h3>{{ i18n.tr(v, 'title') }}</h3>
              @if (v.text) {
                <p>{{ i18n.tr(v, 'text') }}</p>
              }
            </article>
          }
        </div>
        <p class="more">
          <a routerLink="/years">{{ i18n.t('years') }} →</a>
        </p>
      </div>
    </section>
  `,
  styles: `
    .narrow { max-width: 960px; text-align: center; }
    .yt { margin-top: 24px; background: #ff0000; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 32px; margin-top: 32px; }
    h3 { margin: 16px 0 4px; color: var(--accent); }
    p { margin: 0; color: var(--ink-soft); }
    .more { text-align: center; margin-top: 40px; }
    .more a { color: var(--accent); font-weight: 700; }
    @media (max-width: 600px) { .grid { grid-template-columns: 1fr; gap: 28px; } }
  `,
})
export class LivePage {
  protected readonly i18n = inject(I18nService);
  private readonly content = inject(ContentService);
  protected readonly mandal = this.content.mandal;
  private readonly data = toSignal(this.content.videos());
  protected readonly videos = computed(() => this.data()?.videos ?? []);
}
