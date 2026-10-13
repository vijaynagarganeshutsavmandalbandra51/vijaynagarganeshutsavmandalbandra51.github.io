import { Directive, output } from '@angular/core';

/**
 * Finger-swipe support for phones.
 * <div (swipeLeft)="next()" (swipeRight)="prev()" appSwipe>…</div>
 */
@Directive({
  selector: '[appSwipe]',
  host: {
    '(touchstart)': 'start($event)',
    '(touchend)': 'end($event)',
  },
})
export class Swipe {
  readonly swipeLeft = output<void>();
  readonly swipeRight = output<void>();

  private x = 0;
  private y = 0;

  start(e: TouchEvent): void {
    const t = e.changedTouches[0];
    this.x = t.clientX;
    this.y = t.clientY;
  }

  end(e: TouchEvent): void {
    const t = e.changedTouches[0];
    const dx = t.clientX - this.x;
    const dy = t.clientY - this.y;
    // horizontal swipe of at least 45px that is clearly not a vertical scroll
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) this.swipeLeft.emit();
      else this.swipeRight.emit();
    }
  }
}
