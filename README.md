# ng2-konva
<span class="badge-npmdownloads">
  <a href="https://www.npmjs.com/package/ng2-konva">
    <img src="https://img.shields.io/npm/v/ng2-konva.svg" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/ng2-konva">
    <img src="https://img.shields.io/npm/l/ng2-konva.svg" alt="License">
  </a>
  </span>

![Ng2Konva Logo](https://raw.githubusercontent.com/rafaesc/ng2-konva/master/n2-konva.png)

**ng2-konva** is a JavaScript library for drawing complex canvas graphics using Angular.

It provides declarative and reactive bindings to the [Konva Framework](http://konvajs.github.io/).

All `ng2-konva` components correspond to `Konva` components of the same name with the prefix 'ko-'. All the parameters available for `Konva` objects can add as `config` in the prop as Observable for corresponding `ng2-konva` components.

Core shapes are: ko-stage, ko-layer, ko-rect, ko-circle, ko-ellipse, ko-line, ko-image, ko-text, ko-text-path, ko-star, ko-label, SVG Path, ko-regular-polygon.
Also you can create custom shape.

To get more info about `Konva` you can read [Konva Overview](http://konvajs.github.io/docs/overview.html).

## Documentation

[http://rafaelescala.com/ng2-konva/](http://rafaelescala.com/ng2-konva/)

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
import { Observable } from 'rxjs/Observable';

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

## Related repositories

* [react-konva](https://github.com/lavrton/react-konva) - React + Konva
* [vue-konva](http://rafaelescala.com/vue-konva-doc/) - Vue + Konva


## License

MIT © [Rafael Escala](mailto:rafaesc92@gmail.com)
