import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreShapeComponent, KonvaComponent, StageComponent } from 'ng2-konva';
import { StageConfig } from 'konva/lib/Stage';
import { BehaviorSubject } from 'rxjs';
import { NgForOf } from '@angular/common';
import Konva from 'konva';

@Component({
  selector: 'app-star-example',
  template: `
    <br />
    <section>
      <ko-stage #stage [config]="configStage">
        <ko-layer #layer>
          <ko-star *ngFor="let item of list" [config]="item"> </ko-star>
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
  public height = 200;
  public list: Array<any> = [];

  public configStage: Partial<StageConfig> = {
    width: this.width,
    height: this.height,
  };

  public handleDragstart(ngComponent: KonvaComponent): void {
    const shape = ngComponent.getStage();
    const dragLayer = this.dragLayer.getStage();
    const stage = this.stage.getStage();

    // moving to another layer will improve dragging performance
    shape.moveTo(dragLayer);
    stage.draw();

    ngComponent.config.next({
      shadowOffsetX: 15,
      shadowOffsetY: 15,
      scaleX: ngComponent.getConfig().startScale * 1.2,
      scaleY: ngComponent.getConfig().startScale * 1.2,
    });
  }

  public handleDragend(ngComponent: KonvaComponent): void {
    const shape = ngComponent.getStage();
    const layer = this.layer.getStage();
    const stage = this.stage.getStage();

    shape.moveTo(layer);
    stage.draw();

    shape.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: ngComponent.getConfig().startScale,
      scaleY: ngComponent.getConfig().startScale,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    });
  }

  public ngOnInit(): void {
    for (let n = 0; n < 30; n++) {
      const scale = Math.random();
      this.list.push(
        new BehaviorSubject({
          x: Math.random() * 800,
          y: Math.random() * 200,
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
        })
      );
    }
  }
}
