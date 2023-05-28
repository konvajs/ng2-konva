import { Component } from '@angular/core';
import Konva from 'konva';
import { ShapeConfig } from 'konva/lib/Shape';

export interface KonvaComponent extends Component {
  getStage: () => Konva.Stage;
  getConfig: () => ShapeConfig;
  config: ShapeConfig;
}
