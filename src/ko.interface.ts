import { Component} from '@angular/core';
import { Observable } from 'rxjs/Observable';

export interface KonvaComponent extends Component {
    getStage: Function;
    config: Observable<any>;
};
