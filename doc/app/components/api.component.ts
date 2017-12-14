import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import 'rxjs/add/observable/of';

const api = require('../../api.md');

@Component({
  selector: 'api',
  template: `
  <br>
  <div class="row">
      <h2 id="API">API</h2>
      <div class="card card-block panel panel-default panel-body" [innerHTML]="api"></div>
  </div>
  `
})
export class ApiComponent {
  public _api: string = api;

  public get api() {
    return this._sanitizer.bypassSecurityTrustHtml(this._api);
  }

  constructor(private _sanitizer: DomSanitizer) {}
}
