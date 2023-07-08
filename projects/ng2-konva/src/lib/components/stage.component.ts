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
import { Layer } from 'konva/lib/Layer';
import { ContainerConfig } from 'konva/lib/Container';
import { NgKonvaEventObject } from '../interfaces/ngKonvaEventObject';
import { PropsType } from '../utils/types';

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

  @Output() mouseover: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();
  @Output() mousemove: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();
  @Output() mouseout: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();
  @Output() mouseenter: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();
  @Output() mouseleave: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();
  @Output() mousedown: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();
  @Output() mouseup: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();
  @Output() wheel: EventEmitter<NgKonvaEventObject<WheelEvent>> =
    new EventEmitter<NgKonvaEventObject<WheelEvent>>();
  @Output() contextmenu: EventEmitter<NgKonvaEventObject<PointerEvent>> =
    new EventEmitter<NgKonvaEventObject<PointerEvent>>();
  @Output() click: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();
  @Output() dblclick: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();
  @Output() touchstart: EventEmitter<NgKonvaEventObject<TouchEvent>> =
    new EventEmitter<NgKonvaEventObject<TouchEvent>>();
  @Output() touchmove: EventEmitter<NgKonvaEventObject<TouchEvent>> =
    new EventEmitter<NgKonvaEventObject<TouchEvent>>();
  @Output() touchend: EventEmitter<NgKonvaEventObject<TouchEvent>> =
    new EventEmitter<NgKonvaEventObject<TouchEvent>>();
  @Output() tap: EventEmitter<NgKonvaEventObject<TouchEvent>> =
    new EventEmitter<NgKonvaEventObject<TouchEvent>>();
  @Output() dbltap: EventEmitter<NgKonvaEventObject<TouchEvent>> =
    new EventEmitter<NgKonvaEventObject<TouchEvent>>();
  @Output() dragstart: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();
  @Output() dragmove: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();
  @Output() dragend: EventEmitter<NgKonvaEventObject<MouseEvent>> =
    new EventEmitter<NgKonvaEventObject<MouseEvent>>();

  private _stage: Stage;
  private _config: ContainerConfig;
  private cacheProps: PropsType = {};

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
