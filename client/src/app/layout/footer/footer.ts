import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { I18nService, LabelKey } from '../../core/i18n.service';
import { ICONS } from '../social-rail/social-rail';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    @if (mandal(); as m) {
      <footer class="footer">
        <div class="container footer__grid">
          <div>
            <a routerLink="/" class="footer__brand">
              <img [src]="m.logo" alt="" width="56" height="56" />
              <span>{{ i18n.tr(m, 'name') }}</span>
            </a>
            <h4>{{ i18n.t('aboutUs') }}</h4>
            <p class="muted">{{ i18n.tr(m.about, 'short') }}</p>
            <div class="social">
              @for (s of socials(); track s.name) {
                <a [href]="s.url" target="_blank" rel="noopener" [attr.aria-label]="s.name" [title]="s.name">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="s.icon" /></svg>
                </a>
              }
            </div>
          </div>

          <div>
            <h4>{{ i18n.t('importantLinks') }}</h4>
            <ul class="links">
              @for (l of links; track l.label) {
                <li>
                  <a [routerLink]="l.path" [queryParams]="l.query" [fragment]="l.fragment">{{ i18n.t(l.label) }}</a>
                </li>
              }
            </ul>
          </div>

          <div>
            <h4>{{ i18n.t('contactUs') }}</h4>
            <ul class="contact">
              @if (m.contact.phone) {
                <li><span>{{ i18n.t('phone') }}:</span>&nbsp;<a [href]="m.contact.whatsapp ? (m.social.whatsapp || ('https://wa.me/' + m.contact.whatsapp)) : 'tel:' + m.contact.phone" target="_blank" rel="noopener">{{ m.contact.phone }}</a></li>
              }
              @if (m.contact.email) {
                <li><span>{{ i18n.t('email') }}:</span>&nbsp;<a [href]="'mailto:' + m.contact.email">{{ m.contact.email }}</a></li>
              }
              <li><span>{{ i18n.t('address') }}:</span> {{ i18n.tr(m, 'address') }}</li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span class="marathi">|| गणपती बाप्पा मोरया ||</span>
          <span>© {{ year }} {{ i18n.tr(m, 'name') }}</span>
        </div>
      </footer>
    }
  `,
  styles: `
    .footer { background: var(--primary); color: var(--white); }
    .footer__grid { display: grid; grid-template-columns: 1.4fr 1fr 1.2fr; gap: 40px; padding-top: 56px; padding-bottom: 40px; }
    .footer__brand { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; color: var(--white); text-decoration: none; font-weight: 700; font-size: 1.1rem; }
    .footer__brand img { border-radius: 50%; background: #fff; }
    h4 { margin: 0 0 14px; font-size: 1.1rem; font-weight: 700; }
    .muted { opacity: .85; font-size: .95rem; line-height: 1.7; }
    ul { list-style: none; margin: 0; padding: 0; }
    .links { columns: 2; column-gap: 20px; }
    .links li { break-inside: avoid; }
    .links a, .contact a { color: var(--white); opacity: .85; text-decoration: none; }
    .links a { display: inline-block; padding: 4px 0; }
    .links a:hover, .contact a:hover { opacity: 1; color: var(--marigold); }
    .contact li { margin-bottom: 10px; opacity: .92; }
    .contact span { font-weight: 700; }
    .social { display: flex; gap: 10px; margin-top: 18px; }
    .social a { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,.12); color: #fff; transition: background .2s; }
    .social a:hover { background: var(--marigold); color: var(--primary-deep); }
    .social svg { width: 18px; height: 18px; fill: currentColor; }
    .footer__bottom {
      display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 18px;
      padding: 16px; border-top: 1px solid rgba(255,255,255,.15); font-size: .9rem; opacity: .9; text-align: center;
    }
    .footer__bottom .marathi { color: var(--marigold); }
    @media (max-width: 860px) { .footer__grid { grid-template-columns: 1fr; gap: 28px; padding-top: 40px; padding-bottom: 28px; } }
  `,
})
export class Footer {
  protected readonly mandal = inject(ContentService).mandal;
  protected readonly i18n = inject(I18nService);
  protected readonly year = new Date().getFullYear();

  protected readonly links: { label: LabelKey; path: string; query?: Record<string, string>; fragment?: string }[] = [
    { label: 'home', path: '/' },
    { label: 'history', path: '/about' },
    { label: 'committee', path: '/committee' },
    { label: 'decoration', path: '/decoration' },
    { label: 'visitors', path: '/visitors' },
    { label: 'schedule', path: '/schedule' },
    { label: 'years', path: '/years' },
    { label: 'gallery', path: '/gallery' },
    { label: 'donation', path: '/contact', fragment: 'donate' },
    { label: 'contact', path: '/contact' },
  ];

  protected readonly socials = computed(() => {
    const s = this.mandal()?.social ?? {};
    return [
      { name: 'YouTube', url: s.youtube, icon: ICONS.youtube },
      { name: 'Facebook', url: s.facebook, icon: ICONS.facebook },
      { name: 'Instagram', url: s.instagram, icon: ICONS.instagram },
      { name: 'WhatsApp', url: s.whatsapp, icon: ICONS.whatsapp },
    ].filter((x) => !!x.url);
  });
}
