import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CoreShapeComponent, StageComponent } from 'ng2-konva';
import { StageConfig } from 'konva/lib/Stage';
import { Rect, RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { Transformer } from 'konva/lib/shapes/Transformer';

@Component({
  selector: 'app-transform-example',
  template: `
    <br />
    <section>
      <ko-stage [config]="configStage">
        <ko-layer>
          <ko-rect
            [config]="configRect"
            (transformstart)="handleTransformStart()"
            (transform)="handleTransform()"
            (transformend)="handleTransformEnd()"
            #rect
          ></ko-rect>
          <ko-text [config]="configText"></ko-text>
          <ko-transformer #transformer></ko-transformer>
        </ko-layer>
      </ko-stage>
      <br />
    </section>
  `,
  standalone: true,
  imports: [CoreShapeComponent, StageComponent],
})
export class TransformExampleComponent implements AfterViewInit {
  @ViewChild('rect') rect: CoreShapeComponent;
  @ViewChild('transformer') transformer: CoreShapeComponent;

  public configStage: Partial<StageConfig> = {
    width: 500,
    height: 400,
  };

  public configRect: RectConfig = {
    width: 100,
    height: 100,
    x: 200,
    y: 150,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
    name: 'rect',
    draggable: true,
  };

  public configText: TextConfig = {
    x: 10,
    y: 10,
    fontFamily: 'Calibri',
    fontSize: 24,
    text: '',
    fill: 'black',
  };

  private initialSize = {
    width: 100,
    height: 100,
  };

  ngAfterViewInit(): void {
    const rect = this.rect.getStage() as Rect;
    const transformer = this.transformer.getStage() as Transformer;
    transformer.nodes([rect]);
  }

  handleTransformStart(): void {
    const rect = this.transformer.getStage();
    this.initialSize = {
      width: Math.round(rect.width()),
      height: Math.round(rect.height()),
    };
    this.writeMessage(
      `Initial: ${this.initialSize.width}x${this.initialSize.height}`
    );
  }

  handleTransform(): void {
    const rect = this.transformer.getStage();

    const currentWidth = Math.round(rect.width());
    const currentHeight = Math.round(rect.height());

    this.writeMessage(
      `Initial: ${this.initialSize.width}x${this.initialSize.height}
Current: ${currentWidth}x${currentHeight}`
    );
  }

  handleTransformEnd(): void {
    const rect = this.transformer.getStage();

    const currentWidth = Math.round(rect.width());
    const currentHeight = Math.round(rect.height());

    this.writeMessage(`Current: ${currentWidth}x${currentHeight}`);
  }

  writeMessage(message: string): void {
    this.configText = { ...this.configText, text: message };
  }
}
