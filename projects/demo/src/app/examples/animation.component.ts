import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { StageComponent, CoreShapeComponent } from 'ng2-konva';
import { RegularPolygonConfig } from 'konva/lib/shapes/RegularPolygon';
import { ContainerConfig } from 'konva/lib/Container';

@Component({
  selector: 'app-animation-example',
  template: `
    <section>
      <ko-stage #stage [config]="configStage">
        <ko-layer #layer>
          <ko-regular-polygon
            #hexagon
            [config]="polygonConfig"
          ></ko-regular-polygon>
        </ko-layer>
      </ko-stage>
    </section>
  `,
  standalone: true,
  imports: [StageComponent, CoreShapeComponent],
})
export class AnimationExampleComponent implements AfterViewInit {
  @ViewChild('stage') stage: StageComponent;
  @ViewChild('layer') layer: CoreShapeComponent;
  @ViewChild('hexagon') hexagon: CoreShapeComponent;

  public configStage: ContainerConfig = {
    width: 400,
    height: 200,
  };
  public polygonConfig: RegularPolygonConfig = {
    x: 200,
    y: 100,
    sides: 6,
    radius: 20,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
  };

  ngAfterViewInit(): void {
    console.log('test');
    // const amplitude = 100;
    // const period = 5000;
    // // in ms
    // const centerX = this.stage.getStage().width() / 2;
    //
    // const anim = new Animation((frame?: IFrame) => {
    //   if (!frame) return;
    //   this.hexagon
    //     .getStage()
    //     .x(amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + centerX);
    // }, this.layer.getStage());
    //
    // anim.start();
  }
}
