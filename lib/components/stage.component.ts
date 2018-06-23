import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  ElementRef,
  ContentChildren,
  QueryList,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CoreShapeComponent as CoreShape } from './core-shape.component';
import { Observable } from 'rxjs';
import { updatePicture, createListener, applyNodeProps } from '../utils/index';
import { KonvaComponent } from '../ko.interface';

declare const Konva: any;

@Component({
  selector: 'ko-stage',
  template: `<div><ng-content></ng-content>{{config}}</div>`
})
export class StageComponent
  implements KonvaComponent, AfterContentInit, OnInit, OnDestroy {
  @ContentChildren(CoreShape) shapes = new QueryList<CoreShape>();
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

  private _stage;
  private _config;
  private cacheProps: any = {};

  public getStage() {
    return this._stage || {};
  }

  public getConfig() {
    return this._config || {};
  }

  constructor(private elementRef: ElementRef) {}

  private uploadKonva(config) {
    const props = {
      ...config,
      ...createListener(this)
    };
    applyNodeProps(this, props, this.cacheProps);
    this.cacheProps = props;
  }

  ngOnInit() {
    const nodeContainer = this.elementRef.nativeElement;
    this.config.subscribe(config => {
      this._config = config;
      if (!this._stage) {
        this._stage = new Konva.Stage({
          width: config.width,
          height: config.height,
          container: nodeContainer
        });
        this.uploadKonva(config);
      } else {
        this.uploadKonva(config);
      }
    });
  }

  ngAfterContentInit() {
    this.shapes.forEach((item: CoreShape) => {
      this._stage.add(item.getStage());
      updatePicture(this._stage);
    });
  }

  ngOnDestroy() {
    this._stage.destroy();
  }
}
