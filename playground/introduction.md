**ng2-konva** is a JavaScript library for drawing complex canvas graphics using Angular.

It provides declarative and reactive bindings to the [Konva Framework](http://konvajs.github.io/).

## Installation

To install this library, run:

```bash
$ npm install konva ng2-konva --save
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import KonvaModule
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

Once `KonvaModule` is imported, you can use its components in your Angular application:

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