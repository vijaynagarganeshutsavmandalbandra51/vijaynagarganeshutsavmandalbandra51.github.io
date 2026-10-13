import { Component, input } from '@angular/core';

/** Coloured banner shown at the top of every inner page. */
@Component({
  selector: 'app-page-banner',
  template: `
    <section class="banner">
      <div class="container">
        @if (marathi()) {
          <span class="banner__marathi marathi">{{ marathi() }}</span>
        }
        <h1>{{ title() }}</h1>
        @if (subtitle()) {
          <p>{{ subtitle() }}</p>
        }
      </div>
    </section>
  `,
  styles: `
    .banner {
      position: relative;
      overflow: hidden;
      padding: 64px 0 56px;
      text-align: center;
      color: var(--cream);
      background:
        radial-gradient(circle at 15% 120%, rgba(245, 158, 11, .45), transparent 45%),
        radial-gradient(circle at 85% -20%, rgba(232, 115, 26, .6), transparent 45%),
        linear-gradient(120deg, var(--accent), var(--primary));
    }
    .banner::after {
      content: '';
      position: absolute; left: 0; right: 0; bottom: 0; height: 10px;
      background: radial-gradient(circle, var(--marigold) 4px, transparent 5px) 0 0 / 18px 10px repeat-x;
    }
    h1 { color: #fff; margin-bottom: 8px; }
    .banner__marathi { display: block; color: var(--marigold); font-size: 1.2rem; margin-bottom: 4px; }
    p { max-width: 620px; margin: 0 auto; opacity: .9; }
    @media (max-width: 600px) { .banner { padding: 36px 0 34px; } p { font-size: .95rem; } }
  `,
})
export class PageBanner {
  readonly title = input.required<string>();
  readonly marathi = input<string>();
  readonly subtitle = input<string>();
}
