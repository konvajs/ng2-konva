/* eslint-disable @angular-eslint/no-output-native */
import {
  Component,
  ElementRef,
  OnDestroy,
  contentChildren,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { ContainerConfig } from 'konva/lib/Container';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { KonvaComponent } from '../interfaces/ko-component.interface';
import { NgKonvaEventObject } from '../interfaces/ngKonvaEventObject';
import { applyNodeProps, createListener, updatePicture } from '../utils/index';
import { PropsType } from '../utils/types';
import { CoreShapeComponent as CoreShape } from './core-shape.component';

@Component({
  selector: 'ko-stage',
  template: `<div><ng-content></ng-content></div>`,
})
export class StageComponent implements KonvaComponent, OnDestroy {
  private nodeContainer = inject(ElementRef).nativeElement;
  readonly shapes = contentChildren(CoreShape);

  public readonly config = input<ContainerConfig>();
  #onConfigChange = effect(() => {
    const config = this.config();
    if (!config) return;
    if (!this._stage) {
      this._stage = new Stage({
        ...config,
        container: this.nodeContainer,
      });
      this.uploadKonva(config);
    } else {
      this.uploadKonva(config);
    }
  });

  readonly mouseover = output<NgKonvaEventObject<MouseEvent>>();
  readonly mousemove = output<NgKonvaEventObject<MouseEvent>>();
  readonly mouseout = output<NgKonvaEventObject<MouseEvent>>();
  readonly mouseenter = output<NgKonvaEventObject<MouseEvent>>();
  readonly mouseleave = output<NgKonvaEventObject<MouseEvent>>();
  readonly mousedown = output<NgKonvaEventObject<MouseEvent>>();
  readonly mouseup = output<NgKonvaEventObject<MouseEvent>>();
  readonly wheel = output<NgKonvaEventObject<WheelEvent>>();
  readonly contextmenu = output<NgKonvaEventObject<PointerEvent>>();
  readonly click = output<NgKonvaEventObject<MouseEvent>>();
  readonly dblclick = output<NgKonvaEventObject<MouseEvent>>();
  readonly touchstart = output<NgKonvaEventObject<TouchEvent>>();
  readonly touchmove = output<NgKonvaEventObject<TouchEvent>>();
  readonly touchend = output<NgKonvaEventObject<TouchEvent>>();
  readonly tap = output<NgKonvaEventObject<TouchEvent>>();
  readonly dbltap = output<NgKonvaEventObject<TouchEvent>>();
  readonly dragstart = output<NgKonvaEventObject<MouseEvent>>();
  readonly dragmove = output<NgKonvaEventObject<MouseEvent>>();
  readonly dragend = output<NgKonvaEventObject<MouseEvent>>();

  private _stage: Stage;
  private cacheProps: PropsType = {};

  public getStage(): Stage {
    return this._stage;
  }

  public getConfig(): ContainerConfig {
    return this.config() || {};
  }

  private uploadKonva(config: ContainerConfig): void {
    const props = {
      ...config,
      ...createListener(this),
    };
    applyNodeProps(this, props, this.cacheProps);
    this.cacheProps = props;
  }

  #onShapesChange = effect(() => {
    this.shapes().forEach((item: CoreShape) => {
      if (!(item.getStage() instanceof Layer)) {
        throw 'You can only add Layer Nodes to Stage Nodes!';
      }
      this._stage.add(<Layer>item.getStage());
      updatePicture(this._stage);
    });
  });

  ngOnDestroy(): void {
    this._stage.destroy();
  }
}
