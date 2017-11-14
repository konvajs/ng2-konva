import { DomSanitizer } from '@angular/platform-browser';
import { Component, AfterContentInit } from '@angular/core';

const introduction = require('../introduction.md');

declare const PR: any;

@Component({
  selector: 'app',
  template: `
  <demo-header>Loading header</demo-header>

  <main class="bd-pageheader">
    <div class="container">
      <h1>ng2-konva</h1>
      <p>Angular2 components for <a href="http://konvajs.github.io/" style="color:white">Konva.js</a></p>
      <a class="btn btn-primary" href="https://github.com/rafaesc/ng2-konva">View on GitHub</a>
      <div class="row">
      <div class="col-lg-1">
        <iframe src="https://ghbtns.com/github-btn.html?user=rafaesc&repo=ng2-konva&type=star&count=true"
            frameborder="0" scrolling="0" width="170px" height="20px"></iframe></div>
      <div class="col-lg-1">
        <iframe src="https://ghbtns.com/github-btn.html?user=rafaesc&repo=ng2-konva&type=fork&count=true"
            frameborder="0" scrolling="0" width="170px" height="20px"></iframe></div>
      </div>
    </div>
  </main>

  <div class="container">
    <section id="introduction" [innerHtml]="introduction"></section>
    <api></api>
    <examples></examples>
  </div>

  <footer class="footer">
    <div class="container">
      <p class="text-muted text-center">
        <a href="https://github.com/rafaesc/ng2-konva">ng2-konva</a> is maintained by <a href="https://github.com/rafaesc">rafaesc</a>.</p>
    </div>
  </footer>
  `
})
export class AppComponent implements AfterContentInit {
  public _introduction: string = introduction;

  constructor(private _sanitizer: DomSanitizer) {}

  public get introduction() {
    return this._sanitizer.bypassSecurityTrustHtml(this._introduction);
  }

  public ngAfterContentInit(): any {
    setTimeout(() => {
      if (typeof PR !== 'undefined') {
        // google code-prettify
        PR.prettyPrint();
      }
    }, 150);
  }
}
