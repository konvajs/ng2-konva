import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'circle-example',
  template: `
  <br>
  <section>
      <ko-stage [config]="configStage">
          <ko-layer>
              <ko-circle [config]="configCircle" (click)="handleClick($event)"></ko-circle>
          </ko-layer>
      </ko-stage>
      <br>
  </section>
  `
})
export class CircleExampleComponent implements OnInit {
  public configStage = new BehaviorSubject({
    width: 200,
    height: 200
  });
  public configCircle: Observable<any> = of({
    x: 100,
    y: 100,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
  });

  public handleClick(event: any) {
    console.log('Hello Circle', event);
  }

  ngOnInit() {
    setTimeout(() => {
      this.configStage.next({
        width: 500,
        height: 200
      });
    }, 1000);
  }
}
