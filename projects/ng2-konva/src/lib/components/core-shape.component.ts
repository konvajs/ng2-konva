/* eslint-disable @angular-eslint/no-output-native */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ContentChildren,
  QueryList,
  OnDestroy,
  OnInit,
  inject,
  AfterContentInit,
} from '@angular/core';
import { getName, createListener, applyNodeProps } from '../utils/index';
import { KonvaComponent } from '../interfaces/ko-component.interface';
import { ShapeConfigTypes } from '../utils/configTypes';
import { KonvaEventObject } from 'konva/lib/Node';
import { AngularNode } from '../interfaces/angular-node.interface';
import { ShapeTypes } from '../utils/shapeTypes';
import Konva from 'konva';
import { updatePicture } from '../utils';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Shape } from 'konva/lib/Shape';
import { Sprite, SpriteConfig } from 'konva/lib/shapes/Sprite';

@Component({
  selector:
    'ko-shape, ko-layer, ko-circle, ko-fastlayer, ko-group, ko-label, ko-rect, ko-ellipse, ko-wedge, ko-line, ko-sprite, ko-image, ko-text, ko-text-path, ko-star, ko-ring, ko-arc, ko-tag, ko-path, ko-regular-polygon, ko-arrow, ko-transformer',
  standalone: true,
  template: `<div><ng-content></ng-content></div>`,
})
export class CoreShapeComponent
  implements KonvaComponent, AfterContentInit, OnDestroy, OnInit
{
  @ContentChildren(CoreShapeComponent)
  shapes = new QueryList<CoreShapeComponent>();
  @Input() set config(config: ShapeConfigTypes) {
    this._config = config;
    this.uploadKonva(config);
  }
  get config(): ShapeConfigTypes {
    return this._config;
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

  public nameNode: keyof typeof ShapeTypes | 'Shape' | 'Sprite' = getName(
    inject(ElementRef).nativeElement.localName
  ) as keyof typeof ShapeTypes | 'Shape' | 'Sprite';

  private cacheProps: any = {};
  private _stage: AngularNode;
  protected _config: ShapeConfigTypes;

  public getStage(): AngularNode {
    return this._stage;
  }

  public getConfig(): ShapeConfigTypes {
    return this._config || {};
  }

  ngOnInit(): void {
    this.initKonva();
  }

  private initKonva(): void {
    if (!this._stage) {
      this._stage = { shape: new Shape() };
    }
    if (this.nameNode === 'Shape') {
      this._stage.shape = new Shape();
    } else if (this.nameNode === 'Sprite') {
      this._stage.shape = new Sprite(this.config as SpriteConfig);
    } else {
      this._stage.shape = new Konva[this.nameNode](undefined);
    }

    this._stage.AngularComponent = this;
    const animationStage = this._stage.shape.to.bind(this._stage);

    this._stage.shape.to = (newConfig: ShapeConfigTypes): void => {
      animationStage(newConfig);
      setTimeout(() => {
        Object.keys(this._stage.shape.attrs).forEach((key) => {
          if (typeof this._stage.shape.attrs[key] !== 'function') {
            this.config[key] = this._stage.shape.attrs[key];
          }
        });
      }, 200);
    };

    if (this._config) {
      this.uploadKonva(this.config);
    }
  }

  protected uploadKonva(config: ShapeConfigTypes): void {
    if (!this._stage) return;
    const props = {
      ...config,
      ...createListener(this),
    };
    applyNodeProps(this, props, this.cacheProps);
    this.cacheProps = props;
  }

  ngAfterContentInit(): void {
    this.shapes.forEach((item: CoreShapeComponent) => {
      if (this !== item) {
        if (
          this._stage.shape instanceof Group ||
          this._stage.shape instanceof Layer
        ) {
          this._stage.shape.add(item.getStage().shape);
        }
        updatePicture(this._stage.shape);
      }
    });
  }

  ngOnDestroy(): void {
    this._stage.shape.destroy();
  }
}
