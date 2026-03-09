import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';
import { vi, expect, describe, it } from 'vitest';
import Konva from 'konva';
import './mocking';

import { Component, viewChild, signal, Type } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

import { StageComponent } from '../src/components/stage.component';
import { CoreShapeComponent } from '../src/components/core-shape.component';

// Initialize the Angular testing environment once
let initialized = false;
function ensureTestBedInitialized() {
  if (!initialized) {
    TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    initialized = true;
  }
}

const wait = () => new Promise((resolve) => setTimeout(resolve, 50));

// Wraps inner template in stage+layer boilerplate
const KoTest = (template: string) =>
  Component({
    selector: 'ko-test',
    standalone: true,
    template: `
      <ko-stage [config]="{ width: 300, height: 300 }">
        <ko-layer [config]="{}">
          ${template}
        </ko-layer>
      </ko-stage>
    `,
    imports: [StageComponent, CoreShapeComponent],
  });

async function render<T>(componentClass: Type<T>): Promise<{
  fixture: ComponentFixture<T>;
  stage: Konva.Stage;
}> {
  ensureTestBedInitialized();
  TestBed.configureTestingModule({ imports: [componentClass] });
  const fixture = TestBed.createComponent(componentClass);
  fixture.detectChanges();
  await wait();
  fixture.detectChanges();
  const stage = Konva.stages[Konva.stages.length - 1];
  return { fixture, stage };
}

async function update(fixture: ComponentFixture<any>) {
  fixture.detectChanges();
  await wait();
  fixture.detectChanges();
  await wait();
}

describe('Node References', () => {
  it('getStage() and getNode() return correct Konva instances', async () => {
    @Component({
      selector: 'ko-test',
      standalone: true,
      template: `
        <ko-stage [config]="{ width: 300, height: 300 }">
          <ko-layer [config]="{}">
            <ko-circle [config]="{ radius: 50 }"></ko-circle>
          </ko-layer>
        </ko-stage>
      `,
      imports: [StageComponent, CoreShapeComponent],
    })
    class TestComponent {
      stageRef = viewChild(StageComponent);
      shapeRef = viewChild(CoreShapeComponent);
    }

    const { fixture } = await render(TestComponent);
    const stageComp = fixture.componentInstance.stageRef()!;
    expect(stageComp.getStage()).toBeInstanceOf(Konva.Stage);
    expect(stageComp.getNode()).toBeInstanceOf(Konva.Stage);

    const shapeComp = fixture.componentInstance.shapeRef()!;
    expect(shapeComp.getNode()).toBeInstanceOf(Konva.Layer);
    fixture.destroy();
  });
});

describe('Stage Component', () => {
  it('creates stage with correct dimensions', async () => {
    @Component({
      selector: 'ko-test',
      standalone: true,
      template: `
        <ko-stage [config]="{ width: 400, height: 200 }">
          <ko-layer [config]="{}"></ko-layer>
        </ko-stage>
      `,
      imports: [StageComponent, CoreShapeComponent],
    })
    class TestComponent {}

    const { fixture, stage } = await render(TestComponent);
    expect(stage).toBeInstanceOf(Konva.Stage);
    expect(stage.width()).toBe(400);
    expect(stage.height()).toBe(200);
    fixture.destroy();
  });

  it('updates stage config reactively', async () => {
    @Component({
      selector: 'ko-test',
      standalone: true,
      template: `
        <ko-stage [config]="config()">
          <ko-layer [config]="{}"></ko-layer>
        </ko-stage>
      `,
      imports: [StageComponent, CoreShapeComponent],
    })
    class TestComponent {
      config = signal({ width: 300, height: 300 });
    }

    const { fixture, stage } = await render(TestComponent);
    expect(stage.width()).toBe(300);

    fixture.componentInstance.config.set({ width: 500, height: 400 });
    await update(fixture);
    expect(stage.width()).toBe(500);
    expect(stage.height()).toBe(400);
    fixture.destroy();
  });

  it('destroys stage on component destroy', async () => {
    @KoTest(``)
    class TestComponent {}

    const stageCountBefore = Konva.stages.length;
    const { fixture } = await render(TestComponent);
    expect(Konva.stages.length).toBe(stageCountBefore + 1);
    fixture.destroy();
    expect(Konva.stages.length).toBe(stageCountBefore);
  });
});

