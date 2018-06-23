import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'shapes-example',
  template: `
  <br>
  <section>
      <ko-stage [config]="configStage">
          <ko-layer>
              <ko-shape [config]="configShape"></ko-shape>
          </ko-layer>
      </ko-stage>
      <br>
  </section>
  `
})
export class ShapesExampleComponent {
  public configStage: Observable<any> = of({
    width: 400,
    height: 200
  });
  public configShape: Observable<any> = of({
    sceneFunc: function(context: any) {
      context.beginPath();
      context.moveTo(20, 50);
      context.lineTo(220, 80);
      context.quadraticCurveTo(150, 100, 260, 170);
      context.closePath();

      // special Konva.js method
      context.fillStrokeShape(this);
    },
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4
  });
}
