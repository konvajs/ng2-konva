import { Component, EventEmitter } from '@angular/core';
import { ShapeConfigTypes } from '../utils/configTypes';
import { KonvaEventObject } from 'konva/lib/Node';
import { AngularNode } from './angular-node.interface';
import { Stage } from 'konva/lib/Stage';

export abstract class KonvaComponent extends Component {
  getStage: () => AngularNode | { shape: Stage };
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
