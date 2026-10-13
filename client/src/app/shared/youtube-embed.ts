import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { I18nService } from '../core/i18n.service';

/**
 * Responsive YouTube player.
 * - videoId: the part after "watch?v=" (e.g. https://youtube.com/watch?v=ABC123 -> "ABC123")
 * - channelId: shows the channel's current LIVE stream instead (for Live Darshan)
 * Shows a decorative placeholder when no id is set yet.
 */
@Component({
  selector: 'app-youtube',
  template: `
    <div class="frame">
      @if (url(); as u) {
        <iframe
          [src]="u"
          [title]="title() || 'YouTube video'"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      } @else {
        <div class="placeholder">
          <span class="play" aria-hidden="true">▶</span>
          <span>{{ i18n.t('videoComing') }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .frame {
      position: relative; aspect-ratio: 16 / 9; width: 100%;
      border-radius: 16px; overflow: hidden;
      border: 3px solid var(--marigold);
      box-shadow: 0 25px 50px -20px rgba(20, 40, 80, .55);
      background: var(--primary-deep);
    }
    iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
    .placeholder {
      position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
      color: var(--cream); font-weight: 600;
      background:
        radial-gradient(circle at 50% 45%, rgba(245, 158, 11, .35), transparent 55%),
        linear-gradient(135deg, var(--primary), var(--primary-deep));
    }
    .play {
      display: grid; place-items: center; width: 72px; height: 72px; border-radius: 50%;
      background: rgba(255, 255, 255, .15); border: 2px solid rgba(255, 255, 255, .5); font-size: 1.6rem; padding-left: 6px;
    }
  `,
})
export class YoutubeEmbed {
  protected readonly i18n = inject(I18nService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly videoId = input<string | undefined>();
  readonly channelId = input<string | undefined>();
  readonly title = input<string>('');

  protected readonly url = computed<SafeResourceUrl | null>(() => {
    const id = (this.videoId() ?? '').trim();
    const channel = (this.channelId() ?? '').trim();
    let src = '';
    if (/^[\w-]{6,20}$/.test(id)) {
      src = `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    } else if (/^UC[\w-]{10,40}$/.test(channel)) {
      src = `https://www.youtube.com/embed/live_stream?channel=${channel}`;
    }
    // Only YouTube URLs built above are ever trusted.
    return src ? this.sanitizer.bypassSecurityTrustResourceUrl(src) : null;
  });
}
