import { Component } from '@angular/core';
import {
  CoreShapeComponent,
  NgKonvaEventObject,
  StageComponent,
} from 'ng2-konva';
import { StageConfig } from 'konva/lib/Stage';
import { RegularPolygonConfig } from 'konva/lib/shapes/RegularPolygon';
import { TextConfig } from 'konva/lib/shapes/Text';

@Component({
    selector: 'app-event-example',
    template: `
    <section>
      <ko-stage [config]="configStage">
        <ko-layer>
          <ko-regular-polygon
            [config]="configItem"
            (mouseout)="handleMouseOut()"
            (blur)="handleMouseOut()"
            (mousemove)="handleMouseMove($event)"
          ></ko-regular-polygon>
          <ko-text [config]="configText"></ko-text>
        </ko-layer>
      </ko-stage>
    </section>
  `,
    imports: [StageComponent, CoreShapeComponent]
})
export class EventExampleComponent {
  public configStage: Partial<StageConfig> = {
    width: 300,
    height: 200,
  };

  public configItem: RegularPolygonConfig = {
    x: 80,
    y: 120,
    sides: 3,
    radius: 80,
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4,
  };

  public configText: TextConfig = {
    x: 10,
    y: 10,
    fontFamily: 'Calibri',
    fontSize: 24,
    text: '',
    fill: 'black',
  };

  writeMessage(message: string): void {
    this.configText = { ...this.configText, text: message };
  }

  handleMouseOut(): void {
    this.writeMessage('Mouseout triangle');
  }

  handleMouseMove(event: NgKonvaEventObject<MouseEvent>): void {
    const mousePos = event.event.target.getRelativePointerPosition();
    if (mousePos === null) return;
    const x = mousePos.x - 190;
    const y = mousePos.y - 40;
    this.writeMessage('x: ' + x + ', y: ' + y);
  }
}
