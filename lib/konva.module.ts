import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StageComponent } from './components/stage.component';
import { CoreShapeComponent } from './components/core-shape.component';

declare global {
  interface Window { Konva: any; }
}

if (typeof window !== 'undefined' && !window.Konva) {
  require('konva');
}

export * from './components/stage.component';
export * from './components/core-shape.component';
export { KonvaComponent } from './ko.interface';

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
