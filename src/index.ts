import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StageComponent } from './components/stage.component';
import { ShapeComponent } from './components/shape.component';
import 'konva';

export * from './components/stage.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StageComponent,
    ShapeComponent,
  ],
  exports: [
    StageComponent,
    ShapeComponent,
  ]
})
export class KonvaModule {
}
