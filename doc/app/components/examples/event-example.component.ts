import { Component, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { KonvaComponent } from 'ng2-konva';

@Component({
  selector: 'event-example',
  template: `
  <br>
  <section>
      <ko-stage #stage [config]="configStage">
          <ko-layer #layer>
              <ko-regular-polygon
                [config]="configItem"
                (mouseout)="handleMouseOut($event)"
                (mousemove)="handleMouseMove($event)"
              ></ko-regular-polygon>
              <ko-text #text [config]="configText"></ko-text>
          </ko-layer>
      </ko-stage>
      <br>
  </section>
  `
})
export class EventExampleComponent {
  @ViewChild('stage') stage: KonvaComponent;
  @ViewChild('layer') layer: KonvaComponent;
  @ViewChild('text') text: KonvaComponent;

  public configStage: Observable<any> = of({
    width: 300,
    height: 200
  });
  public configItem: Observable<any> = of({
    x: 80,
    y: 120,
    sides: 3,
    radius: 80,
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4
  });
  public configText = Observable.of({
    x: 10,
    y: 10,
    fontFamily: 'Calibri',
    fontSize: 24,
    text: '',
    fill: 'black'
  });

  public writeMessage(message: string) {
    this.text.getStage().setText(message);
    this.layer.getStage().draw();
  }

  public handleMouseOut() {
    this.writeMessage('Mouseout triangle');
  }

  public handleMouseMove() {
    const mousePos = this.stage.getStage().getPointerPosition();
    const x = mousePos.x - 190;
    const y = mousePos.y - 40;
    this.writeMessage('x: ' + x + ', y: ' + y);
  }
}
