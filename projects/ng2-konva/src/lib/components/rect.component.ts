import { CoreShapeComponent } from 'ng2-konva';
import { Component, Input } from '@angular/core';
import { RectConfig } from 'konva/lib/shapes/Rect';

@Component({
  selector: 'ko-rect',
  template: ``,
  standalone: true,
})
export class RectComponent extends CoreShapeComponent {
  @Input({ required: true }) override set config(config: RectConfig) {
    this._config = config;
    this.uploadKonva(config);
  }
}