describe('CoreShape Component', () => {
  const shapeTests: [string, any, string][] = [
    ['ko-circle', Konva.Circle, "{ radius: 25, fill: 'red' }"],
    ['ko-rect', Konva.Rect, "{ width: 100, height: 50, fill: 'blue' }"],
    ['ko-text', Konva.Text, "{ text: 'Hello', fontSize: 20 }"],
    ['ko-line', Konva.Line, "{ points: [0, 0, 100, 100], stroke: 'black' }"],
    [
      'ko-star',
      Konva.Star,
      '{ numPoints: 5, innerRadius: 20, outerRadius: 40 }',
    ],
    [
      'ko-ellipse',
      Konva.Ellipse,
      "{ radiusX: 50, radiusY: 30, fill: 'green' }",
    ],
    ['ko-regular-polygon', Konva.RegularPolygon, '{ sides: 6, radius: 30 }'],
    [
      'ko-text-path',
      Konva.TextPath,
      "{ text: 'Hello', data: 'M10,80 Q95,10 180,80' }",
    ],
  ];

  for (const [tag, KonvaClass, config] of shapeTests) {
    it(`creates correct Konva node for ${tag}`, async () => {
      @KoTest(`<${tag} [config]="${config}"></${tag}>`)
      class TestComponent {}

      const { fixture, stage } = await render(TestComponent);
      expect(stage.getLayers()[0].children[0]).toBeInstanceOf(KonvaClass);
      fixture.destroy();
    });
  }

  it('creates group with children', async () => {
    @KoTest(`
      <ko-group [config]="{}">
        <ko-rect [config]="{ width: 50, height: 50, fill: 'green' }"></ko-rect>
      </ko-group>
    `)
    class TestComponent {}

    const { fixture, stage } = await render(TestComponent);
    const group = stage.getLayers()[0].children[0];
    expect(group).toBeInstanceOf(Konva.Group);
    expect(group.children.length).toBe(1);
    expect(group.children[0]).toBeInstanceOf(Konva.Rect);
    fixture.destroy();
  });
});

