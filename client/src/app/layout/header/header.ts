import { Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { ContentService } from '../../core/content.service';
import { I18nService, LabelKey } from '../../core/i18n.service';

interface NavLink {
  label: LabelKey;
  path: string;
  fragment?: string;
  queryParams?: Record<string, string>;
}

interface NavGroup {
  label: LabelKey;
  children: NavLink[];
}

type NavItem = NavLink | NavGroup;

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly mandal = inject(ContentService).mandal;
  protected readonly i18n = inject(I18nService);
  protected readonly menuOpen = signal(false);
  protected readonly openGroup = signal<LabelKey | null>(null);

  /** Main menu. Add / remove pages here. */
  protected readonly items: NavItem[] = [
    { label: 'home', path: '/' },
    {
      label: 'mandalInfo',
      children: [
        { label: 'history', path: '/about' },
        { label: 'committee', path: '/committee' },
        { label: 'decoration', path: '/decoration' },
      ],
    },
    {
      label: 'utsav',
      children: [
        { label: 'schedule', path: '/schedule' },
        { label: 'live', path: '/live' },
      ],
    },
    {
      label: 'initiatives',
      children: [
        { label: 'socialInitiatives', path: '/initiatives', queryParams: { tab: 'social' } },
        { label: 'educationalInitiatives', path: '/initiatives', queryParams: { tab: 'educational' } },
      ],
    },
    {
      label: 'media',
      children: [
        { label: 'yearsShort', path: '/years' },
        { label: 'gallery', path: '/gallery' },
        { label: 'videos', path: '/live', fragment: 'videos' },
      ],
    },
    { label: 'contact', path: '/contact' },
  ];

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeAll());
  }

  isGroup(item: NavItem): item is NavGroup {
    return 'children' in item;
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  toggleGroup(label: LabelKey, event: Event): void {
    event.stopPropagation();
    this.openGroup.update((g) => (g === label ? null : label));
  }

  closeAll(): void {
    this.menuOpen.set(false);
    this.openGroup.set(null);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openGroup.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeAll();
  }
}
