import {
  Component,
  ElementRef,
  OnDestroy,
  contentChildren,
  effect,
  inject,
  model,
  output,
} from '@angular/core';
import Konva from 'konva';
import { Node, NodeConfig } from 'konva/lib/Node';
import { Container } from 'konva/lib/Container';
import { Shape } from 'konva/lib/Shape';
import { SpriteConfig } from 'konva/lib/shapes/Sprite';
import { KonvaComponent } from '../interfaces/ko-component.interface';
import { NgKonvaEventObject } from '../interfaces/ngKonvaEventObject';
import { applyNodeProps, createListener, getName, updatePicture, PropsType } from '../utils';

@Component({
  standalone: true,
  selector:
    'ko-shape, ko-layer, ko-circle, ko-fastlayer, ko-group, ko-label, ko-rect, ko-ellipse, ko-wedge, ko-line, ko-sprite, ko-image, ko-text, ko-text-path, ko-star, ko-ring, ko-arc, ko-tag, ko-path, ko-regular-polygon, ko-arrow, ko-transformer',
  template: `<div><ng-content></ng-content></div>`,
})
export class CoreShapeComponent implements KonvaComponent, OnDestroy {
  readonly shapes = contentChildren(CoreShapeComponent);

  public readonly config = model<NodeConfig>();
  #onConfigChange = effect(() => {
    const config = this.config();
    if (!config) return;
    this.uploadKonva(config);
  });

  readonly mouseover = output<NgKonvaEventObject<MouseEvent>>();
  readonly mousemove = output<NgKonvaEventObject<MouseEvent>>();
  readonly mouseout = output<NgKonvaEventObject<MouseEvent>>();
  readonly mouseenter = output<NgKonvaEventObject<MouseEvent>>();
  readonly mouseleave = output<NgKonvaEventObject<MouseEvent>>();
  readonly mousedown = output<NgKonvaEventObject<MouseEvent>>();
  readonly mouseup = output<NgKonvaEventObject<MouseEvent>>();
  readonly wheel = output<NgKonvaEventObject<WheelEvent>>();
  readonly contextmenu = output<NgKonvaEventObject<PointerEvent>>();
  readonly click = output<NgKonvaEventObject<MouseEvent>>();
  readonly dblclick = output<NgKonvaEventObject<MouseEvent>>();
  readonly touchstart = output<NgKonvaEventObject<TouchEvent>>();
  readonly touchmove = output<NgKonvaEventObject<TouchEvent>>();
  readonly touchend = output<NgKonvaEventObject<TouchEvent>>();
  readonly tap = output<NgKonvaEventObject<TouchEvent>>();
  readonly dbltap = output<NgKonvaEventObject<TouchEvent>>();
  readonly dragstart = output<NgKonvaEventObject<MouseEvent>>();
  readonly dragmove = output<NgKonvaEventObject<MouseEvent>>();
  readonly dragend = output<NgKonvaEventObject<MouseEvent>>();
  readonly transformstart = output<NgKonvaEventObject<MouseEvent>>();
  readonly transform = output<NgKonvaEventObject<MouseEvent>>();
  readonly transformend = output<NgKonvaEventObject<MouseEvent>>();

  public nameNode: string = getName(
    inject(ElementRef).nativeElement.localName,
  );

  private cacheProps: PropsType = {};
  private _stage: Node;

  public getStage(): Node {
    return this._stage;
  }

  public getNode(): Node {
    return this._stage;
  }

  public getConfig(): NodeConfig {
    return this.config() || {};
  }

  constructor() {
    this.initKonva();
  }

  private initKonva(): void {
    if (this.nameNode === 'Sprite') {
      this._stage = new Konva.Sprite(this.config() as SpriteConfig);
    } else {
      const NodeClass = (Konva as Record<string, unknown>)[this.nameNode] as new (config?: NodeConfig) => Node;
      this._stage = new NodeClass();
    }

    const animationStage = this._stage.to.bind(this._stage);

    this._stage.to = (newConfig: NodeConfig): void => {
      animationStage(newConfig);
      setTimeout(() => {
        Object.keys(this._stage.attrs).forEach((key) => {
          if (typeof this._stage.attrs[key] !== 'function' && this.config()) {
            this.config.update((config) => ({
              ...config,
              [key]: this._stage.attrs[key],
            }));
          }
        });
      }, 200);
    };

    const config = this.config();
    if (config) {
      this.uploadKonva(config);
    }
  }

  protected uploadKonva(config: NodeConfig): void {
    if (!this._stage) return;
    const props = {
      ...config,
      ...createListener(this),
    };
    applyNodeProps(this, props, this.cacheProps);
    this.cacheProps = props;
  }

  #onShapesChange = effect(() => {
    this.shapes().forEach((item: CoreShapeComponent, index: number) => {
      if (this !== item) {
        if (this._stage instanceof Container) {
          this._stage.add(item.getStage() as Shape);
        }
        item.getStage().zIndex(index);
        updatePicture(this._stage);
      }
    });
  });

  ngOnDestroy(): void {
    this._stage.destroy();
  }
}
