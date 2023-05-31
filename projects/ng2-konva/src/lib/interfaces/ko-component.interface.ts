import { Component, EventEmitter } from '@angular/core';
import Konva from 'konva';
import { ShapeConfig } from 'konva/lib/Shape';

export interface KonvaComponent extends Component {
  getStage: () => Konva.Stage;
  getConfig: () => ShapeConfig;
  config: ShapeConfig;

  click?: EventEmitter<any>;
  dblclick?: EventEmitter<any>;
  mouseover?: EventEmitter<any>;
  mouseout?: EventEmitter<any>;
  mousemove?: EventEmitter<any>;
  tap?: EventEmitter<any>;
  dbltap?: EventEmitter<any>;
  touchstart?: EventEmitter<any>;
  scaleXChange?: EventEmitter<any>;
  fillChange?: EventEmitter<any>;
  dragstart?: EventEmitter<any>;
  dragmove?: EventEmitter<any>;
  dragend?: EventEmitter<any>;
}