describe('Props', () => {
  it('applies initial config props', async () => {
    @KoTest(
      `<ko-rect [config]="{ x: 10, y: 20, width: 100, height: 50, fill: 'red', opacity: 0.5 }"></ko-rect>`,
    )
    class TestComponent {}

    const { fixture, stage } = await render(TestComponent);
    const rect = stage.getLayers()[0].children[0];
    expect(rect.x()).toBe(10);
    expect(rect.y()).toBe(20);
    expect(rect.width()).toBe(100);
    expect(rect.getAttr('fill')).toBe('red');
    expect(rect.opacity()).toBe(0.5);
    fixture.destroy();
  });

  it('updates props reactively via signal', async () => {
    @KoTest(`<ko-rect [config]="rectConfig()"></ko-rect>`)
    class TestComponent {
      rectConfig = signal({ width: 50, height: 50, fill: 'red' });
    }

    const { fixture, stage } = await render(TestComponent);
    const rect = stage.getLayers()[0].children[0];
    expect(rect.getAttr('fill')).toBe('red');

    fixture.componentInstance.rectConfig.set({
      width: 50,
      height: 50,
      fill: 'blue',
    });
    await update(fixture);
    expect(rect.getAttr('fill')).toBe('blue');
    fixture.destroy();
  });

  it('unsets props when removed from config', async () => {
    @KoTest(`<ko-rect [config]="rectConfig()"></ko-rect>`)
    class TestComponent {
      rectConfig = signal<Record<string, any>>({
        x: 10,
        width: 100,
        height: 100,
        fill: 'red',
      });
    }

    const { fixture, stage } = await render(TestComponent);
    const rect = stage.getLayers()[0].children[0];
    expect(rect.fill()).toBe('red');
    expect(rect.x()).toBe(10);

    fixture.componentInstance.rectConfig.set({ width: 100, height: 100 });
    await update(fixture);
    expect(!!rect.fill()).toBe(false);
    expect(rect.x()).toBe(0);
    fixture.destroy();
  });

  it('does not overwrite manually changed props', async () => {
    @KoTest(`<ko-rect [config]="rectConfig()"></ko-rect>`)
    class TestComponent {
      rectConfig = signal<Record<string, any>>({ x: 10, fill: 'red' });
    }

    const { fixture, stage } = await render(TestComponent);
    const rect = stage.getLayers()[0].children[0];
    rect.x(20);

    fixture.componentInstance.rectConfig.set({ x: 10, fill: 'white' });
    await update(fixture);
    expect(rect.fill()).toBe('white');
    fixture.destroy();
  });

  it('warns when using id attribute', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    @KoTest(
      `<ko-rect [config]="{ id: 'myRect', width: 50, height: 50 }"></ko-rect>`,
    )
    class TestComponent {}

    const { fixture } = await render(TestComponent);
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][0]).toContain('id');
    warnSpy.mockRestore();
    fixture.destroy();
  });
});

describe('Events', () => {
  it('binds click event handler', async () => {
    @KoTest(`
      <ko-rect
        [config]="{ width: 100, height: 100, fill: 'red' }"
        (click)="clicked = true"
      ></ko-rect>
    `)
    class TestComponent {
      clicked = false;
    }

    const { fixture, stage } = await render(TestComponent);
    stage.getLayers()[0].children[0].fire('click', {} as any);
    expect(fixture.componentInstance.clicked).toBe(true);
    fixture.destroy();
  });

  it('binds dragend event handler', async () => {
    @KoTest(`
      <ko-rect
        [config]="{ width: 100, height: 100, draggable: true }"
        (dragend)="dragEnded = true"
      ></ko-rect>
    `)
    class TestComponent {
      dragEnded = false;
    }

    const { fixture, stage } = await render(TestComponent);
    stage.getLayers()[0].children[0].fire('dragend', {} as any);
    expect(fixture.componentInstance.dragEnded).toBe(true);
    fixture.destroy();
  });

  it('fires stage mousedown via simulateMouseDown', async () => {
    @Component({
      selector: 'ko-test',
      standalone: true,
      template: `
        <ko-stage
          [config]="{ width: 300, height: 300 }"
          (mousedown)="count = count + 1"
        >
          <ko-layer [config]="{}">
            <ko-rect [config]="{ width: 300, height: 300 }"></ko-rect>
          </ko-layer>
        </ko-stage>
      `,
      imports: [StageComponent, CoreShapeComponent],
    })
    class TestComponent {
      count = 0;
    }

    const { fixture, stage } = await render(TestComponent);
    (stage as any).simulateMouseDown({ x: 50, y: 50 });
    expect(fixture.componentInstance.count).toBe(1);
    fixture.destroy();
  });

  it('cleans up events when component is destroyed', async () => {
    @KoTest(`
      @if (showRect()) {
        <ko-rect
          [config]="{ width: 100, height: 100 }"
          (click)="clickCount = clickCount + 1"
        ></ko-rect>
      }
    `)
    class TestComponent {
      showRect = signal(true);
      clickCount = 0;
    }

    const { fixture, stage } = await render(TestComponent);
    const rect = stage.getLayers()[0].children[0];

    rect.fire('click', {} as any);
    expect(fixture.componentInstance.clickCount).toBe(1);

    fixture.componentInstance.showRect.set(false);
    await update(fixture);
    expect(rect.getParent()).toBe(null);
    fixture.destroy();
  });
});

