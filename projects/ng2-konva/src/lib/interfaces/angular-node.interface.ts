import { KonvaComponent } from './ko-component.interface';
import { Container } from 'konva/lib/Container';
import { Shape } from 'konva/lib/Shape';
import Konva from 'konva';
import Group = Konva.Group;

export abstract class AngularNode extends Container<Group | Shape> {
  AngularComponent?: KonvaComponent;
}
