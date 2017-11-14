import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoreShape } from 'n2-konva';

@Component({
  selector: 'event-example',
  template: `
  <br>
  <section>
      <ko-stage [config]="configStage">
          <ko-layer #layer>
              <ko-regular-polygon [config]="configItem" (click)="handleClick($event)"></ko-regular-polygon>
          </ko-layer>
      </ko-stage>
      <br>
  </section>
  `
})
export class EventExampleComponent implements OnInit {
  @ViewChild('layer') layer: CoreShape;

  public configStage = Observable.of({
    width: 300,
    height: 200
  });
  public configItem = Observable.of({
    x: 80,
    y: 120,
    sides: 3,
    radius: 80,
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4
  });

  public handleClick(event: any) {
    console.log('Hello Circle', event);
  }

  ngOnInit() {
    console.log(this.layer.getStage());
  }
}
