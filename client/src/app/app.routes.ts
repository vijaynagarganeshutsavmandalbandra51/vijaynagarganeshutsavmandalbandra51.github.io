import { Routes } from '@angular/router';

// Each page is lazy-loaded so the first visit is fast.
// To add a new page: create a component in /pages, add a route here and a link in layout/header/header.ts.
export const routes: Routes = [
  { path: '', title: 'Home', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },

  // Mandal info
  { path: 'about', title: "Mandal's History", loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: 'committee', title: 'Committee', loadComponent: () => import('./pages/committee/committee').then((m) => m.CommitteePage) },
  { path: 'visitors', title: 'Distinguished Visitors', loadComponent: () => import('./pages/visitors/visitors').then((m) => m.VisitorsPage) },
  { path: 'decoration', title: 'Decoration Theme', loadComponent: () => import('./pages/decoration/decoration').then((m) => m.DecorationPage) },

  // Utsav
  { path: 'schedule', title: 'Schedule & Events', loadComponent: () => import('./pages/schedule/schedule').then((m) => m.SchedulePage) },
  { path: 'live', title: 'Live Darshan', loadComponent: () => import('./pages/live/live').then((m) => m.LivePage) },

  // Initiatives (?tab=social | educational)
  { path: 'initiatives', title: 'Initiatives', loadComponent: () => import('./pages/initiatives/initiatives').then((m) => m.InitiativesPage) },

  // Media – year-wise folders in public/media/years
  { path: 'years', title: 'Bappa Through the Years', loadComponent: () => import('./pages/years/years').then((m) => m.YearsPage) },
  { path: 'years/:year', title: 'Ganeshotsav', loadComponent: () => import('./pages/years/year-detail').then((m) => m.YearDetailPage) },
  { path: 'gallery', title: 'Photo Gallery', loadComponent: () => import('./pages/gallery/gallery').then((m) => m.GalleryPage) },

  { path: 'contact', title: 'Contact & Donate', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
  { path: '**', redirectTo: '' },
];
