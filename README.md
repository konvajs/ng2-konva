# ng2-konva

<span class="badge-npmdownloads">
  <a href="https://www.npmjs.com/package/ng2-konva">
    <img src="https://img.shields.io/npm/v/ng2-konva.svg" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/ng2-konva">
    <img src="https://img.shields.io/npm/l/ng2-konva.svg" alt="License">
  </a>
  </span>

![Ng2Konva Logo](n2-konva.png)

**ng2-konva** is a JavaScript library for drawing complex canvas graphics using Angular.

It provides declarative and reactive bindings to the [Konva Framework](http://konvajs.github.io/).

All `ng2-konva` components correspond to `Konva` components of the same name with the prefix 'ko-'. All the parameters available for `Konva` objects can be passed as `config` to the corresponding `ng2-konva` components.

Core shapes are: ko-stage, ko-layer, ko-rect, ko-circle, ko-ellipse, ko-line, ko-image, ko-text, ko-text-path, ko-star, ko-label, SVG Path, ko-regular-polygon.
Also you can create custom shape.

To get more info about `Konva` you can read [Konva Overview](http://konvajs.github.io/docs/overview.html).

## Documentation

[https://konvajs.org/docs/angular/index.html](https://konvajs.org/docs/angular/index.html)

## Installation

To install this library, run:

```bash
$ npm install ng2-konva --save
```

`ng2-konva` components are all standalone. There are two components you will need to import: `CoreShapeComponent` and `StageComponent`

```typescript
import { Component } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { CircleConfig } from 'konva/lib/shapes/Circle';
import {
  CoreShapeComponent,
  NgKonvaEventObject,
  StageComponent,
} from 'ng2-konva';

@Component({
  selector: 'app-circle-example',
  template: `
    <br />
    <section>
      <ko-stage [config]="configStage">
        <ko-layer>
          <ko-circle
            [config]="configCircle"
            (click)="handleClick($event)"
          ></ko-circle>
        </ko-layer>
      </ko-stage>
    </section>
  `,
  standalone: true,
  imports: [StageComponent, CoreShapeComponent],
})
export class CircleExampleComponent {
  public configStage: Partial<StageConfig> = {
    width: 200,
    height: 500,
  };
  public configCircle: CircleConfig = {
    x: 100,
    y: 100,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
  };

  public handleClick(event: NgKonvaEventObject<MouseEvent>): void {
    console.log('Hello Circle', event);
  }
}
```

## Demo

You can find more examples in the demo project located in `projects/demo`.

## Related repositories

- [react-konva](https://github.com/lavrton/react-konva) - React + Konva
- [vue-konva](http://rafaelescala.com/vue-konva-doc/) - Vue + Konva

## License

MIT © [Rafael Escala](mailto:rafaesc92@gmail.com)
