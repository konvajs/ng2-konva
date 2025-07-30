import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink],
    template: `
    <ul>
      @for (link of links; track link) {
        <li>
          <a [routerLink]="link.route">{{ link.label }}</a>
        </li>
      }
    </ul>
    <router-outlet />
    `
})
export class AppComponent {
  links = [
    { label: 'Animation', route: 'animation' },
    { label: 'Circle', route: 'circle' },
    { label: 'Event', route: 'event' },
    { label: 'Shapes', route: 'shapes' },
    { label: 'Star', route: 'star' },
    { label: 'Styles', route: 'styles' },
  ];
}
