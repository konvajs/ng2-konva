import { Component } from '@angular/core';
import { CoreShapeComponent, StageComponent } from 'ng2-konva';
import { StageConfig } from 'konva/lib/Stage';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Context } from 'konva/lib/Context';
import { map, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  imports: [StageComponent, CoreShapeComponent],
})
export class ShapesExampleComponent {
  sub = timer(0, 1000)
    .pipe(
      takeUntilDestroyed(),
      map((c) => c % this.colors.length),
      map((c) => this.colors[c]),
    )
    .subscribe(
      (color) => (this.configShape = { ...this.configShape, fill: color }),
    );

  colors = ['#00D2FF', '#00D200', '#FFD200'];

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
