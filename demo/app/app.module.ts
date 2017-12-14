import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { KonvaModule } from '../../dist/konva.module';

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