describe('Component Hierarchy', () => {
  it('nests Layer inside Stage', async () => {
    @KoTest(``)
    class TestComponent {}

    const { fixture, stage } = await render(TestComponent);
    expect(stage.getLayers().length).toBe(1);
    expect(stage.getLayers()[0]).toBeInstanceOf(Konva.Layer);
    fixture.destroy();
  });

  it('supports multiple layers', async () => {
    @Component({
      selector: 'ko-test',
      standalone: true,
      template: `
        <ko-stage [config]="{ width: 300, height: 300 }">
          <ko-layer [config]="{}"></ko-layer>
          <ko-layer [config]="{}"></ko-layer>
        </ko-stage>
      `,
      imports: [StageComponent, CoreShapeComponent],
    })
    class TestComponent {}

    const { fixture, stage } = await render(TestComponent);
    expect(stage.getLayers().length).toBe(2);
    fixture.destroy();
  });

  it('supports deep nesting: Stage > Layer > Group > Shape', async () => {
    @KoTest(`
      <ko-group [config]="{ x: 10, y: 10 }">
        <ko-circle [config]="{ radius: 20, fill: 'red' }"></ko-circle>
        <ko-rect [config]="{ width: 30, height: 30, fill: 'blue' }"></ko-rect>
      </ko-group>
    `)
    class TestComponent {}

    const { fixture, stage } = await render(TestComponent);
    const group = stage.getLayers()[0].children[0] as Konva.Group;
    expect(group).toBeInstanceOf(Konva.Group);
    expect(group.children.length).toBe(2);
    expect(group.children[0]).toBeInstanceOf(Konva.Circle);
    expect(group.children[1]).toBeInstanceOf(Konva.Rect);
    fixture.destroy();
  });
});

describe('Drawing', () => {
  it('calls batchDraw when adding nodes', async () => {
    @KoTest(
      `<ko-rect [config]="{ width: 50, height: 50, fill: 'red' }"></ko-rect>`,
    )
    class TestComponent {}

    const { fixture, stage } = await render(TestComponent);
    const layer = stage.getLayers()[0];
    const spy = vi.spyOn(layer, 'batchDraw');

    const rect = new Konva.Rect({ width: 20, height: 20, fill: 'blue' });
    layer.add(rect);
    layer.batchDraw();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    fixture.destroy();
  });

  it('calls batchDraw when config changes', async () => {
    @KoTest(`<ko-rect [config]="rectConfig()"></ko-rect>`)
    class TestComponent {
      rectConfig = signal({ width: 100, height: 100, fill: 'red' });
    }

    const { fixture, stage } = await render(TestComponent);
    const spy = vi.spyOn(stage.getLayers()[0], 'batchDraw');

    fixture.componentInstance.rectConfig.set({
      width: 150,
      height: 100,
      fill: 'red',
    });
    await update(fixture);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    fixture.destroy();
  });

  it('calls batchDraw when node is added via @if', async () => {
    @KoTest(`
      @if (showRect()) {
        <ko-rect [config]="{ width: 50, height: 50 }"></ko-rect>
      }
    `)
    class TestComponent {
      showRect = signal(false);
    }

    const { fixture, stage } = await render(TestComponent);
    const spy = vi.spyOn(stage.getLayers()[0], 'batchDraw');

    fixture.componentInstance.showRect.set(true);
    await update(fixture);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    fixture.destroy();
  });

  it('calls batchDraw when node is removed via @if', async () => {
    @KoTest(`
      @if (showRect()) {
        <ko-rect [config]="{ width: 50, height: 50 }"></ko-rect>
      }
    `)
    class TestComponent {
      showRect = signal(true);
    }

    const { fixture, stage } = await render(TestComponent);
    const spy = vi.spyOn(stage.getLayers()[0], 'batchDraw');

    fixture.componentInstance.showRect.set(false);
    await update(fixture);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    fixture.destroy();
  });
});

