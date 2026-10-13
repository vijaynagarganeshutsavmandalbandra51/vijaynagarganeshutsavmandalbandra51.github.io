import { Component, inject, input } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { CommitteeMember } from '../core/models';
import { Reveal } from './reveal.directive';

/**
 * Grid of people used for "Committee Members" and "Helpers".
 * variant="card"    – big cards with photo / initials, name, role, phone
 * variant="compact" – smaller cards (used for helpers)
 */
@Component({
  selector: 'app-people-grid',
  imports: [Reveal],
  template: `
    <div class="grid" [class.grid--compact]="variant() === 'compact'">
      @for (p of people(); track $index) {
        <div class="person" [class.person--compact]="variant() === 'compact'" appReveal="zoom">
          @if (p.photo) {
            <img class="avatar" [src]="p.photo" [alt]="i18n.tr(p, 'name')" loading="lazy" />
          } @else {
            <span class="avatar avatar--initials" aria-hidden="true">{{ initials(p) }}</span>
          }
          <div class="person__text">
            <h3>{{ i18n.tr(p, 'name') }}</h3>
            @if (p.role) {
              <p class="role">{{ i18n.tr(p, 'role') }}</p>
            }
            @if (p.phone && variant() === 'card') {
              <a [href]="'tel:' + p.phone">{{ p.phone }}</a>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 22px; }
    .grid--compact { grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; }

    .person {
      padding: 26px 20px; text-align: center; border-radius: 18px; background: var(--white);
      border: 1px solid #f5dcb8; box-shadow: 0 14px 30px -20px rgba(20, 40, 80, .55);
      transition: transform .25s ease, box-shadow .25s ease;
    }
    .person:hover { transform: translateY(-5px); box-shadow: 0 22px 40px -20px rgba(20, 40, 80, .6); }

    .avatar {
      display: block; width: 104px; height: 104px; margin: 0 auto 14px; border-radius: 50%; object-fit: cover;
      border: 4px solid var(--marigold);
    }
    .avatar--initials {
      display: grid; place-items: center; color: #fff; font-family: var(--font-display); font-size: 2.2rem; font-weight: 700;
      background: linear-gradient(140deg, var(--accent), var(--primary));
    }
    h3 { margin: 0 0 2px; font-family: var(--font-body); font-size: 1.1rem; font-weight: 700; color: var(--ink); }
    .role { margin: 0 0 4px; color: var(--accent); font-weight: 600; }
    a { color: var(--primary); text-decoration: none; font-size: .95rem; }

    /* phones: two per row */
    @media (max-width: 560px) {
      .grid { grid-template-columns: 1fr 1fr; gap: 12px; }
      .grid--compact { grid-template-columns: 1fr 1fr; gap: 10px; }
      .person { padding: 18px 10px; }
      .avatar { width: 72px; height: 72px; }
      .avatar--initials { font-size: 1.6rem; }
      h3 { font-size: .98rem; }
      .role { font-size: .88rem; }
    }

    /* compact (helpers): avatar on the left, text on the right */
    .person--compact { display: flex; align-items: center; gap: 12px; padding: 12px 14px !important; text-align: left; border-radius: 14px; }
    .person--compact .avatar { width: 48px !important; height: 48px !important; }
    .person--compact h3 { overflow-wrap: anywhere; }
    .person--compact .avatar { margin: 0; border-width: 2px; flex: none; }
    .person--compact .avatar--initials { font-size: 1.1rem; }
    .person--compact h3 { font-size: 1rem; }
    .person--compact .role { font-size: .85rem; margin: 0; }
  `,
})
export class PeopleGrid {
  protected readonly i18n = inject(I18nService);
  readonly people = input.required<CommitteeMember[]>();
  readonly variant = input<'card' | 'compact'>('card');

  protected initials(p: CommitteeMember): string {
    const name = this.i18n.tr(p, 'name');
    return name
      .split(/\s+/)
      .filter((w) => w && !/^(shri|shree|smt|sau)\.?$/i.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  }
}
