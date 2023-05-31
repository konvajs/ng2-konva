import { Shape } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import { KonvaComponent } from './ko-component.interface';

export type AngularNode<T extends Stage | Shape> = T & {
  AngularComponent: KonvaComponent;
};
