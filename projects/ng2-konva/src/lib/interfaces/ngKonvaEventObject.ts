import { KonvaComponent } from './ko-component.interface';
import { KonvaEventObject } from 'konva/lib/Node';

export interface NgKonvaEventObject<T> {
  angularComponent: KonvaComponent;
  event: KonvaEventObject<T>;
}
