import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { Marquee } from './layout/marquee/marquee';
import { SocialRail } from './layout/social-rail/social-rail';
import { BottomNav } from './layout/bottom-nav/bottom-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Marquee, SocialRail, Footer, BottomNav],
  template: `
    <app-header />
    <app-marquee />
    <main id="main">
      <router-outlet />
    </main>
    <app-social-rail />
    <app-footer />
    <app-bottom-nav />
  `,
  styles: `
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    main { flex: 1; }
  `,
})
export class App {}
