import {
  ApplicationConfig,
  Injectable,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localeMr from '@angular/common/locales/mr';
import { Title } from '@angular/platform-browser';
import {
  RouterStateSnapshot,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';

// Marathi month/day names for the date pipe.
registerLocaleData(localeMr);

/** Browser tab title: "<Page> | Vijay Nagar Ganesh Utsav Mandal". */
@Injectable({ providedIn: 'root' })
class MandalTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }
  override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = this.buildTitle(snapshot);
    this.title.setTitle(page ? `${page} | Vijay Nagarcha Raja, Bandra (East)` : 'Vijay Nagarcha Raja | Vijay Nagar Sarvajanik Ganesh Utsav Mandal, Bandra (East)');
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withComponentInputBinding(), // route params / query params -> component inputs
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    { provide: TitleStrategy, useClass: MandalTitleStrategy },
  ],
};