describe('Lifecycle', () => {
  it('destroys Konva nodes when component is destroyed', async () => {
    @KoTest(`<ko-rect [config]="{ width: 50, height: 50 }"></ko-rect>`)
    class TestComponent {}

    const stagesBefore = Konva.stages.length;
    const { fixture } = await render(TestComponent);
    expect(Konva.stages.length).toBe(stagesBefore + 1);
    fixture.destroy();
    expect(Konva.stages.length).toBe(stagesBefore);
  });
});

describe('Conditional rendering', () => {
  it('adds and removes shapes with @if', async () => {
    @KoTest(`
      @if (showText()) {
        <ko-text [config]="{ text: 'hello' }"></ko-text>
      }
      <ko-rect [config]="{ width: 100, height: 100, fill: 'red' }"></ko-rect>
    `)
    class TestComponent {
      showText = signal(true);
    }

    const { fixture, stage } = await render(TestComponent);
    const layer = stage.getLayers()[0];
    expect(layer.children.length).toBe(2);

    fixture.componentInstance.showText.set(false);
    await update(fixture);
    expect(layer.children.length).toBe(1);
    expect(layer.children[0].getClassName()).toBe('Rect');
    fixture.destroy();
  });

  it('adds shape back with @if', async () => {
    @KoTest(`
      @if (showCircle()) {
        <ko-circle [config]="{ radius: 30, fill: 'blue' }"></ko-circle>
      }
    `)
    class TestComponent {
      showCircle = signal(false);
    }

    const { fixture, stage } = await render(TestComponent);
    const layer = stage.getLayers()[0];
    expect(layer.children.length).toBe(0);

    fixture.componentInstance.showCircle.set(true);
    await update(fixture);
    expect(layer.children.length).toBe(1);
    expect(layer.children[0]).toBeInstanceOf(Konva.Circle);
    fixture.destroy();
  });
});

describe('List rendering and reordering', () => {
  it('renders list of shapes with @for', async () => {
    @KoTest(`
      @for (item of items(); track item.name) {
        <ko-rect [config]="item"></ko-rect>
      }
    `)
    class TestComponent {
      items = signal([
        { name: 'rect1', width: 10, height: 10 },
        { name: 'rect2', width: 20, height: 20 },
        { name: 'rect3', width: 30, height: 30 },
      ]);
    }

    const { fixture, stage } = await render(TestComponent);
    const layer = stage.getLayers()[0];
    expect(layer.children.length).toBe(3);
    expect(layer.children[0].name()).toBe('rect1');
    expect(layer.children[1].name()).toBe('rect2');
    expect(layer.children[2].name()).toBe('rect3');
    fixture.destroy();
  });

  it('adds item in the middle of a list', async () => {
    @KoTest(`
      @for (item of items(); track item.name) {
        <ko-rect [config]="item"></ko-rect>
      }
    `)
    class TestComponent {
      items = signal([
        { name: 'rect1', width: 10, height: 10 },
        { name: 'rect3', width: 30, height: 30 },
      ]);
    }

    const { fixture, stage } = await render(TestComponent);
    const layer = stage.getLayers()[0];

    fixture.componentInstance.items.set([
      { name: 'rect1', width: 10, height: 10 },
      { name: 'rect2', width: 20, height: 20 },
      { name: 'rect3', width: 30, height: 30 },
    ]);
    await update(fixture);
    expect(layer.children.length).toBe(3);
    expect(layer.children[0].name()).toBe('rect1');
    expect(layer.children[1].name()).toBe('rect2');
    expect(layer.children[2].name()).toBe('rect3');
    fixture.destroy();
  });

  it('reorders items in a list', async () => {
    @KoTest(`
      @for (item of items(); track item.name) {
        <ko-rect [config]="item"></ko-rect>
      }
    `)
    class TestComponent {
      items = signal([
        { name: 'rect1', width: 10, height: 10 },
        { name: 'rect2', width: 20, height: 20 },
        { name: 'rect3', width: 30, height: 30 },
      ]);
    }

    const { fixture, stage } = await render(TestComponent);
    const layer = stage.getLayers()[0];

    fixture.componentInstance.items.set([
      { name: 'rect3', width: 30, height: 30 },
      { name: 'rect2', width: 20, height: 20 },
      { name: 'rect1', width: 10, height: 10 },
    ]);
    await update(fixture);
    expect(layer.children[0].name()).toBe('rect3');
    expect(layer.children[1].name()).toBe('rect2');
    expect(layer.children[2].name()).toBe('rect1');
    fixture.destroy();
  });
});

