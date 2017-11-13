# ng2-konva (WORK IN PROGRESS)

ng2-konva is a JavaScript library for drawing complex canvas graphics using Angular.

It provides declarative and reactive bindings to the [Konva Framework](http://konvajs.github.io/).

All `ng2-konva` components correspond to `Konva` components of the same name with the prefix 'ko-'. All the parameters available for `Konva` objects can add as `config` in the prop as Observable for corresponding `ng2-konva` components.

Core shapes are: ko-stage, ko-layer, ko-rect, ko-circle, ko-ellipse, ko-line, ko-image, ko-text, ko-text-path, ko-star, ko-label, SVG Path, ko-regular-polygon.
Also you can create custom shape.

To get more info about `Konva` you can read [Konva Overview](http://konvajs.github.io/docs/overview.html).

## Installation

To install this library, run:

```bash
$ npm install ng2-konva --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install ng2-konva
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { KonvaModule } from 'ng2-konva';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    KonvaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use its components in your Angular application:

```typescript
@Component({
  selector: 'app',
  template: `
    <ko-stage [config]="configStage">
      <ko-layer>
        <ko-circle [config]="configCircle" (click)="handleClick($event)"></ko-circle>
      </ko-layer>
    </ko-stage>`
})
class AppComponent implements OnInit {
  public configStage = Observable.of({
    width: 200,
    height: 200
  });
  public configCircle = Observable.of({
    x: 100,
    y: 100,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
  });

  public handleClick(component) {
    console.log('Hello Circle', component);
  }
}
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Rafael Escala](mailto:rafaesc92@gmail.com)
