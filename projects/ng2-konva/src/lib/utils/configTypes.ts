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

export type ShapeConfigTypes =
  | NodeConfig
  | RectConfig
  | ContainerConfig
  | StageConfig
  | LayerConfig
  | GroupConfig
  | ShapeConfig
  | TweenConfig
  | ArcConfig
  | ArrowConfig
  | CircleConfig
  | EllipseConfig;
