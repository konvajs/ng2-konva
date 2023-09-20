import { Component, EventEmitter } from '@angular/core';
import { ShapeConfigTypes } from '../utils/configTypes';
import { Stage } from 'konva/lib/Stage';
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
import { Sprite } from 'konva/lib/shapes/Sprite';
import { Star } from 'konva/lib/shapes/Star';
import { Text } from 'konva/lib/shapes/Text';
import { TextPath } from 'konva/lib/shapes/TextPath';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Wedge } from 'konva/lib/shapes/Wedge';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { FastLayer } from 'konva/lib/FastLayer';
import { NgKonvaEventObject } from './ngKonvaEventObject';

export abstract class KonvaComponent extends Component {
  getStage: () =>
    | Stage
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
  getConfig: () => ShapeConfigTypes;
  config: ShapeConfigTypes;

  mouseover?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  mousemove?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  mouseout?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  mouseenter?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  mouseleave?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  mousedown?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  mouseup?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  wheel?: EventEmitter<NgKonvaEventObject<WheelEvent>>;
  contextmenu?: EventEmitter<NgKonvaEventObject<PointerEvent>>;
  click?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  dblclick?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  touchstart?: EventEmitter<NgKonvaEventObject<TouchEvent>>;
  touchmove?: EventEmitter<NgKonvaEventObject<TouchEvent>>;
  touchend?: EventEmitter<NgKonvaEventObject<TouchEvent>>;
  tap?: EventEmitter<NgKonvaEventObject<TouchEvent>>;
  dbltap?: EventEmitter<NgKonvaEventObject<TouchEvent>>;
  dragstart?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  dragmove?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  dragend?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  transformstart?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  transform?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
  transformend?: EventEmitter<NgKonvaEventObject<MouseEvent>>;
}
