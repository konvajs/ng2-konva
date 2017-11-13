# ng2-konva (WORK IN PROGRESS)

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

Once your library is imported, you can use its components, directives and pipes in your Angular application:

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
  public configStage = new BehaviorSubject({
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
