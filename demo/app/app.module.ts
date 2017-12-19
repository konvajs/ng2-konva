import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { KonvaModule } from '../../dist/ng2-konva';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    KonvaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
