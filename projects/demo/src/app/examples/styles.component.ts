import { Component } from '@angular/core';
import { CoreShapeComponent, StageComponent } from 'ng2-konva';
import { StageConfig } from 'konva/lib/Stage';
import { RegularPolygonConfig } from 'konva/lib/shapes/RegularPolygon';

@Component({
    selector: 'app-styles-example',
    template: `
    <br />
    <section>
      <ko-stage [config]="configStage">
        <ko-layer>
          <ko-regular-polygon
            [config]="configRegularPolygon"
          ></ko-regular-polygon>
        </ko-layer>
      </ko-stage>
      <br />
    </section>
  `,
    imports: [StageComponent, CoreShapeComponent]
})
export class StylesExampleComponent {
  public configStage: Partial<StageConfig> = {
    width: 400,
    height: 200,
  };
  public configRegularPolygon: RegularPolygonConfig = {
    x: 100,
    y: 100,
    sides: 5,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
    shadowOffsetX: 20,
    shadowOffsetY: 25,
    shadowBlur: 40,
    opacity: 0.5,
  };
}
