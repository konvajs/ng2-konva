/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { KonvaModule }  from 'ng2-konva';

@Component({
  selector: 'app',
  template: `<stage></stage>`
})
class AppComponent {}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, KonvaModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
