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
  @Input({ required: true }) set config(config: any) {
    // todo config type
    this._config = config;
    this.uploadKonva(config);
  }
  get config(): any {
    return this._config;
  }

  @Output() click: EventEmitter<any> = new EventEmitter();
  @Output() dblclick: EventEmitter<any> = new EventEmitter();
  @Output() mouseover: EventEmitter<any> = new EventEmitter();
  @Output() mouseout: EventEmitter<any> = new EventEmitter();
  @Output() mousemove: EventEmitter<any> = new EventEmitter();
  @Output() tap: EventEmitter<any> = new EventEmitter();
  @Output() dbltap: EventEmitter<any> = new EventEmitter();
  @Output() touchstart: EventEmitter<any> = new EventEmitter();
  @Output() scaleXChange: EventEmitter<any> = new EventEmitter();
  @Output() fillChange: EventEmitter<any> = new EventEmitter();
  @Output() dragstart: EventEmitter<any> = new EventEmitter();
  @Output() dragmove: EventEmitter<any> = new EventEmitter();
  @Output() dragend: EventEmitter<any> = new EventEmitter();

  public nameNode: keyof typeof Konva = getName(
    inject(ElementRef).nativeElement.localName
  ) as keyof typeof Konva;
  public added = false;

  private cacheProps: any = {};
  private _stage: any = {};
  private _config: any; // todo config type

  public getStage() {
    return this._stage;
  }

  public getConfig() {
    return this._config || {};
  }

  ngOnInit() {
    this.initKonva();
  }

  private initKonva() {
    const NodeClass = Konva[this.nameNode];
    this._stage = new NodeClass();
    this._stage.AngularComponent = this;
    const animationStage = this._stage.to.bind(this._stage);

    this._stage.to = (newConfig: any) => {
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

  private uploadKonva(config: any) {
    const props = {
      ...config,
      ...createListener(this),
    };
    applyNodeProps(this, props, this.cacheProps);
    this.cacheProps = props;
  }

  ngAfterContentInit() {
    this.shapes.forEach((item: CoreShapeComponent) => {
      if (this !== item) {
        item.added = true;
        this._stage.add(item.getStage());
        updatePicture(this._stage);
      }
    });
  }

  ngOnDestroy() {
    this._stage.destroy();
  }
}
