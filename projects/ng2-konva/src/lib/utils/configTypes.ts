import { RectConfig } from 'konva/lib/shapes/Rect';
import { NodeConfig } from 'konva/lib/Node';
import { ContainerConfig } from 'konva/lib/Container';
import { StageConfig } from 'konva/lib/Stage';
import { LayerConfig } from 'konva/lib/Layer';
import { GroupConfig } from 'konva/lib/Group';
import { ShapeConfig } from 'konva/lib/Shape';
import { TweenConfig } from 'konva/lib/Tween';
import { ArcConfig } from 'konva/lib/shapes/Arc';
import { ArrowConfig } from 'konva/lib/shapes/Arrow';
import { CircleConfig } from 'konva/lib/shapes/Circle';
import { EllipseConfig } from 'konva/lib/shapes/Ellipse';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { LabelConfig, TagConfig } from 'konva/lib/shapes/Label';
import { LineConfig } from 'konva/lib/shapes/Line';
import { PathConfig } from 'konva/lib/shapes/Path';
import { RegularPolygonConfig } from 'konva/lib/shapes/RegularPolygon';
import { RingConfig } from 'konva/lib/shapes/Ring';
import { SpriteConfig } from 'konva/lib/shapes/Sprite';
import { StarConfig } from 'konva/lib/shapes/Star';
import { TextConfig } from 'konva/lib/shapes/Text';
import { TextPathConfig } from 'konva/lib/shapes/TextPath';
import { TransformerConfig } from 'konva/lib/shapes/Transformer';
import { WedgeConfig } from 'konva/lib/shapes/Wedge';

export type ShapeConfigTypes =
  | NodeConfig
  | ContainerConfig
  | StageConfig
  | LayerConfig
  | GroupConfig
  | ShapeConfig
  | TweenConfig
  | ArcConfig
  | ArrowConfig
  | CircleConfig
  | EllipseConfig
  | ImageConfig
  | LabelConfig
  | TagConfig
  | LineConfig
  | PathConfig
  | RectConfig
  | RegularPolygonConfig
  | RingConfig
  | SpriteConfig
  | StarConfig
  | TextConfig
  | TextPathConfig
  | TransformerConfig
  | WedgeConfig;
