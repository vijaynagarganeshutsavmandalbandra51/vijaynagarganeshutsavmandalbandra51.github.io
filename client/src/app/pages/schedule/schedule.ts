import { DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { festivalPhase, todayIso } from '../../core/festival';
import { I18nService } from '../../core/i18n.service';
import { PageBanner } from '../../shared/page-banner/page-banner';

@Component({
  selector: 'app-schedule',
  imports: [PageBanner, DatePipe],
  template: `
    <app-page-banner
      [title]="i18n.t('schedule') + ' ' + i18n.digits(schedule()?.year ?? '')"
      [subtitle]="published()
        ? (i18n.isMr() ? 'पूजा, आरती, सांस्कृतिक कार्यक्रम आणि सेवा – सर्वांचे स्वागत!' : 'Ten days of puja, aarti, culture and seva. Everyone is welcome!')
        : (i18n.isMr() ? 'कार्यक्रमांची तयारी सुरू आहे' : 'Preparations are underway')"
    />

    @if (!published() && mandal(); as m) {
      <!-- Shown until schedule.json has "published": true -->
      <section class="section section--warm">
        <div class="container soon">
          <div class="soon__card">
            <span class="soon__om marathi">|| गणपती बाप्पा मोरया ||</span>
            <h2>{{ i18n.t('bappaComing') }}</h2>
            <p class="soon__date">{{ m.festival.startDate | date: 'EEEE, d MMMM y' : undefined : i18n.locale() }}</p>
            @if (countdown(); as c) {
              <div class="soon__count">
                <div><b>{{ c.days }}</b><span>{{ i18n.t('days') }}</span></div>
                <div><b>{{ pad(c.hours) }}</b><span>{{ i18n.t('hours') }}</span></div>
                <div><b>{{ pad(c.minutes) }}</b><span>{{ i18n.t('minutes') }}</span></div>
                <div><b>{{ pad(c.seconds) }}</b><span>{{ i18n.t('seconds') }}</span></div>
              </div>
            }
            <p class="soon__text">
              {{ i18n.isMr()
                ? 'गणेशोत्सव ' + i18n.digits(m.festival.year) + ' च्या कार्यक्रमांची तयारी सुरू आहे. संपूर्ण कार्यक्रम पत्रिका लवकरच येथे जाहीर केली जाईल.'
                : 'Preparations for Ganeshotsav ' + m.festival.year + ' are underway. The full day-wise programme will be announced here soon.' }}
            </p>
            @if (m.social.instagram) {
              <a class="btn btn--light" [href]="m.social.instagram" target="_blank" rel="noopener">
                {{ i18n.isMr() ? 'अपडेटसाठी Instagram वर फॉलो करा' : 'Follow us on Instagram for updates' }}
              </a>
            }
          </div>
        </div>
      </section>
    }

    @if (published()) {

    <section class="section">
      <div class="container">
        @if (schedule(); as s) {
          <div class="days" role="tablist" aria-label="Festival days">
            @for (d of s.days; track d.day) {
              <button
                type="button"
                role="tab"
                [id]="'day-' + d.day"
                class="day-tab"
                [class.day-tab--active]="d.day === selectedDay()"
                [class.day-tab--today]="d.date === today"
                [attr.aria-selected]="d.day === selectedDay()"
                (click)="selectedDay.set(d.day)"
              >
                <span class="day-tab__num">{{ i18n.t('dayOf') }} {{ i18n.digits(d.day) }}</span>
                <span class="day-tab__date">{{ d.date | date: 'd MMM' : undefined : i18n.locale() }}</span>
                @if (d.date === today) {
                  <span class="day-tab__badge">{{ i18n.isMr() ? 'आज' : 'Today' }}</span>
                }
              </button>
            }
          </div>

          @if (current(); as d) {
            <div class="day card" role="tabpanel">
              <header class="day__head">
                <div>
                  <h2>{{ i18n.tr(d, 'title') }}</h2>
                </div>
                <span class="day__date">{{ d.date | date: 'EEEE, d MMMM y' : undefined : i18n.locale() }}</span>
              </header>
              <ul class="events">
                @for (e of d.events; track $index) {
                  <li>
                    <time>{{ e.time }}</time>
                    <div>
                      <h3>{{ i18n.tr(e, 'title') }}</h3>
                      @if (e.description) {
                        <p>{{ i18n.tr(e, 'description') }}</p>
                      }
                    </div>
                  </li>
                }
              </ul>
            </div>
          }

          @if (s.note) {
            <p class="note">ℹ️ {{ i18n.tr(s, 'note') }}</p>
          }
        } @else {
          <p class="loading">Loading schedule…</p>
        }
      </div>
    </section>
    }
  `,
  styles: `
    .soon { display: flex; justify-content: center; }
    .soon__card { width: 100%; max-width: 760px; text-align: center; padding: 44px 32px 40px; border-radius: 24px; color: #fff;
      background: linear-gradient(135deg, var(--accent) 0%, #b4541c 45%, var(--primary) 100%);
      box-shadow: 0 30px 60px -30px rgba(20,40,80,.7); }
    .soon__om { display: block; color: var(--marigold, #f5b301); font-size: 1.1rem; margin-bottom: 8px; }
    .soon__card h2 { color: var(--marigold, #f5b301); margin: 0 0 6px; font-size: clamp(1.8rem, 5vw, 2.6rem); }
    .soon__date { font-size: 1.15rem; margin: 0 0 26px; opacity: .95; }
    .soon__count { display: flex; justify-content: center; gap: 12px; margin-bottom: 28px; }
    .soon__count div { min-width: 82px; padding: 12px 8px; border-radius: 14px; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.28); }
    .soon__count b { display: block; font-size: 2rem; line-height: 1.1; }
    .soon__count span { font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; opacity: .9; }
    .soon__text { max-width: 520px; margin: 0 auto 24px; line-height: 1.7; opacity: .95; }
    @media (max-width: 600px) {
      .soon__card { padding: 32px 18px 30px; border-radius: 20px; }
      .soon__count { gap: 8px; }
      .soon__count div { min-width: 0; flex: 1; padding: 10px 4px; }
      .soon__count b { font-size: 1.6rem; }
      .soon__count span { font-size: .66rem; letter-spacing: .04em; }
    }
    .days { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 10px; margin-bottom: 28px; }
    /* phones: one swipeable row of day chips */
    @media (max-width: 600px) {
      .days { display: flex; overflow-x: auto; gap: 8px; margin: 0 -16px 20px; padding: 12px 16px 6px; scroll-snap-type: x proximity; scrollbar-width: none; }
      .days::-webkit-scrollbar { display: none; }
      .day-tab { flex: 0 0 76px; scroll-snap-align: start; padding: 10px 4px; }
      .day { padding: 20px 16px; }
      .day__head { align-items: start; }
    }
    .day-tab {
      position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px;
      padding: 12px 6px; border-radius: 12px; cursor: pointer;
      border: 1px solid var(--line); background: var(--white); color: var(--ink); font: inherit;
      transition: background .15s ease, transform .15s ease;
    }
    .day-tab:hover { transform: translateY(-2px); }
    .day-tab__num { font-weight: 700; }
    .day-tab__date { font-size: .85rem; color: var(--ink-soft); }
    .day-tab--active { background: var(--accent); border-color: var(--accent); color: #fff; }
    .day-tab--active .day-tab__date { color: var(--marigold); }
    .day-tab--today { box-shadow: 0 0 0 3px var(--marigold); }
    .day-tab__badge {
      position: absolute; top: -9px; right: -6px; padding: 1px 8px; border-radius: 999px;
      background: var(--saffron); color: var(--white); font-size: .7rem; font-weight: 700;
    }

    .day { padding: 32px; }
    .day__head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 12px;
      padding-bottom: 18px; margin-bottom: 8px; border-bottom: 1px dashed var(--line); }
    .day__head h2 { margin: 0; }
    .day__head h2 { color: var(--accent); }
    .day__date { color: var(--ink-soft); font-weight: 500; }

    .events { list-style: none; margin: 0; padding: 0; }
    .events li { display: grid; grid-template-columns: 110px 1fr; gap: 18px; padding: 16px 0; border-bottom: 1px solid var(--cream-2); }
    .events li:last-child { border-bottom: 0; }
    .events time { font-weight: 700; color: var(--primary); font-variant-numeric: tabular-nums; }
    .events h3 { font-family: var(--font-body); font-size: 1.1rem; font-weight: 700; margin: 0 0 2px; color: var(--ink); }
    .events p { margin: 0; color: var(--ink-soft); }

    .note { margin-top: 20px; color: var(--ink-soft); text-align: center; }

    @media (max-width: 600px) {
      .day { padding: 22px 18px; }
      .events li { grid-template-columns: 1fr; gap: 2px; }
    }
  `,
})
export class SchedulePage {
  protected readonly i18n = inject(I18nService);
  protected readonly schedule = toSignal(inject(ContentService).schedule());
  protected readonly today = todayIso();
  protected readonly selectedDay = signal(1);
  protected readonly mandal = inject(ContentService).mandal;
  /** schedule.json → "published": false shows the "Bappa is coming" countdown instead of the day-wise plan. */
  protected readonly published = computed(() => this.schedule()?.published !== false);

  private readonly now = signal(Date.now());
  protected readonly countdown = computed(() => {
    const m = this.mandal();
    const p = m ? festivalPhase(this.now(), m.festival.startDate, m.festival.visarjanDate) : undefined;
    return p?.kind === 'upcoming' ? p : null;
  });
  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected readonly current = computed(() =>
    this.schedule()?.days.find((d) => d.day === this.selectedDay()),
  );

  constructor() {
    const timer = setInterval(() => this.now.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));

    // During the festival, open today's tab automatically.
    effect(() => {
      const todayEntry = this.schedule()?.days.find((d) => d.date === this.today);
      if (todayEntry) {
        this.selectedDay.set(todayEntry.day);
        // on phones, bring today's chip into view
        setTimeout(() => document.getElementById('day-' + todayEntry.day)?.scrollIntoView({ inline: 'center', block: 'nearest' }));
      }
    });
  }
}
