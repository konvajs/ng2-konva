import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'animation',
    loadComponent: () =>
      import('./examples/animation.component').then(
        (c) => c.AnimationExampleComponent,
      ),
  },
  {
    path: 'circle',
    loadComponent: () =>
      import('./examples/circle.component').then(
        (c) => c.CircleExampleComponent,
      ),
  },
  {
    path: 'event',
    loadComponent: () =>
      import('./examples/event.component').then((c) => c.EventExampleComponent),
  },
  {
    path: 'shapes',
    loadComponent: () =>
      import('./examples/shapes.component').then(
        (c) => c.ShapesExampleComponent,
      ),
  },
  {
    path: 'star',
    loadComponent: () =>
      import('./examples/star.component').then((c) => c.StarExampleComponent),
  },
  {
    path: 'styles',
    loadComponent: () =>
      import('./examples/styles.component').then(
        (c) => c.StylesExampleComponent,
      ),
  },
  { path: '**', pathMatch: 'full', redirectTo: 'animation' },
];
