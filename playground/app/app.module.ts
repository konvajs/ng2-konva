import { NgModule, BrowserModule } from '@angular/core';
import { KonvaModule } from 'ng2-konva';

import { AppComponent } from './app.component';
import { DemoHeaderComponent } from './components/demo-header';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, DemoHeaderComponent],
  imports: [BrowserModule, KonvaModule]
})
export class AppModule {}
