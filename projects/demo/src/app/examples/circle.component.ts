import { Component, OnInit } from '@angular/core';
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
      <br />
    </section>
  `,
    imports: [StageComponent, CoreShapeComponent]
})
export class CircleExampleComponent implements OnInit {
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

  ngOnInit(): void {
    setTimeout(() => {
      this.configStage = {
        width: 500,
        height: 200,
      };
    }, 1000);
  }
}
