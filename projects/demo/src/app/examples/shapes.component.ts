import { Component } from '@angular/core';
import { CoreShapeComponent, StageComponent } from 'ng2-konva';
import { StageConfig } from 'konva/lib/Stage';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Context } from 'konva/lib/Context';

@Component({
  selector: 'app-shapes-example',
  template: `
    <br />
    <section>
      <ko-stage [config]="configStage">
        <ko-layer>
          <ko-shape [config]="configShape"></ko-shape>
        </ko-layer>
      </ko-stage>
      <br />
    </section>
  `,
  standalone: true,
  imports: [StageComponent, CoreShapeComponent],
})
export class ShapesExampleComponent {
  public configStage: Partial<StageConfig> = {
    width: 400,
    height: 200,
  };
  public configShape: ShapeConfig = {
    sceneFunc: (context: Context, shape: Shape): void => {
      context.beginPath();
      context.moveTo(20, 50);
      context.lineTo(220, 80);
      context.quadraticCurveTo(150, 100, 260, 170);
      context.closePath();

      context.fillStrokeShape(shape);
    },
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4,
  };
}
