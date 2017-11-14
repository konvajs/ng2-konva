import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'examples',
  template: `
  <br>
  <section [attr.id]="name">
      <div class="row">
          <h1>{{name}}
          </h1>
      </div>
      <hr>
      <div class="row">
          <h2 id="examples">Circle</h2>
      </div>
      <ko-stage [config]="configStage">
          <ko-layer>
              <ko-circle [config]="configCircle" (click)="handleClick($event)"></ko-circle>
          </ko-layer>
      </ko-stage>
      <br>
  </section>
  `
})
export class ExamplesComponent implements OnInit {
  public name = 'Examples';

  public configStage = new BehaviorSubject({
    width: 200,
    height: 200
  });
  public configCircle = Observable.of({
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
