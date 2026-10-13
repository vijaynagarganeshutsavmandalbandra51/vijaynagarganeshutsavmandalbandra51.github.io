import { Component, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import QRCode from 'qrcode';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n.service';
import { PageBanner } from '../../shared/page-banner/page-banner';

@Component({
  selector: 'app-contact',
  imports: [PageBanner],
  template: `
    <app-page-banner [title]="i18n.t('contactUs') + ' & ' + i18n.t('donate')" [subtitle]="i18n.isMr() ? 'भेट द्या, फोन करा किंवा बाप्पाच्या उत्सवासाठी योगदान द्या.' : 'Visit us, call us, or contribute to Bappa’s celebration.'" />

    @if (mandal(); as m) {
      <section class="section">
        <div class="container contact">
          <div class="info">
            <div class="card info__item">
              <span class="info__icon" aria-hidden="true">📍</span>
              <div>
                <h3>{{ i18n.t('address') }}</h3>
                <p>{{ i18n.tr(m, 'address') }}</p>
                @if (m.contact.mapLink) {
                  <a [href]="m.contact.mapLink" target="_blank" rel="noopener">{{ i18n.t('getDirections') }} →</a>
                }
              </div>
            </div>
            @if (m.contact.phone) {
              <div class="card info__item">
                <span class="info__icon" aria-hidden="true">📞</span>
                <div>
                  <h3>{{ i18n.t('phone') }}</h3>
                  <a [href]="'tel:' + m.contact.phone">{{ m.contact.phone }}</a>
                  @if (m.contact.whatsapp) {
                    <br /><a [href]="'https://wa.me/' + m.contact.whatsapp" target="_blank" rel="noopener">WhatsApp →</a>
                  }
                </div>
              </div>
            }
            @if (m.contact.email) {
              <div class="card info__item">
                <span class="info__icon" aria-hidden="true">✉️</span>
                <div>
                  <h3>{{ i18n.t('email') }}</h3>
                  <a [href]="'mailto:' + m.contact.email">{{ m.contact.email }}</a>
                </div>
              </div>
            }
          </div>

          @if (mapUrl(); as url) {
            <div class="map card">
              <iframe [src]="url" title="Mandal location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          }
        </div>
      </section>

      @if (m.donation.enabled) {
        <section class="section section--warm" id="donate">
          <div class="container">
            <div class="section-head">
              <h2 class="section-title">{{ i18n.t('donation') }}</h2>
              <p>{{ i18n.tr(m.donation, 'note') }}</p>
            </div>

            <div class="donate">
              <div class="card upi">
                <h3>UPI</h3>
                @if (qr()) {
                  <img [src]="qr()" alt="UPI QR code for {{ m.donation.payeeName }}" width="220" height="220" />
                }
                <p class="upi__id">{{ m.donation.upiId }}</p>
                <div class="upi__actions">
                  <button type="button" class="btn btn--ghost" (click)="copy(m.donation.upiId)">
                    {{ copied() ? '✓' : (i18n.isMr() ? 'UPI ID कॉपी करा' : 'Copy UPI ID') }}
                  </button>
                  <a class="btn btn--primary" [href]="upiLink()">{{ i18n.isMr() ? 'UPI ॲप उघडा' : 'Open UPI app' }}</a>
                </div>
                <small>GPay · PhonePe · Paytm · BHIM</small>
              </div>

              @if (m.donation.bank; as b) {
                <div class="card bank">
                  <h3>{{ i18n.isMr() ? 'बँक हस्तांतरण' : 'Bank transfer' }}</h3>
                  <dl>
                    <dt>Account name</dt><dd>{{ b.accountName }}</dd>
                    <dt>Account number</dt><dd>{{ b.accountNumber }}</dd>
                    <dt>IFSC</dt><dd>{{ b.ifsc }}</dd>
                    <dt>Bank</dt><dd>{{ b.bankName }}</dd>
                  </dl>
                  <p class="muted">{{ i18n.isMr() ? 'पावतीसाठी व्यवहाराचा तपशील WhatsApp वर पाठवा.' : 'Please share the transaction details on WhatsApp so we can send your receipt.' }}</p>
                </div>
              }
            </div>
          </div>
        </section>
      }
    }
  `,
  styles: `
    .contact { display: grid; grid-template-columns: 1fr 1.3fr; gap: 28px; align-items: stretch; }
    .info { display: grid; gap: 16px; align-content: start; }
    .info__item { display: flex; gap: 16px; align-items: flex-start; }
    .info__item h3 { margin-bottom: 2px; }
    .info__item p { margin: 0 0 4px; }
    .info__item a { text-decoration: none; font-weight: 500; }
    .info__icon { display: grid; place-items: center; flex: none; width: 48px; height: 48px; border-radius: 50%;
      background: #ffedd5; font-size: 1.4rem; }
    .map { padding: 0; overflow: hidden; min-height: 360px; }
    .map iframe { width: 100%; height: 100%; min-height: 360px; border: 0; display: block; }

    .donate { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; max-width: 900px; margin: 0 auto; }
    .upi { text-align: center; }
    .upi img { margin: 8px auto; border-radius: 12px; border: 1px solid var(--line); }
    .upi__id { font-size: 1.2rem; font-weight: 700; color: var(--accent); margin: 8px 0 14px; }
    .upi__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 12px; }
    .upi__actions .btn--ghost { color: var(--accent); }
    small, .muted { color: var(--ink-soft); }
    dl { display: grid; grid-template-columns: auto 1fr; gap: 8px 18px; margin: 0 0 16px; }
    dt { color: var(--ink-soft); }
    dd { margin: 0; font-weight: 600; overflow-wrap: anywhere; }

    @media (max-width: 860px) { .contact { grid-template-columns: 1fr; } }
  `,
})
export class Contact {
  protected readonly i18n = inject(I18nService);
  protected readonly mandal = inject(ContentService).mandal;
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly qr = signal<string>('');
  protected readonly copied = signal(false);

  /** Standard UPI payment link – opens GPay/PhonePe/Paytm on mobile. */
  protected readonly upiLink = computed(() => {
    const d = this.mandal()?.donation;
    if (!d) return '';
    const params = new URLSearchParams({ pa: d.upiId, pn: d.payeeName, cu: 'INR', tn: 'Ganeshotsav contribution' });
    return `upi://pay?${params.toString()}`;
  });

  /** Only Google Maps embed links are allowed in the iframe. */
  protected readonly mapUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.mandal()?.contact.mapEmbedUrl;
    if (!url || !/^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(url)) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  constructor() {
    // Build the QR code in the browser from the UPI ID in mandal.json – no image file needed.
    effect(() => {
      const link = this.upiLink();
      if (!link) return;
      QRCode.toDataURL(link, { width: 440, margin: 1, color: { dark: '#4a0e0e', light: '#ffffff' } })
        .then((dataUrl) => this.qr.set(dataUrl))
        .catch((err) => console.error('QR generation failed', err));
    });
  }

  copy(text: string): void {
    navigator.clipboard?.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
