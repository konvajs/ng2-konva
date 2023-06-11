import { Component, EventEmitter } from '@angular/core';
import { ShapeConfigTypes } from '../utils/configTypes';
import { KonvaEventObject } from 'konva/lib/Node';
import { AngularNode } from './angular-node.interface';
import { Stage } from 'konva/lib/Stage';

export abstract class KonvaComponent extends Component {
  getStage: () => AngularNode | { shape: Stage };
  getConfig: () => ShapeConfigTypes;
  config: ShapeConfigTypes;

  click?: EventEmitter<KonvaEventObject<unknown>>;
  dblclick?: EventEmitter<KonvaEventObject<unknown>>;
  mouseover?: EventEmitter<KonvaEventObject<unknown>>;
  mouseout?: EventEmitter<KonvaEventObject<unknown>>;
  mousemove?: EventEmitter<KonvaEventObject<MouseEvent>>;
  tap?: EventEmitter<KonvaEventObject<unknown>>;
  dbltap?: EventEmitter<KonvaEventObject<unknown>>;
  touchstart?: EventEmitter<KonvaEventObject<unknown>>;
  scaleXChange?: EventEmitter<KonvaEventObject<unknown>>;
  fillChange?: EventEmitter<KonvaEventObject<unknown>>;
  dragstart?: EventEmitter<KonvaEventObject<unknown>>;
  dragmove?: EventEmitter<KonvaEventObject<unknown>>;
  dragend?: EventEmitter<KonvaEventObject<unknown>>;
}
