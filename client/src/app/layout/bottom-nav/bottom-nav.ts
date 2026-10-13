import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService, LabelKey } from '../../core/i18n.service';

/**
 * App-style tab bar fixed to the bottom of the screen on phones (hidden on desktop).
 * Most visitors use mobile, so the most-used pages are one thumb-tap away.
 */
@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="tabbar" aria-label="Quick links">
      @for (t of tabs; track t.label) {
        <a
          [routerLink]="t.path"
          [fragment]="t.fragment"
          routerLinkActive="on"
          [routerLinkActiveOptions]="{ exact: t.path === '/' }"
          [class.tab--donate]="t.donate"
          class="tab"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="t.icon" /></svg>
          <span>{{ i18n.t(t.label) }}</span>
        </a>
      }
    </nav>
  `,
  styles: `
    :host { display: none; }
    @media (max-width: 900px) { :host { display: block; } }

    .tabbar {
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 70;
      display: grid; grid-template-columns: repeat(5, 1fr);
      padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
      background: rgba(255, 255, 255, .97); backdrop-filter: blur(10px);
      border-top: 1px solid var(--line);
      box-shadow: 0 -8px 24px -12px rgba(11, 24, 48, .35);
    }
    .tab {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
      min-height: 52px; border-radius: 12px; color: var(--ink-soft); text-decoration: none;
      font-size: .72rem; font-weight: 600; line-height: 1.1; text-align: center;
      -webkit-tap-highlight-color: transparent;
    }
    .tab svg { width: 24px; height: 24px; fill: currentColor; }
    .tab.on { color: var(--accent); }
    .tab.on svg { transform: translateY(-1px); }
    .tab--donate { color: var(--primary-deep); }
    .tab--donate svg {
      width: 44px; height: 44px; margin-top: -22px; padding: 10px; border-radius: 50%;
      background: var(--marigold); box-shadow: 0 6px 16px -6px rgba(232, 115, 26, .9); border: 3px solid #fff;
    }
  `,
})
export class BottomNav {
  protected readonly i18n = inject(I18nService);

  protected readonly tabs: { label: LabelKey; path: string; icon: string; fragment?: string; donate?: boolean }[] = [
    { label: 'home', path: '/', icon: 'M12 3 2 12h3v8h5v-6h4v6h5v-8h3L12 3z' },
    { label: 'scheduleShort', path: '/schedule', icon: 'M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm-2 7h14v11H5V9zm2 2v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2zm-8 4v2h2v-2H7zm4 0v2h2v-2h-2z' },
    { label: 'donate', path: '/contact', fragment: 'donate', donate: true, icon: 'M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
    { label: 'contact', path: '/contact', icon: 'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z' },
    { label: 'photos', path: '/years', icon: 'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z' },
  ];
}
