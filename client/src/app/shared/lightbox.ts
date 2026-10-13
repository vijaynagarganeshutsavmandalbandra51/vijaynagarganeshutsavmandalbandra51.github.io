import { Component, HostListener, computed, input, model } from '@angular/core';
import { Swipe } from './swipe.directive';

export interface LightboxItem {
  src: string;
  caption: string;
}

/**
 * Full-screen photo viewer.
 * <app-lightbox [items]="photos" [(index)]="openIndex" />   (index = null -> closed)
 */
@Component({
  selector: 'app-lightbox',
  imports: [Swipe],
  template: `
    @if (active(); as a) {
      <div class="lb" role="dialog" aria-modal="true" [attr.aria-label]="a.caption || 'Photo'" (click)="close()"
           appSwipe (swipeLeft)="step(1)" (swipeRight)="step(-1)">
        <button type="button" class="lb-btn lb-close" (click)="close()" aria-label="Close">✕</button>
        @if (items().length > 1) {
          <button type="button" class="lb-btn lb-prev" (click)="step(-1, $event)" aria-label="Previous">‹</button>
          <button type="button" class="lb-btn lb-next" (click)="step(1, $event)" aria-label="Next">›</button>
        }
        <figure (click)="$event.stopPropagation()">
          <img [src]="a.src" [alt]="a.caption" />
          <figcaption>
            @if (a.caption) {
              <span>{{ a.caption }}</span>
            }
            <span class="count">{{ index()! + 1 }} / {{ items().length }}</span>
          </figcaption>
        </figure>
      </div>
    }
  `,
  styles: `
    .lb { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center;
      padding: 20px; background: rgba(6, 12, 26, .94); animation: fade .2s ease; }
    @keyframes fade { from { opacity: 0; } }
    figure { margin: 0; max-width: min(1100px, 86vw); text-align: center; }
    img { max-height: 82vh; width: auto; margin: 0 auto; border-radius: 10px; }
    figcaption { display: flex; justify-content: center; gap: 16px; margin-top: 12px; color: var(--cream); }
    .count { opacity: .6; }
    .lb-btn { position: absolute; width: 50px; height: 50px; border: 0; border-radius: 50%; cursor: pointer;
      background: rgba(255,255,255,.12); color: var(--cream); font-size: 1.7rem; line-height: 1; }
    .lb-btn:hover { background: var(--accent); }
    .lb-close { top: 16px; right: 16px; font-size: 1.2rem; }
    .lb-prev { left: 16px; top: 50%; transform: translateY(-50%); }
    .lb-next { right: 16px; top: 50%; transform: translateY(-50%); }
    @media (max-width: 600px) {
      .lb { padding: 8px; }
      figure { max-width: 100%; }
      img { max-height: 74vh; border-radius: 6px; }
      .lb-prev, .lb-next { top: auto; bottom: 24px; transform: none; }
    }
  `,
})
export class Lightbox {
  readonly items = input.required<LightboxItem[]>();
  readonly index = model<number | null>(null);

  protected readonly active = computed(() => {
    const i = this.index();
    return i === null ? null : (this.items()[i] ?? null);
  });

  close(): void {
    this.index.set(null);
  }

  step(delta: number, event?: Event): void {
    event?.stopPropagation();
    const n = this.items().length;
    const i = this.index();
    if (i !== null && n) this.index.set((i + delta + n) % n);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (this.index() === null) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowRight') this.step(1);
    if (e.key === 'ArrowLeft') this.step(-1);
  }
}
