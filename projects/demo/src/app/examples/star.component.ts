import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreShapeComponent, StageComponent } from 'ng2-konva';
import { StageConfig } from 'konva/lib/Stage';
import { NgForOf } from '@angular/common';
import { StarConfig } from 'konva/lib/shapes/Star';
import { KonvaEventObject } from 'konva/lib/Node';

@Component({
  selector: 'app-star-example',
  template: `
    <br />
    <section>
      <ko-stage #stage [config]="configStage">
        <ko-layer #layer>
          <ko-star
            *ngFor="let config of starConfigs"
            (dragstart)="handleDragstart($event, config)"
            [config]="config"
          />
        </ko-layer>
        <ko-layer #dragLayer></ko-layer>
      </ko-stage>
      <br />
    </section>
  `,
  standalone: true,
  imports: [StageComponent, CoreShapeComponent, NgForOf],
})
export class StarExampleComponent implements OnInit {
  @ViewChild('stage') stage: StageComponent;
  @ViewChild('layer') layer: CoreShapeComponent;
  @ViewChild('dragLayer') dragLayer: CoreShapeComponent;

  public width = 800;
  public height = 800;
  public starConfigs: (StarConfig & { startScale: number })[] = [];

  public configStage: Partial<StageConfig> = {
    width: this.width,
    height: this.height,
  };

  public handleDragstart(
    event: KonvaEventObject<MouseEvent>,
    config: StarConfig & { startScale: number }
  ): void {
    const shape = event.target;
    const dragLayer = this.dragLayer.getStage();

    // moving to another layer will improve dragging performance
    shape.moveTo(dragLayer);

    this.starConfigs = this.starConfigs.map((conf) => {
      if (config.name === undefined || conf.name !== config.name) {
        return conf;
      }
      return {
        ...conf,
        shadowOffsetX: 15,
        shadowOffsetY: 15,
        scaleX: conf.startScale * 1.2,
        scaleY: conf.startScale * 1.2,
      };
    });
  }

  public handleDragend(shapeId: string): void {
    console.log(shapeId);
    // const shape = ngComponent.getStage();
    // const layer = this.layer.getStage();
    // const stage = this.stage.getStage();
    //
    // shape.moveTo(layer);
    // stage.draw();
    //
    // shape.to({
    //   duration: 0.5,
    //   easing: Konva.Easings.ElasticEaseOut,
    //   scaleX: ngComponent.getConfig().startScale,
    //   scaleY: ngComponent.getConfig().startScale,
    //   shadowOffsetX: 5,
    //   shadowOffsetY: 5,
    // });
  }

  public ngOnInit(): void {
    for (let n = 0; n < 2; n++) {
      const scale = Math.random();
      this.starConfigs.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        rotation: Math.random() * 180,
        numPoints: 5,
        innerRadius: 30,
        outerRadius: 50,
        fill: '#89b717',
        opacity: 0.8,
        draggable: true,
        scaleX: scale,
        scaleY: scale,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        shadowOpacity: 0.6,
        startScale: scale,
        name: n.toString(),
      });
    }
  }
}
