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
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  getName,
  createListener,
  applyNodeProps,
  updatePicture
} from '../utils/index';
import { KonvaComponent } from '../ko.interface';

declare const Konva: any;

@Component({
  // tslint:disable-next-line:max-line-length
  selector:
    // tslint:disable-next-line:max-line-length
    'ko-shape, ko-layer, ko-circle, ko-fastlayer, ko-group, ko-label, ko-rect, ko-ellipse, ko-wedge, ko-line, ko-sprite, ko-image, ko-text, ko-text-path, ko-star, ko-ring, ko-arc, ko-tag, ko-path, ko-regular-polygon, ko-arrow',
  template: `<div><ng-content></ng-content></div>`
})
export class CoreShapeComponent
  implements KonvaComponent, AfterContentInit, OnDestroy, OnInit {
  public shapes = new QueryList<CoreShape>();
  @ContentChildren(CoreShape) set content(list: QueryList<CoreShape>) {
    this.shapes = list;

    this.shapes.forEach((item: CoreShape) => {
      this._stage.add(item.getStage());
      updatePicture(this._stage);
    });
  }
  @Input() config: Observable<any>;
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

  public nameNode: string;
  public added = false;

  private cacheProps: any = {};
  private _stage: any = {};
  private _config;

  public getStage() {
    return this._stage;
  }

  public getConfig() {
    return this._config || {};
  }

  constructor(private elementRef: ElementRef) {
    this.nameNode = getName(elementRef.nativeElement.localName);
  }

  ngOnInit() {
    this.initKonva();
  }

  private initKonva() {
    const ng = this;
    const NodeClass = Konva[this.nameNode];
    this._stage = new NodeClass();
    this._stage.AngularComponent = this;
    const animationStage = this._stage.to.bind(this._stage);

    this._stage.to = function(newConfig) {
      animationStage(newConfig);
      setTimeout(() => {
        Object.keys(ng._stage.attrs).forEach(key => {
          if (typeof ng._stage.attrs[key] !== 'function') {
            ng.config[key] = ng._stage.attrs[key];
          }
        });
      }, 200);
    };
    if (this.config) {
      this.config.subscribe(config => {
        this._config = config;
        this.uploadKonva(config);
      });
    }
  }

  private uploadKonva(config) {
    const props = {
      ...config,
      ...createListener(this)
    };
    applyNodeProps(this, props, this.cacheProps);
    this.cacheProps = props;
  }

  ngAfterContentInit() {
  }

  ngOnDestroy() {
    this._stage.destroy();
  }
}
