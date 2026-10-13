import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { todayIso } from '../../core/festival';
import { I18nService } from '../../core/i18n.service';
import { PageBanner } from '../../shared/page-banner/page-banner';

@Component({
  selector: 'app-schedule',
  imports: [PageBanner, DatePipe],
  template: `
    <app-page-banner
      [title]="i18n.t('schedule') + ' ' + i18n.digits(schedule()?.year ?? '')"
      [subtitle]="i18n.isMr() ? 'पूजा, आरती, सांस्कृतिक कार्यक्रम आणि सेवा – सर्वांचे स्वागत!' : 'Ten days of puja, aarti, culture and seva. Everyone is welcome!'"
    />

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
  `,
  styles: `
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

  protected readonly current = computed(() =>
    this.schedule()?.days.find((d) => d.day === this.selectedDay()),
  );

  constructor() {
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
