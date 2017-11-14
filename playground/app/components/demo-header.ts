import { Component } from '@angular/core';

let components = [
  { name: 'API', href: 'API' },
  { name: 'Examples', href: 'Examples' },
];

@Component({
  selector: 'demo-header',
  template: `
    <header class="navbar navbar-default navbar-fixed-top navbar-inner bg-faded">
    <div class="container">
      <div class="navbar-header hidden-md-up">
        <button type="button" class="navbar-toggle navbar-toggler pull-right" (click)="isCollapsed = !isCollapsed">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand visible-xs" href="{{prefix}}#">ng2-konva</a>
      </div>
      <nav class="hidden-xs hidden-xs-down">
        <ul class="nav navbar-nav">
          <li class="nav-item"><a href="{{prefix}}#top" role="button" class="navbar-brand">ng2-konva</a></li>
          <li class="nav-item dropdown"  *ngFor="let comp of components">
            <a role="button" class="nav-link dropdown-toggle" href="{{prefix}}#{{comp.href}}">
                {{comp.name}}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>`
})
export class DemoHeaderComponent {
  isCollapsed: boolean;
  public components: Array<any> = components;
  public prefix = '';
}
