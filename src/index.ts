import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StageComponent } from './components/stage.component';
import 'konva';

export * from './components/stage.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StageComponent,
  ],
  exports: [
    StageComponent,
  ]
})
export class KonvaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: KonvaModule
    };
  }
}