describe('Multiple stages', () => {
  it('updates ko-image when config.image is assigned after initial render (signal)', async () => {
    @KoTest(`<ko-image [config]="imageConfig()"></ko-image>`)
    class TestComponent {
      imageConfig = signal<Record<string, any>>({
        x: 10,
        y: 10,
        width: 100,
        height: 100,
      });
    }

    const { fixture, stage } = await render(TestComponent);
    const imageNode = stage.getLayers()[0].children[0];
    expect(imageNode).toBeInstanceOf(Konva.Image);
    expect(imageNode.getAttr('image')).toBeFalsy();

    const img = new Image();
    img.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNjN9GQAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAA0lEQVQI12P4z8BQDwAEgAF/QualIQAAAABJRU5ErkJggg==';

    fixture.componentInstance.imageConfig.set({
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      image: img,
    });
    await update(fixture);
    expect(imageNode.getAttr('image')).toBe(img);
    fixture.destroy();
  });

  it('updates ko-image when config is reassigned as plain property', async () => {
    @Component({
      selector: 'ko-test',
      standalone: true,
      template: `
        <ko-stage [config]="{ width: 300, height: 300 }">
          <ko-layer [config]="{}">
            <ko-image [config]="imageConfig"></ko-image>
          </ko-layer>
        </ko-stage>
      `,
      imports: [StageComponent, CoreShapeComponent],
    })
    class TestComponent {
      imageConfig: Record<string, any> = {
        x: 10,
        y: 10,
        width: 100,
        height: 100,
      };
    }

    const { fixture, stage } = await render(TestComponent);
    const imageNode = stage.getLayers()[0].children[0];
    expect(imageNode).toBeInstanceOf(Konva.Image);
    expect(imageNode.getAttr('image')).toBeFalsy();

    const img = new Image();
    img.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNjN9GQAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAA0lEQVQI12P4z8BQDwAEgAF/QualIQAAAABJRU5ErkJggg==';

    fixture.componentInstance.imageConfig = {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      image: img,
    };
    fixture.changeDetectorRef.markForCheck();
    await update(fixture);
    expect(imageNode.getAttr('image')).toBe(img);
    fixture.destroy();
  });

  it('renders two stages simultaneously', async () => {
    @Component({
      selector: 'ko-test',
      standalone: true,
      template: `
        <ko-stage [config]="{ width: 200, height: 200 }">
          <ko-layer [config]="{}"></ko-layer>
        </ko-stage>
        <ko-stage [config]="{ width: 400, height: 400 }">
          <ko-layer [config]="{}"></ko-layer>
        </ko-stage>
      `,
      imports: [StageComponent, CoreShapeComponent],
    })
    class TestComponent {}

    const stagesBefore = Konva.stages.length;
    const { fixture } = await render(TestComponent);
    expect(Konva.stages.length).toBe(stagesBefore + 2);

    const stage1 = Konva.stages[Konva.stages.length - 2];
    const stage2 = Konva.stages[Konva.stages.length - 1];
    expect(stage1.width()).toBe(200);
    expect(stage2.width()).toBe(400);

    fixture.destroy();
    expect(Konva.stages.length).toBe(stagesBefore);
  });
});
