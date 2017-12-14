import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { KonvaModule } from 'ng2-konva';

import './operators';

import { AppComponent } from './app.component';
import { DemoHeaderComponent } from './components/demo-header';
import { ExampleSectionComponent } from './components/example-section.component';
import { ApiComponent } from './components/api.component';
import { CircleExampleComponent } from './components/examples/circle-example.component';
import { EventExampleComponent } from './components/examples/event-example.component';
import { ShapesExampleComponent } from './components/examples/shapes-example.component';
import { StylesExampleComponent } from './components/examples/styles-example.component';
import { AnimationExampleComponent } from './components/examples/animation-example.component';
import { StarExampleComponent } from './components/examples/star-example.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    DemoHeaderComponent,
    ExampleSectionComponent,
    CircleExampleComponent,
    EventExampleComponent,
    ShapesExampleComponent,
    StylesExampleComponent,
    AnimationExampleComponent,
    StarExampleComponent,
    ApiComponent
  ],
  imports: [BrowserModule, KonvaModule]
})
export class AppModule {}
