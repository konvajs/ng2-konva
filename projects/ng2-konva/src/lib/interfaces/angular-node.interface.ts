import { KonvaComponent } from './ko-component.interface';
import { Shape } from 'konva/lib/Shape';
import { Label, Tag } from 'konva/lib/shapes/Label';
import { Rect } from 'konva/lib/shapes/Rect';
import { Ellipse } from 'konva/lib/shapes/Ellipse';
import { Wedge } from 'konva/lib/shapes/Wedge';
import { Line } from 'konva/lib/shapes/Line';
import { Arc } from 'konva/lib/shapes/Arc';
import { Arrow } from 'konva/lib/shapes/Arrow';
import { Circle } from 'konva/lib/shapes/Circle';
import { Image } from 'konva/lib/shapes/Image';
import { Path } from 'konva/lib/shapes/Path';
import { RegularPolygon } from 'konva/lib/shapes/RegularPolygon';
import { Ring } from 'konva/lib/shapes/Ring';
import { Star } from 'konva/lib/shapes/Star';
import { Text } from 'konva/lib/shapes/Text';
import { TextPath } from 'konva/lib/shapes/TextPath';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Sprite } from 'konva/lib/shapes/Sprite';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { FastLayer } from 'konva/lib/FastLayer';

export abstract class AngularNode {
  shape:
    | Shape
    | Arc
    | Arrow
    | Circle
    | Ellipse
    | Image
    | Label
    | Tag
    | Line
    | Path
    | Rect
    | RegularPolygon
    | Ring
    | Sprite
    | Star
    | Text
    | TextPath
    | Transformer
    | Wedge
    | Group
    | Layer
    | FastLayer;
  AngularComponent?: KonvaComponent;
}
