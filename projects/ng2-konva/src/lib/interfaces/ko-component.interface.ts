import { Component, EventEmitter } from '@angular/core';
import { ShapeConfig } from 'konva/lib/Shape';
import { ShapeConfigTypes } from '../utils/configTypes';
import { KonvaEventObject, Node } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';

export interface KonvaComponent extends Component {
  getStage: () => Stage | Node;
  getConfig: () => ShapeConfigTypes;
  config: ShapeConfig;

  click?: EventEmitter<KonvaEventObject<unknown>>;
  dblclick?: EventEmitter<KonvaEventObject<unknown>>;
  mouseover?: EventEmitter<KonvaEventObject<unknown>>;
  mouseout?: EventEmitter<KonvaEventObject<unknown>>;
  mousemove?: EventEmitter<KonvaEventObject<unknown>>;
  tap?: EventEmitter<KonvaEventObject<unknown>>;
  dbltap?: EventEmitter<KonvaEventObject<unknown>>;
  touchstart?: EventEmitter<KonvaEventObject<unknown>>;
  scaleXChange?: EventEmitter<KonvaEventObject<unknown>>;
  fillChange?: EventEmitter<KonvaEventObject<unknown>>;
  dragstart?: EventEmitter<KonvaEventObject<unknown>>;
  dragmove?: EventEmitter<KonvaEventObject<unknown>>;
  dragend?: EventEmitter<KonvaEventObject<unknown>>;
}
