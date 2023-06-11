import { Component, EventEmitter } from '@angular/core';
import { ShapeConfigTypes } from '../utils/configTypes';
import { KonvaEventObject } from 'konva/lib/Node';
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

  mouseover?: EventEmitter<KonvaEventObject<MouseEvent>>;
  mousemove?: EventEmitter<KonvaEventObject<MouseEvent>>;
  mouseout?: EventEmitter<KonvaEventObject<MouseEvent>>;
  mouseenter?: EventEmitter<KonvaEventObject<MouseEvent>>;
  mouseleave?: EventEmitter<KonvaEventObject<MouseEvent>>;
  mousedown?: EventEmitter<KonvaEventObject<MouseEvent>>;
  mouseup?: EventEmitter<KonvaEventObject<MouseEvent>>;
  wheel?: EventEmitter<KonvaEventObject<WheelEvent>>;
  contextmenu?: EventEmitter<KonvaEventObject<PointerEvent>>;
  click?: EventEmitter<KonvaEventObject<MouseEvent>>;
  dblclick?: EventEmitter<KonvaEventObject<MouseEvent>>;
  touchstart?: EventEmitter<KonvaEventObject<TouchEvent>>;
  touchmove?: EventEmitter<KonvaEventObject<TouchEvent>>;
  touchend?: EventEmitter<KonvaEventObject<TouchEvent>>;
  tap?: EventEmitter<KonvaEventObject<TouchEvent>>;
  dbltap?: EventEmitter<KonvaEventObject<TouchEvent>>;
  dragstart?: EventEmitter<KonvaEventObject<MouseEvent>>;
  dragmove?: EventEmitter<KonvaEventObject<MouseEvent>>;
  dragend?: EventEmitter<KonvaEventObject<MouseEvent>>;
}
