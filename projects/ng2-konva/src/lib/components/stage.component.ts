/* eslint-disable @angular-eslint/no-output-native */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  ElementRef,
  ContentChildren,
  QueryList,
  OnDestroy,
  inject,
} from '@angular/core';
import { CoreShapeComponent as CoreShape } from './core-shape.component';
import { updatePicture, createListener, applyNodeProps } from '../utils/index';
import { KonvaComponent } from '../interfaces/ko-component.interface';
import { Stage } from 'konva/lib/Stage';
import { KonvaEventObject } from 'konva/lib/Node';
import { Layer } from 'konva/lib/Layer';
import { ContainerConfig } from 'konva/lib/Container';

@Component({
  selector: 'ko-stage',
  standalone: true,
  template: `<div><ng-content></ng-content></div>`,
})
export class StageComponent
  implements KonvaComponent, AfterContentInit, OnDestroy
{
  private nodeContainer = inject(ElementRef).nativeElement;
  @ContentChildren(CoreShape) shapes = new QueryList<CoreShape>();
  @Input() set config(config: ContainerConfig) {
    this._config = config;
    if (!this._stage) {
      this._stage = new Stage({
        ...config,
        container: this.nodeContainer,
      });
      this.uploadKonva(config);
    } else {
      this.uploadKonva(config);
    }
  }

  @Output() mouseover: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();
  @Output() mousemove: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();
  @Output() mouseout: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();
  @Output() mouseenter: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();
  @Output() mouseleave: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();
  @Output() mousedown: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();
  @Output() mouseup: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();
  @Output() wheel: EventEmitter<KonvaEventObject<WheelEvent>> =
    new EventEmitter<KonvaEventObject<WheelEvent>>();
  @Output() contextmenu: EventEmitter<KonvaEventObject<PointerEvent>> =
    new EventEmitter<KonvaEventObject<PointerEvent>>();
  @Output() click: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();
  @Output() dblclick: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();
  @Output() touchstart: EventEmitter<KonvaEventObject<TouchEvent>> =
    new EventEmitter<KonvaEventObject<TouchEvent>>();
  @Output() touchmove: EventEmitter<KonvaEventObject<TouchEvent>> =
    new EventEmitter<KonvaEventObject<TouchEvent>>();
  @Output() touchend: EventEmitter<KonvaEventObject<TouchEvent>> =
    new EventEmitter<KonvaEventObject<TouchEvent>>();
  @Output() tap: EventEmitter<KonvaEventObject<TouchEvent>> = new EventEmitter<
    KonvaEventObject<TouchEvent>
  >();
  @Output() dbltap: EventEmitter<KonvaEventObject<TouchEvent>> =
    new EventEmitter<KonvaEventObject<TouchEvent>>();
  @Output() dragstart: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();
  @Output() dragmove: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();
  @Output() dragend: EventEmitter<KonvaEventObject<MouseEvent>> =
    new EventEmitter<KonvaEventObject<MouseEvent>>();

  private _stage: Stage;
  private _config: ContainerConfig;
  private cacheProps: any = {};

  public getStage(): Stage {
    return this._stage;
  }

  public getConfig(): ContainerConfig {
    return this._config;
  }

  private uploadKonva(config: ContainerConfig): void {
    const props = {
      ...config,
      ...createListener(this),
    };
    applyNodeProps(this, props, this.cacheProps);
    this.cacheProps = props;
  }

  ngAfterContentInit(): void {
    this.shapes.forEach((item: CoreShape) => {
      if (!(item.getStage() instanceof Layer)) {
        throw 'You can only add Layer Nodes to Stage Nodes!';
      }
      this._stage.add(<Layer>item.getStage());
      updatePicture(this._stage);
    });
  }

  ngOnDestroy(): void {
    this._stage.destroy();
  }
}
