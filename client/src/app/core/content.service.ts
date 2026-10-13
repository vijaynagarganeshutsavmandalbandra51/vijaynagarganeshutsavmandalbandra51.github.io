import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, of, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Committee, Initiatives, MandalInfo, Schedule, Videos, YearsManifest } from './models';

/**
 * Loads the website content (no database).
 *
 * - `ng serve` / GitHub Pages: reads /data/<name>.json directly.
 * - ASP.NET Core server: reads /api/content/<name> (same JSON, served by the API).
 *
 * Each file is fetched once and cached for the rest of the visit.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Observable<unknown>>();

  /** Mandal info is used on almost every page, so expose it as a signal. */
  readonly mandal = toSignal(this.load<MandalInfo>('mandal'));

  schedule(): Observable<Schedule | undefined> {
    return this.load<Schedule>('schedule');
  }

  /** All year folders found in public/media/years (newest first). */
  years(): Observable<YearsManifest | undefined> {
    return this.load<YearsManifest>('years');
  }

  committee(): Observable<Committee | undefined> {
    return this.load<Committee>('committee');
  }

  videos(): Observable<Videos | undefined> {
    return this.load<Videos>('videos');
  }

  initiatives(): Observable<Initiatives | undefined> {
    return this.load<Initiatives>('initiatives');
  }


  private load<T>(name: string): Observable<T | undefined> {
    if (!this.cache.has(name)) {
      const url = `${environment.contentBaseUrl}${name}${environment.contentSuffix}`;
      const request$ = this.http.get<T>(url).pipe(
        catchError((err) => {
          console.error(`Could not load content "${name}" from ${url}`, err);
          return of(undefined);
        }),
        shareReplay(1),
      );
      this.cache.set(name, request$);
    }
    return this.cache.get(name) as Observable<T | undefined>;
  }
}
