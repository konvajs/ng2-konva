import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { KonvaModule } from 'ng2-konva';

import { AppComponent } from './app.component';
import { DemoHeaderComponent } from './components/demo-header';
import { ExamplesComponent } from './components/examples.component';
import { ApiComponent } from './components/api.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    DemoHeaderComponent,
    ExamplesComponent,
    ApiComponent
  ],
  imports: [BrowserModule, KonvaModule]
})
export class AppModule {}
