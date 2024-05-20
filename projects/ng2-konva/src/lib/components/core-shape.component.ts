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
  AfterContentChecked,
} from '@angular/core';
import { getName, createListener, applyNodeProps } from '../utils/index';
import { KonvaComponent } from '../interfaces/ko-component.interface';
import { ShapeConfigTypes } from '../utils/configTypes';
import { ShapeTypes } from '../utils/shapeTypes';
import Konva from 'konva';
import { updatePicture } from '../utils';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Shape } from 'konva/lib/Shape';
import { Sprite, SpriteConfig } from 'konva/lib/shapes/Sprite';
import { Arc } from 'konva/lib/shapes/Arc';
import { Arrow } from 'konva/lib/shapes/Arrow';
import { Circle } from 'konva/lib/shapes/Circle';
import { Ellipse } from 'konva/lib/shapes/Ellipse';
import { Image } from 'konva/lib/shapes/Image';
import { Label, Tag } from 'konva/lib/shapes/Label';
import { Line } from 'konva/lib/shapes/Line';
import { Path } from 'konva/lib/shapes/Path';
import { Rect } from 'konva/lib/shapes/Rect';
import { RegularPolygon } from 'konva/lib/shapes/RegularPolygon';
import { Ring } from 'konva/lib/shapes/Ring';
import { Star } from 'konva/lib/shapes/Star';
import { Text } from 'konva/lib/shapes/Text';
import { TextPath } from 'konva/lib/shapes/TextPath';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Wedge } from 'konva/lib/shapes/Wedge';
import { FastLayer } from 'konva/lib/FastLayer';
import { NgKonvaEventObject } from '../interfaces/ngKonvaEventObject';
import { PropsType } from '../utils/types';

@Component({
  selector:
    'ko-shape, ko-layer, ko-circle, ko-fastlayer, ko-group, ko-label, ko-rect, ko-ellipse, ko-wedge, ko-line, ko-sprite, ko-image, ko-text, ko-text-path, ko-star, ko-ring, ko-arc, ko-tag, ko-path, ko-regular-polygon, ko-arrow, ko-transformer',
  standalone: true,
  template: `<div><ng-content></ng-content></div>`,
})
export class CoreShapeComponent
  implements KonvaComponent, AfterContentChecked, OnDestroy, OnInit
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

  public nameNode: keyof typeof ShapeTypes | 'Shape' | 'Sprite' = getName(
    inject(ElementRef).nativeElement.localName
  ) as keyof typeof ShapeTypes | 'Shape' | 'Sprite';

  private cacheProps: PropsType = {};
  private _stage:
    | Shape
    | Arc
    | Arrow
    | Circle
    | Ellipse
    | Image
    | Label
    | Tag
    | Line
    | Path
    | Rect
    | RegularPolygon
    | Ring
    | Sprite
    | Star
    | Text
    | TextPath
    | Transformer
    | Wedge
    | Group
    | Layer
    | FastLayer;
  protected _config: ShapeConfigTypes;

  public getStage():
    | Shape
    | Arc
    | Arrow
    | Circle
    | Ellipse
    | Image
    | Label
    | Tag
    | Line
    | Path
    | Rect
    | RegularPolygon
    | Ring
    | Sprite
    | Star
    | Text
    | TextPath
    | Transformer
    | Wedge
    | Group
    | Layer
    | FastLayer {
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
      this._stage = new Shape();
    }
    if (this.nameNode === 'Shape') {
      this._stage = new Shape();
    } else if (this.nameNode === 'Sprite') {
      this._stage = new Sprite(this.config as SpriteConfig);
    } else {
      this._stage = new Konva[this.nameNode](undefined);
    }

    const animationStage = this._stage.to.bind(this._stage);

    this._stage.to = (newConfig: ShapeConfigTypes): void => {
      animationStage(newConfig);
      setTimeout(() => {
        Object.keys(this._stage.attrs).forEach((key) => {
          if (typeof this._stage.attrs[key] !== 'function') {
            this.config[key] = this._stage.attrs[key];
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

  ngAfterContentChecked(): void {
    this.shapes.forEach((item: CoreShapeComponent) => {
      if (this !== item) {
        if (this._stage instanceof Group || this._stage instanceof Layer) {
          this._stage.add(item.getStage());
        }
        updatePicture(this._stage);
      }
    });
  }

  ngOnDestroy(): void {
    this._stage.destroy();
  }
}
