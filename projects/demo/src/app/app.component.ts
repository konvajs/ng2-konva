import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, RouterLink],
  template: `
    <ul>
      <li *ngFor="let link of links">
        <a [routerLink]="link.route">{{ link.label }}</a>
      </li>
    </ul>
    <router-outlet />
  `,
})
export class AppComponent {
  links = [
    { label: 'Animation', route: 'animation' },
    { label: 'Circle', route: 'circle' },
    { label: 'Event', route: 'event' },
    { label: 'Shapes', route: 'shapes' },
  ];
}
