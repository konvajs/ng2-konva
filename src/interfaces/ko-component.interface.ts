import { OutputEmitterRef } from '@angular/core';
import { Node, NodeConfig } from 'konva/lib/Node';
import { NgKonvaEventObject } from './ngKonvaEventObject';

// TODO: do we need to export event fields here? They are already declared
// on StageComponent and CoreShapeComponent via output(). Users bind events
// in templates, not programmatically through this abstract class.
export abstract class KonvaComponent {
  abstract getStage(): Node;
  abstract getNode(): Node;
  abstract getConfig(): NodeConfig;

  mouseover?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mousemove?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mouseout?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mouseenter?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mouseleave?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mousedown?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  mouseup?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  wheel?: OutputEmitterRef<NgKonvaEventObject<WheelEvent>>;
  contextmenu?: OutputEmitterRef<NgKonvaEventObject<PointerEvent>>;
  click?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  dblclick?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  touchstart?: OutputEmitterRef<NgKonvaEventObject<TouchEvent>>;
  touchmove?: OutputEmitterRef<NgKonvaEventObject<TouchEvent>>;
  touchend?: OutputEmitterRef<NgKonvaEventObject<TouchEvent>>;
  tap?: OutputEmitterRef<NgKonvaEventObject<TouchEvent>>;
  dbltap?: OutputEmitterRef<NgKonvaEventObject<TouchEvent>>;
  dragstart?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  dragmove?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  dragend?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  transformstart?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  transform?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
  transformend?: OutputEmitterRef<NgKonvaEventObject<MouseEvent>>;
}
