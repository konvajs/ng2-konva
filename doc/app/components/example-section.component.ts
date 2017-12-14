import { Component, Input } from '@angular/core';

@Component({
  selector: 'example-section',
  template: `
  <section id="{{id}}" style="padding-top: 50px;">
    <div class="row">
        <div class="col-md-12">
        <h4>{{heading}}</h4>
        </div>
    </div>
    <div class="card card-block panel panel-default panel-body">

        <div class="row">
        <div class="col-md-12">
            <ng-content></ng-content>
        </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card card-block panel panel-default panel-body">
                <pre class="prettyprint linenums lang-js">{{ts}}</pre>
            </div>
        </div>
    </div>
  </section>
  `
})
export class ExampleSectionComponent {
  @Input() public ts: string;
  @Input() public heading: string;
  @Input() public id: string;
}
