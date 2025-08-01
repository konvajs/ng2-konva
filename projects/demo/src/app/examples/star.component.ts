import { Component, OnInit, viewChild } from '@angular/core';
import Konva from 'konva';
import { StarConfig } from 'konva/lib/shapes/Star';
import { StageConfig } from 'konva/lib/Stage';
import {
  CoreShapeComponent,
  NgKonvaEventObject,
  StageComponent,
} from 'ng2-konva';

type ExtStartConfig = StarConfig & { startScale: number };

@Component({
  selector: 'app-star-example',
  template: `
    <br />
    <section>
      <ko-stage [config]="configStage">
        <ko-layer #layer>
          @for (config of starConfigs; track trackConfig($index, config)) {
            <ko-star
              (dragstart)="handleDragstart($event, config)"
              (dragend)="handleDragend($event, config)"
              [config]="config"
            />
          }
        </ko-layer>
        <ko-layer #dragLayer></ko-layer>
      </ko-stage>
      <br />
    </section>
  `,
  imports: [StageComponent, CoreShapeComponent],
})
export class StarExampleComponent implements OnInit {
  readonly layer = viewChild.required<CoreShapeComponent>('layer');
  readonly dragLayer = viewChild.required<CoreShapeComponent>('dragLayer');

  public width = 800;
  public height = 800;
  public starConfigs: ExtStartConfig[] = [];

  public configStage: Partial<StageConfig> = {
    width: this.width,
    height: this.height,
  };

  public handleDragstart(
    event: NgKonvaEventObject<MouseEvent>,
    config: ExtStartConfig,
  ): void {
    const shape = event.angularComponent.getStage();
    const dragLayer = this.dragLayer().getStage();

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

  public handleDragend(
    event: NgKonvaEventObject<MouseEvent>,
    config: ExtStartConfig,
  ): void {
    const shape = event.angularComponent.getStage();
    const layer = this.layer().getStage();

    shape.moveTo(layer);

    shape.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: config.startScale,
      scaleY: config.startScale,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    });
  }

  // get unique identifier of a config to correctly update them instead of recreating them on every update
  trackConfig(index: number, config: ExtStartConfig): string | undefined {
    return config?.name;
  }

  public ngOnInit(): void {
    for (let n = 0; n < 100; n++) {
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
