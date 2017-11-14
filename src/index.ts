import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StageComponent } from './components/stage.component';
import { CoreShapeComponent } from './components/core-shape.component';
import 'konva';

export * from './components/stage.component';
export * from './components/core-shape.component';
export * from './ko.interface';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StageComponent,
    CoreShapeComponent,
  ],
  exports: [
    StageComponent,
    CoreShapeComponent,
  ]
})
export class KonvaModule {
}
