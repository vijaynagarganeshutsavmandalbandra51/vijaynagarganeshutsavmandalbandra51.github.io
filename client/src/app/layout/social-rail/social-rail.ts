import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { ContentService } from '../../core/content.service';

/** Floating social icons on the left edge (desktop), shown after scrolling down a little. */
@Component({
  selector: 'app-social-rail',
  template: `
    @if (links().length) {
      <aside class="rail" [class.rail--show]="visible()" aria-label="Social media">
        @for (l of links(); track l.name) {
          <a [href]="l.url" target="_blank" rel="noopener" [attr.aria-label]="l.name" [title]="l.name" [style.--c]="l.color">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="l.icon" /></svg>
          </a>
        }
      </aside>
    }
  `,
  styles: `
    .rail {
      position: fixed; left: 0; top: 50%; z-index: 40;
      display: flex; flex-direction: column; gap: 2px;
      transform: translate(-100%, -50%); opacity: 0; pointer-events: none;
      transition: transform .35s ease, opacity .35s ease;
    }
    .rail--show { transform: translate(0, -50%); opacity: 1; pointer-events: auto; }
    a {
      display: grid; place-items: center; width: 48px; height: 48px;
      background: var(--c); color: #fff; border-radius: 0 10px 10px 0;
      transition: width .2s ease;
    }
    a:hover { width: 60px; }
    svg { width: 22px; height: 22px; fill: currentColor; }
    @media (max-width: 900px) { .rail { display: none; } }
  `,
})
export class SocialRail {
  private readonly mandal = inject(ContentService).mandal;
  protected readonly visible = signal(false);

  protected readonly links = computed(() => {
    const s = this.mandal()?.social ?? {};
    const all = [
      { name: 'YouTube', url: s.youtube, color: '#ff0000', icon: ICONS.youtube },
      { name: 'Facebook', url: s.facebook, color: '#1877f2', icon: ICONS.facebook },
      { name: 'Instagram', url: s.instagram, color: '#d62976', icon: ICONS.instagram },
      { name: 'WhatsApp', url: s.whatsapp, color: '#25d366', icon: ICONS.whatsapp },
    ];
    return all.filter((l) => !!l.url);
  });

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > 300);
  }
}

/** Simple-icons style 24×24 paths. */
export const ICONS = {
  youtube:
    'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z',
  facebook:
    'M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z',
  instagram:
    'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z',
  whatsapp:
    'M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.6-.3zM12 21.8a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.3-1.7a11.8 11.8 0 0 0 5.7 1.4A11.8 11.8 0 0 0 20.4 3.6z',
};
