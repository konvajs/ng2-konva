import { Component, OutputEmitterRef } from '@angular/core';
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
import { Sprite } from 'konva/lib/shapes/Sprite';
import { Star } from 'konva/lib/shapes/Star';
import { Text } from 'konva/lib/shapes/Text';
import { TextPath } from 'konva/lib/shapes/TextPath';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Wedge } from 'konva/lib/shapes/Wedge';
import { Stage } from 'konva/lib/Stage';
import { ShapeConfigTypes } from '../utils/configTypes';
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

  mouseover?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mousemove?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mouseout?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mouseenter?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mouseleave?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mousedown?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mouseup?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  wheel?: OutputEmitterRef<NgKonvaEventObject<WheelEvent>>;
  contextmenu?: OutputEmitterRef<NgKonvaEventObject<PointerEvent>>;
  click?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  dblclick?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  touchstart?: OutputEmitterRef<NgKonvaEventObject<TouchEvent>>;
  touchmove?: OutputEmitterRef<NgKonvaEventObject<TouchEvent>>;
  touchend?: OutputEmitterRef<NgKonvaEventObject<TouchEvent>>;
  tap?: OutputEmitterRef<NgKonvaEventObject<TouchEvent>>;
  dbltap?: OutputEmitterRef<NgKonvaEventObject<TouchEvent>>;
  dragstart?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  dragmove?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  dragend?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
}
