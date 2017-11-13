/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { KonvaModule } from 'ng2-konva';

@Component({
  selector: 'app',
  template: `
    <ko-stage [config]="configStage">
      <ko-layer>
        <ko-circle [config]="configCircle" (click)="handleClick($event)"></ko-circle>
      </ko-layer>
    </ko-stage>`
})
class AppComponent implements OnInit {
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

  public handleClick(event) {
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

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, KonvaModule]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
