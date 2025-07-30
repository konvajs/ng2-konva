/* eslint-disable @angular-eslint/no-output-native */
import {
  Component,
  ElementRef,
  OnDestroy,
  contentChildren,
  effect,
  inject,
  model,
  output
} from '@angular/core';
import Konva from 'konva';
import { FastLayer } from 'konva/lib/FastLayer';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Shape } from 'konva/lib/Shape';
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
import { Sprite, SpriteConfig } from 'konva/lib/shapes/Sprite';
import { Star } from 'konva/lib/shapes/Star';
import { Text } from 'konva/lib/shapes/Text';
import { TextPath } from 'konva/lib/shapes/TextPath';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Wedge } from 'konva/lib/shapes/Wedge';
import { KonvaComponent } from '../interfaces/ko-component.interface';
import { NgKonvaEventObject } from '../interfaces/ngKonvaEventObject';
import { updatePicture } from '../utils';
import { ShapeConfigTypes } from '../utils/configTypes';
import { applyNodeProps, createListener, getName } from '../utils/index';
import { ShapeTypes } from '../utils/shapeTypes';
import { PropsType } from '../utils/types';

@Component({
  selector:
    'ko-shape, ko-layer, ko-circle, ko-fastlayer, ko-group, ko-label, ko-rect, ko-ellipse, ko-wedge, ko-line, ko-sprite, ko-image, ko-text, ko-text-path, ko-star, ko-ring, ko-arc, ko-tag, ko-path, ko-regular-polygon, ko-arrow, ko-transformer',
  template: `<div><ng-content></ng-content></div>`,
})
export class CoreShapeComponent
  implements KonvaComponent, OnDestroy
{
  readonly shapes = contentChildren(CoreShapeComponent);

  public readonly config = model<ShapeConfigTypes>();
  #onConfigChange = effect(() => {
    const config = this.config();
    if (!config) return;
    this.uploadKonva(config)
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
    return this.config() || {};
  }

  constructor() {
    this.initKonva();
  }

  private initKonva(): void {
    if (!this._stage) {
      this._stage = new Shape();
    }
    if (this.nameNode === 'Shape') {
      this._stage = new Shape();
    } else if (this.nameNode === 'Sprite') {
      this._stage = new Sprite(this.config() as SpriteConfig);
    } else {
      this._stage = new Konva[this.nameNode](undefined);
    }

    const animationStage = this._stage.to.bind(this._stage);

    this._stage.to = (newConfig: ShapeConfigTypes): void => {
      animationStage(newConfig);
      setTimeout(() => {
        Object.keys(this._stage.attrs).forEach((key) => {
          if (typeof this._stage.attrs[key] !== 'function' && this.config()) {
            this.config.update((config) => ({
              ...config,
              [key]: this._stage.attrs[key],
            }));
          }
        });
      }, 200);
    };

    const config = this.config();
    if (config) {
      this.uploadKonva(config);
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

  #onShapesChange = effect(() => {
    this.shapes().forEach((item: CoreShapeComponent) => {
      if (this !== item ) {
        if (this._stage instanceof Group || this._stage instanceof Layer) {
          this._stage.add(item.getStage());
        }
        updatePicture(this._stage);
      }
    });
  });

  ngOnDestroy(): void {
    this._stage.destroy();
  }
}
