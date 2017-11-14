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
    <section>
      <div class="row">
        <h2 id="Examples">Examples</h2>
        <example-section
            [ts]="desc.circle.ts"
            [id]="desc.circle.id"
            [heading]="desc.circle.heading">
            <circle-example></circle-example>
        </example-section>
        <example-section
            [ts]="desc.shapes.ts"
            [id]="desc.shapes.id"
            [heading]="desc.shapes.heading">
            <shapes-example></shapes-example>
        </example-section>
        <example-section
            [ts]="desc.stylesExample.ts"
            [id]="desc.stylesExample.id"
            [heading]="desc.stylesExample.heading">
            <styles-example></styles-example>
        </example-section>
        <example-section
            [ts]="desc.event.ts"
            [id]="desc.event.id"
            [heading]="desc.event.heading">
            <event-example></event-example>
        </example-section>
        <example-section
            [ts]="desc.animation.ts"
            [id]="desc.animation.id"
            [heading]="desc.animation.heading">
            <animation-example></animation-example>
        </example-section>
      </div>
    </section>
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
  public desc: any = {
    circle: {
      heading: 'Circle',
      id: 'circle',
      ts: require('!!raw-loader?lang=typescript!./components/examples/circle-example.component.ts')
    },
    event: {
      heading: 'Event',
      id: 'event',
      ts: require('!!raw-loader?lang=typescript!./components/examples/event-example.component.ts')
    },
    shapes: {
      heading: 'Shapes',
      id: 'shapes',
      ts: require('!!raw-loader?lang=typescript!./components/examples/shapes-example.component.ts')
    },
    stylesExample: {
      heading: 'Styles',
      id: 'styles',
      ts: require('!!raw-loader?lang=typescript!./components/examples/styles-example.component.ts')
    },
    animation: {
      heading: 'Animation',
      id: 'animation',
      ts: require('!!raw-loader?lang=typescript!./components/examples/animation-example.component.ts')
    },
  };

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
