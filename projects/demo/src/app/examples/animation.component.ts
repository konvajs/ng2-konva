import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { KonvaComponent, StageComponent, CoreShapeComponent } from 'ng2-konva';

declare const Konva: any;

@Component({
  selector: 'app-animation-example',
  template: `
    <br />
    <section>
      <ko-stage #stage [config]="configStage">
        <ko-layer #layer>
          <ko-regular-polygon
            #hexagon
            [config]="configItem"
          ></ko-regular-polygon>
        </ko-layer>
      </ko-stage>
      <br />
    </section>
  `,
  standalone: true,
  imports: [StageComponent, CoreShapeComponent],
})
export class AnimationExampleComponent implements AfterViewInit {
  @ViewChild('stage') stage: KonvaComponent;
  @ViewChild('layer') layer: KonvaComponent;
  @ViewChild('hexagon') hexagon: KonvaComponent;

  public configStage: Observable<any> = of({
    width: 400,
    height: 200,
  });
  public configItem: Observable<any> = of({
    x: 200,
    y: 100,
    sides: 6,
    radius: 20,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
  });

  ngAfterViewInit() {
    const ng = this;
    const amplitude = 100;
    const period = 5000;
    // in ms
    const centerX = this.stage.getStage().getWidth() / 2;

    const anim = new Konva.Animation(function (frame: any) {
      ng.hexagon
        .getStage()
        .setX(
          amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + centerX
        );
    }, ng.layer.getStage());

    anim.start();
  }
}
