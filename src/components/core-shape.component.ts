import {
  Component,
  DestroyRef,
  ElementRef,
  InjectionToken,
  OnDestroy,
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

export interface KonvaContainer {
  addChild(child: CoreShapeComponent): void;
  removeChild(child: CoreShapeComponent): void;
}

/**
 * DI token for the nearest Konva container (Stage, Layer, or Group).
 * Each container provides itself via this token, allowing child components
 * (even across wrapper component boundaries) to register themselves with
 * their nearest Konva parent.
 */
export const KONVA_CONTAINER = new InjectionToken<KonvaContainer | null>('KONVA_CONTAINER', {
  providedIn: 'root',
  factory: () => null,
});

@Component({
  standalone: true,
  selector:
    'ko-shape, ko-layer, ko-circle, ko-fastlayer, ko-group, ko-label, ko-rect, ko-ellipse, ko-wedge, ko-line, ko-sprite, ko-image, ko-text, ko-text-path, ko-star, ko-ring, ko-arc, ko-tag, ko-path, ko-regular-polygon, ko-arrow, ko-transformer',
  template: `<ng-content></ng-content>`,
  providers: [
    { provide: KONVA_CONTAINER, useFactory: () => inject(CoreShapeComponent) },
  ],
})
export class CoreShapeComponent implements KonvaComponent, KonvaContainer, OnDestroy {
  private parent: KonvaContainer | null = null;
  private children: CoreShapeComponent[] = [];

  private registered = false;
  public readonly config = model<NodeConfig>();
  #onConfigChange = effect(() => {
    const config = this.config();
    this.uploadKonva(config || {});
    // Register with parent after first config is applied so the node
    // has its properties before being added to the Konva tree.
    if (!this.registered && this.parent) {
      this.registered = true;
      this.parent.addChild(this);
    }
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

  private hostElement = inject(ElementRef).nativeElement;
  public nameNode: string = getName(this.hostElement.localName);

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
    this.parent = inject(KONVA_CONTAINER, { skipSelf: true });
    this.initKonva();

    // Cleanup on destroy
    if (this.parent) {
      inject(DestroyRef).onDestroy(() => {
        this.parent!.removeChild(this);
      });
    }

    // Watch for DOM reordering (e.g., @for with track) to sync z-indices
    if (this._stage instanceof Container) {
      const observer = new MutationObserver(() => {
        if (this.children.length > 1) {
          this.syncChildOrderFromDOM();
        }
      });
      observer.observe(this.hostElement, { childList: true, subtree: true });
      inject(DestroyRef).onDestroy(() => observer.disconnect());
    }
  }

  addChild(child: CoreShapeComponent): void {
    if (this._stage instanceof Container) {
      this.children.push(child);
      this._stage.add(child.getStage() as Shape);
      this.syncZIndices();
    }
  }

  removeChild(child: CoreShapeComponent): void {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.getStage().remove();
      this.syncZIndices();
      updatePicture(this._stage);
    }
  }

  private syncZIndices(): void {
    this.children.forEach((child, index) => {
      if (child.getStage().getParent()) {
        child.getStage().zIndex(index);
      }
    });
  }

  private syncChildOrderFromDOM(): void {
    const sorted = [...this.children].sort((a, b) => {
      const pos = a.hostElement.compareDocumentPosition(b.hostElement);
      return pos & globalThis.Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    // Only update if order actually changed
    const changed = sorted.some((child, i) => child !== this.children[i]);
    if (changed) {
      this.children = sorted;
      this.syncZIndices();
      updatePicture(this._stage);
    }
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

  ngOnDestroy(): void {
    this._stage.destroy();
  }
}
