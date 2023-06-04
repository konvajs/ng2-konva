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
      this._stage = {
        shape: new Stage({
          ...config,
          container: this.nodeContainer,
        }),
      };
      this.uploadKonva(config);
    } else {
      this.uploadKonva(config);
    }
  }
  @Output() click: EventEmitter<KonvaEventObject<unknown>> = new EventEmitter();
  @Output() dblclick: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() mouseover: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() mouseout: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() mousemove: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() tap: EventEmitter<KonvaEventObject<unknown>> = new EventEmitter();
  @Output() dbltap: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() touchstart: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() scaleXChange: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() fillChange: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() dragstart: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() dragmove: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() dragend: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();

  private _stage: { shape: Stage };
  private _config: ContainerConfig;
  private cacheProps: any = {};

  public getStage(): { shape: Stage } {
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
      if (!(item.getStage().shape instanceof Layer)) {
        throw 'You can only add Layer Nodes to Stage Nodes!';
      }
      this._stage.shape.add(<Layer>item.getStage().shape);
      updatePicture(this._stage.shape);
    });
  }

  ngOnDestroy(): void {
    this._stage.shape.destroy();
  }
}
