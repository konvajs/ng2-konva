/* eslint-disable @angular-eslint/no-output-native */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterContentInit,
  ContentChildren,
  QueryList,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  getName,
  createListener,
  applyNodeProps,
  updatePicture,
} from '../utils/index';
import { KonvaComponent } from '../interfaces/ko-component.interface';
import { Konva } from 'konva/lib/Core';
import { ShapeConfig } from 'konva/lib/Shape';
import { ShapeConfigTypes } from '../utils/configTypes';
import { KonvaEventObject, Node } from 'konva/lib/Node';

@Component({
  selector:
    'ko-shape, ko-layer, ko-circle, ko-fastlayer, ko-group, ko-label, ko-rect, ko-ellipse, ko-wedge, ko-line, ko-sprite, ko-image, ko-text, ko-text-path, ko-star, ko-ring, ko-arc, ko-tag, ko-path, ko-regular-polygon, ko-arrow',
  standalone: true,
  template: `<div><ng-content></ng-content></div>`,
})
export class CoreShapeComponent
  implements KonvaComponent, AfterContentInit, OnDestroy, OnInit
{
  @ContentChildren(CoreShapeComponent)
  shapes = new QueryList<CoreShapeComponent>();
  @Input({ required: true }) set config(config: ShapeConfigTypes) {
    this._config = config;
    this.uploadKonva(config);
  }
  get config(): ShapeConfig {
    return this._config;
  }

  @Output() click: EventEmitter<KonvaEventObject<unknown>> = new EventEmitter();
  @Output() dblclick: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() mouseover: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() mouseout: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() mousemove: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() tap: EventEmitter<KonvaEventObject<unknown>> = new EventEmitter();
  @Output() dbltap: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() touchstart: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() scaleXChange: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() fillChange: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() dragstart: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() dragmove: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();
  @Output() dragend: EventEmitter<KonvaEventObject<unknown>> =
    new EventEmitter();

  public nameNode: keyof typeof Konva = getName(
    inject(ElementRef).nativeElement.localName
  ) as keyof typeof Konva;
  public added = false;

  private cacheProps: any = {};
  private _stage: any = {};
  protected _config: ShapeConfigTypes; // todo config type

  public getStage(): Node {
    return this._stage;
  }

  public getConfig(): ShapeConfig {
    return this._config || {};
  }

  ngOnInit(): void {
    this.initKonva();

    this.click.emit.bind(this.click);
  }

  private initKonva(): void {
    const NodeClass = Konva[this.nameNode];
    this._stage = new NodeClass();
    this._stage.AngularComponent = this;
    const animationStage = this._stage.to.bind(this._stage);

    this._stage.to = (newConfig: any): void => {
      animationStage(newConfig);
      setTimeout(() => {
        Object.keys(this._stage.attrs).forEach((key) => {
          if (typeof this._stage.attrs[key] !== 'function') {
            this.config[key] = this._stage.attrs[key];
          }
        });
      }, 200);
    }; // todo test upload konva before init
  }

  protected uploadKonva(config: ShapeConfigTypes): void {
    const props = {
      ...config,
      ...createListener(this),
    };
    applyNodeProps(this, props, this.cacheProps);
    this.cacheProps = props;
  }

  ngAfterContentInit(): void {
    this.shapes.forEach((item: CoreShapeComponent) => {
      if (this !== item) {
        item.added = true;
        this._stage.add(item.getStage());
        updatePicture(this._stage);
      }
    });
  }

  ngOnDestroy(): void {
    this._stage.destroy();
  }
}
