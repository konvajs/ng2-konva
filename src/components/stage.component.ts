import {
  Component,
  ElementRef,
  OnDestroy,
  contentChildren,
  effect,
  inject,
  input,
  output,
  viewChild,
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
import { CoreShapeComponent as CoreShape } from './core-shape.component';

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
  template: `<div #container><ng-content></ng-content></div>`,
})
export class StageComponent implements KonvaComponent, OnDestroy {
  private container = viewChild.required<ElementRef>('container');
  readonly shapes = contentChildren(CoreShape);

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
  }

  public readonly config = input<ContainerConfig>();
  #onConfigChange = effect(() => {
    const config = this.config();
    if (!config) return;
    if (!this._stage) {
      this._stage = new Stage({
        ...config,
        container: this.container().nativeElement,
      });

      this.uploadKonva(config);
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

  private uploadKonva(config: ContainerConfig): void {
    const props = {
      ...config,
      ...createListener(this),
    };
    applyNodeProps(this, props, this.cacheProps);
    this.cacheProps = props;
  }

  #onShapesChange = effect(() => {
    this.shapes().forEach((item: CoreShape, index: number) => {
      if (!(item.getStage() instanceof Layer)) {
        throw 'You can only add Layer Nodes to Stage Nodes!';
      }
      this._stage.add(item.getStage() as Layer);
      item.getStage().zIndex(index);
      updatePicture(this._stage);
    });
  });

  ngOnDestroy(): void {
    this._stage.destroy();
  }
}
