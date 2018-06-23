import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'styles-example',
  template: `
  <br>
  <section>
      <ko-stage [config]="configStage">
          <ko-layer>
              <ko-regular-polygon [config]="configRegularPolygon"></ko-regular-polygon>
          </ko-layer>
      </ko-stage>
      <br>
  </section>
  `
})
export class StylesExampleComponent {
  public configStage: Observable<any> = of({
    width: 400,
    height: 200
  });
  public configRegularPolygon: Observable<any> = of({
    x: 100,
    y: 100,
    sides: 5,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
    shadowOffsetX : 20,
    shadowOffsetY : 25,
    shadowBlur : 40,
    opacity : 0.5
  });
}
