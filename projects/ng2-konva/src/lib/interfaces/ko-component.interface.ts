import { Component } from '@angular/core';

export interface KonvaComponent extends Component {
  getStage: () => void;
  getConfig: () => void;
  config: unknown;
}
