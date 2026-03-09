import {
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { NodeConfig } from 'konva/lib/Node';
import { ContainerConfig } from 'konva/lib/Container';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { KonvaComponent } from '../interfaces/ko-component.interface';
import { NgKonvaEventObject } from '../interfaces/ngKonvaEventObject';
import {
  applyNodeProps,
  createListener,
  updatePicture,
  PropsType,
} from '../utils';
import { CoreShapeComponent, KonvaContainer, KONVA_CONTAINER } from './core-shape.component';

// Native DOM events that collide with our output() names.
// Angular binds (click)="handler()" to BOTH the output AND the native
// DOM event, causing double-fire. We prevent this by blocking native
// event listeners on the host element for these event names.
// See: https://github.com/angular/angular/issues/14619
const NATIVE_EVENTS = [
  'mouseover', 'mousemove', 'mouseout', 'mouseenter', 'mouseleave',
  'mousedown', 'mouseup', 'wheel', 'contextmenu', 'click', 'dblclick',
  'touchstart', 'touchmove', 'touchend',
];

@Component({
  standalone: true,
  selector: 'ko-stage',
  template: `<ng-content></ng-content>`,
  providers: [
    { provide: KONVA_CONTAINER, useFactory: () => inject(StageComponent) },
  ],
})
export class StageComponent implements KonvaComponent, KonvaContainer, OnDestroy {
  private konvaContainer: HTMLDivElement;
  private children: CoreShapeComponent[] = [];

  constructor() {
    // Prevent Angular's DomEventsPlugin from adding native DOM event
    // listeners on the host for events that collide with our outputs.
    // Our output() subscriptions still work (they're not DOM listeners).
    // Native events still bubble past the host to window/document normally.
    const el = inject(ElementRef).nativeElement;
    const original = el.addEventListener.bind(el);
    el.addEventListener = (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
      if (NATIVE_EVENTS.includes(type)) return;
      original(type, listener, options);
    };

    // Create a separate div for Konva's stage container so it doesn't
    // wipe Angular's projected content (<ng-content>).
    this.konvaContainer = document.createElement('div');
    el.prepend(this.konvaContainer);
  }

  public readonly config = input<ContainerConfig>();
  #onConfigChange = effect(() => {
    const config = this.config();
    if (!config) return;
    if (!this._stage) {
      this._stage = new Stage({
        ...config,
        container: this.konvaContainer,
      });

      this.uploadKonva(config);
      // Add any children that registered before the stage was created
      this.flushPendingChildren();
    } else {
      this.uploadKonva(config);
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

  private _stage: Stage;
  private cacheProps: PropsType = {};

  public getStage(): Stage {
    return this._stage;
  }

  public getNode(): Stage {
    return this._stage;
  }

  public getConfig(): NodeConfig {
    return this.config() || {};
  }

  addChild(child: CoreShapeComponent): void {
    if (!(child.getStage() instanceof Layer)) {
      throw 'You can only add Layer Nodes to Stage Nodes!';
    }
    this.children.push(child);
    if (this._stage) {
      this._stage.add(child.getStage() as Layer);
      this.syncZIndices();
      updatePicture(this._stage);
    }
  }

  removeChild(child: CoreShapeComponent): void {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.getStage().remove();
      this.syncZIndices();
      if (this._stage) {
        updatePicture(this._stage);
      }
    }
  }

  private syncZIndices(): void {
    this.children.forEach((child, index) => {
      if (child.getStage().getParent()) {
        child.getStage().zIndex(index);
      }
    });
  }

  private flushPendingChildren(): void {
    this.children.forEach((child) => {
      this._stage.add(child.getStage() as Layer);
    });
    this.syncZIndices();
  }

  private uploadKonva(config: ContainerConfig): void {
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
