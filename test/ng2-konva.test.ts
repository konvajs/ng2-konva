import '@angular/compiler';
import { vi, expect, describe, it } from 'vitest';
import Konva from 'konva';
import './mocking';

import {
  Component,
  viewChild,
  signal,
  Type,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';
import { createApplication } from '@angular/platform-browser';

import { StageComponent } from '../src/components/stage.component';
import { CoreShapeComponent } from '../src/components/core-shape.component';

const wait = () => new Promise((resolve) => setTimeout(resolve, 50));

// Wraps inner template in stage+layer boilerplate
let testId = 0;
const KoTest = (template: string) =>
  Component({
    selector: `ko-test-${++testId}`,
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
  component: T;
  stage: Konva.Stage;
  destroy: () => void;
  update: () => Promise<void>;
}> {
  const host = document.createElement('div');
  document.body.appendChild(host);

  const appRef = await createApplication();
  const ref = createComponent(componentClass, {
    hostElement: host,
    environmentInjector: appRef.injector as EnvironmentInjector,
  });
  appRef.attachView(ref.hostView);
  await appRef.whenStable();

  const stage = Konva.stages[Konva.stages.length - 1];

  const updateFn = async () => {
    await appRef.whenStable();
  };

  const destroy = () => {
    ref.destroy();
    appRef.destroy();
    host.remove();
  };

  return { component: ref.instance, stage, destroy, update: updateFn };
}

describe('Node References', () => {
  it('getStage() and getNode() return correct Konva instances', async () => {
    @Component({
      selector: `ko-test-${++testId}`,
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

    const { component, destroy } = await render(TestComponent);
    const stageComp = component.stageRef()!;
    expect(stageComp.getStage()).toBeInstanceOf(Konva.Stage);
    expect(stageComp.getNode()).toBeInstanceOf(Konva.Stage);

    const shapeComp = component.shapeRef()!;
    expect(shapeComp.getNode()).toBeInstanceOf(Konva.Layer);
    destroy();
  });
});

describe('Stage Component', () => {
  it('creates stage with correct dimensions', async () => {
    @Component({
      selector: `ko-test-${++testId}`,
      standalone: true,
      template: `
        <ko-stage [config]="{ width: 400, height: 200 }">
          <ko-layer [config]="{}"></ko-layer>
        </ko-stage>
      `,
      imports: [StageComponent, CoreShapeComponent],
    })
    class TestComponent {}

    const { stage, destroy } = await render(TestComponent);
    expect(stage).toBeInstanceOf(Konva.Stage);
    expect(stage.width()).toBe(400);
    expect(stage.height()).toBe(200);
    destroy();
  });

  it('updates stage config reactively', async () => {
    @Component({
      selector: `ko-test-${++testId}`,
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

    const { component, stage, destroy, update } = await render(TestComponent);
    expect(stage.width()).toBe(300);

    component.config.set({ width: 500, height: 400 });
    await update();
    expect(stage.width()).toBe(500);
    expect(stage.height()).toBe(400);
    destroy();
  });

  it('destroys stage on component destroy', async () => {
    @KoTest(``)
    class TestComponent {}

    const stageCountBefore = Konva.stages.length;
    const { destroy } = await render(TestComponent);
    expect(Konva.stages.length).toBe(stageCountBefore + 1);
    destroy();
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
    ['ko-regular-polygon', Konva.RegularPolygon, '{ sides: 6, radius: 30, x: 50, y: 50 }'],
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

      const { stage, destroy } = await render(TestComponent);
      expect(stage.getLayers()[0].children[0]).toBeInstanceOf(KonvaClass);
      destroy();
    });
  }

  it('creates group with children', async () => {
    @KoTest(`
      <ko-group [config]="{}">
        <ko-rect [config]="{ width: 50, height: 50, fill: 'green' }"></ko-rect>
      </ko-group>
    `)
    class TestComponent {}

    const { stage, destroy } = await render(TestComponent);
    const group = stage.getLayers()[0].children[0];
    expect(group).toBeInstanceOf(Konva.Group);
    expect(group.children.length).toBe(1);
    expect(group.children[0]).toBeInstanceOf(Konva.Rect);
    destroy();
  });
});

describe('Props', () => {
  it('applies initial config props', async () => {
    @KoTest(
      `<ko-rect [config]="{ x: 10, y: 20, width: 100, height: 50, fill: 'red', opacity: 0.5 }"></ko-rect>`,
    )
    class TestComponent {}

    const { stage, destroy } = await render(TestComponent);
    const rect = stage.getLayers()[0].children[0];
    expect(rect.x()).toBe(10);
    expect(rect.y()).toBe(20);
    expect(rect.width()).toBe(100);
    expect(rect.getAttr('fill')).toBe('red');
    expect(rect.opacity()).toBe(0.5);
    destroy();
  });

  it('updates props reactively via signal', async () => {
    @KoTest(`<ko-rect [config]="rectConfig()"></ko-rect>`)
    class TestComponent {
      rectConfig = signal({ width: 50, height: 50, fill: 'red' });
    }

    const { component, stage, destroy, update } = await render(TestComponent);
    const rect = stage.getLayers()[0].children[0];
    expect(rect.getAttr('fill')).toBe('red');

    component.rectConfig.set({ width: 50, height: 50, fill: 'blue' });
    await update();
    expect(rect.getAttr('fill')).toBe('blue');
    destroy();
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

    const { component, stage, destroy, update } = await render(TestComponent);
    const rect = stage.getLayers()[0].children[0];
    expect(rect.fill()).toBe('red');
    expect(rect.x()).toBe(10);

    component.rectConfig.set({ width: 100, height: 100 });
    await update();
    expect(!!rect.fill()).toBe(false);
    expect(rect.x()).toBe(0);
    destroy();
  });

  it('does not overwrite manually changed props', async () => {
    @KoTest(`<ko-rect [config]="rectConfig()"></ko-rect>`)
    class TestComponent {
      rectConfig = signal<Record<string, any>>({ x: 10, fill: 'red' });
    }

    const { component, stage, destroy, update } = await render(TestComponent);
    const rect = stage.getLayers()[0].children[0];
    rect.x(20);

    component.rectConfig.set({ x: 10, fill: 'white' });
    await update();
    expect(rect.fill()).toBe('white');
    destroy();
  });

  it('warns when using id attribute', async () => {
    @KoTest(
      `<ko-rect [config]="{ id: 'myRect', width: 50, height: 50 }"></ko-rect>`,
    )
    class TestComponent {}

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { destroy } = await render(TestComponent);
    const idWarning = warnSpy.mock.calls.find((call) =>
      String(call[0]).includes('id'),
    );
    expect(idWarning).toBeTruthy();
    warnSpy.mockRestore();
    destroy();
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

    const { component, stage, destroy } = await render(TestComponent);
    stage.getLayers()[0].children[0].fire('click', {} as any);
    expect(component.clicked).toBe(true);
    destroy();
  });

  it('registers events even without [config] binding', async () => {
    @KoTest(`
      <ko-transformer
        (transformstart)="events.push('start')"
        (transform)="events.push('transform')"
        (transformend)="events.push('end')"
      ></ko-transformer>
    `)
    class TestComponent {
      events: string[] = [];
    }

    const { component, stage, destroy } = await render(TestComponent);
    const transformer = stage.getLayers()[0].children[0];
    expect(transformer.getClassName()).toBe('Transformer');

    transformer.fire('transformstart', {} as any);
    transformer.fire('transform', {} as any);
    transformer.fire('transformend', {} as any);

    expect(component.events).toEqual(['start', 'transform', 'end']);
    destroy();
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

    const { component, stage, destroy } = await render(TestComponent);
    stage.getLayers()[0].children[0].fire('dragend', {} as any);
    expect(component.dragEnded).toBe(true);
    destroy();
  });

  it('fires stage mousedown via simulateMouseDown', async () => {
    @Component({
      selector: `ko-test-${++testId}`,
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

    const { component, stage, destroy } = await render(TestComponent);
    (stage as any).simulateMouseDown({ x: 50, y: 50 });
    expect(component.count).toBe(1);
    destroy();
  });

  it('does not fire stage click twice (no native DOM duplicate)', async () => {
    @Component({
      selector: `ko-test-${++testId}`,
      standalone: true,
      template: `
        <ko-stage
          [config]="{ width: 300, height: 300 }"
          (click)="events.push($event)"
        >
          <ko-layer [config]="{}">
            <ko-rect [config]="{ width: 300, height: 300 }"></ko-rect>
          </ko-layer>
        </ko-stage>
      `,
      imports: [StageComponent, CoreShapeComponent],
    })
    class TestComponent {
      events: any[] = [];
    }

    const { component, stage, destroy } = await render(TestComponent);

    // Simulate a full real browser click sequence on the canvas:
    // mousedown → mouseup → click (all bubble to host)
    const canvas = stage.container().querySelector('canvas')!;
    const rect = canvas.getBoundingClientRect();
    const opts = {
      bubbles: true,
      clientX: rect.left + 50,
      clientY: rect.top + 50,
    };
    canvas.dispatchEvent(new MouseEvent('mousedown', opts));
    canvas.dispatchEvent(new MouseEvent('mouseup', opts));
    canvas.dispatchEvent(new MouseEvent('click', opts));
    await wait();

    // Should be exactly 1, not 2
    expect(component.events.length).toBe(1);
    destroy();
  });

  it('does not fire stage events twice after config update', async () => {
    @Component({
      selector: `ko-test-${++testId}`,
      standalone: true,
      template: `
        <ko-stage [config]="stageConfig()" (mousedown)="count = count + 1">
          <ko-layer [config]="{}">
            <ko-rect [config]="{ width: 300, height: 300 }"></ko-rect>
          </ko-layer>
        </ko-stage>
      `,
      imports: [StageComponent, CoreShapeComponent],
    })
    class TestComponent {
      stageConfig = signal({ width: 300, height: 300 });
      count = 0;
    }

    const { component, stage, destroy, update } = await render(TestComponent);
    (stage as any).simulateMouseDown({ x: 50, y: 50 });
    expect(component.count).toBe(1);

    // Update config — this should not cause duplicate listeners
    component.stageConfig.set({ width: 400, height: 400 });
    await update();

    component.count = 0;
    (stage as any).simulateMouseDown({ x: 50, y: 50 });
    expect(component.count).toBe(1);
    destroy();
  });

  it('does not fire shape events twice after config update', async () => {
    @KoTest(`
      <ko-rect
        [config]="rectConfig()"
        (click)="count = count + 1"
      ></ko-rect>
    `)
    class TestComponent {
      rectConfig = signal({ width: 100, height: 100, fill: 'red' });
      count = 0;
    }

    const { component, stage, destroy, update } = await render(TestComponent);
    const rect = stage.getLayers()[0].children[0];
    rect.fire('click', {} as any);
    expect(component.count).toBe(1);

    // Update config — this should not cause duplicate listeners
    component.rectConfig.set({ width: 200, height: 200, fill: 'blue' });
    await update();

    component.count = 0;
    rect.fire('click', {} as any);
    expect(component.count).toBe(1);
    destroy();
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

    const { component, stage, destroy, update } = await render(TestComponent);
    const rect = stage.getLayers()[0].children[0];

    rect.fire('click', {} as any);
    expect(component.clickCount).toBe(1);

    component.showRect.set(false);
    await update();
    expect(rect.getParent()).toBe(null);
    destroy();
  });
});

describe('Component Hierarchy', () => {
  it('nests Layer inside Stage', async () => {
    @KoTest(``)
    class TestComponent {}

    const { stage, destroy } = await render(TestComponent);
    expect(stage.getLayers().length).toBe(1);
    expect(stage.getLayers()[0]).toBeInstanceOf(Konva.Layer);
    destroy();
  });

  it('supports multiple layers', async () => {
    @Component({
      selector: `ko-test-${++testId}`,
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

    const { stage, destroy } = await render(TestComponent);
    expect(stage.getLayers().length).toBe(2);
    destroy();
  });

  it('supports deep nesting: Stage > Layer > Group > Shape', async () => {
    @KoTest(`
      <ko-group [config]="{ x: 10, y: 10 }">
        <ko-circle [config]="{ radius: 20, fill: 'red' }"></ko-circle>
        <ko-rect [config]="{ width: 30, height: 30, fill: 'blue' }"></ko-rect>
      </ko-group>
    `)
    class TestComponent {}

    const { stage, destroy } = await render(TestComponent);
    const group = stage.getLayers()[0].children[0] as Konva.Group;
    expect(group).toBeInstanceOf(Konva.Group);
    expect(group.children.length).toBe(2);
    expect(group.children[0]).toBeInstanceOf(Konva.Circle);
    expect(group.children[1]).toBeInstanceOf(Konva.Rect);
    destroy();
  });
});

describe('Wrapper components', () => {
  it('shapes inside a wrapper component are added to the layer', async () => {
    @Component({
      selector: `ko-onoff-${++testId}`,
      standalone: true,
      imports: [CoreShapeComponent],
      template: `
        <ko-group [config]="{ x: 100, y: 100 }">
          <ko-rect [config]="{ width: 100, height: 100, fill: 'red' }"></ko-rect>
        </ko-group>
      `,
    })
    class OnOffComponent {}

    @Component({
      selector: `ko-test-${++testId}`,
      standalone: true,
      template: `
        <ko-stage [config]="{ width: 300, height: 300 }">
          <ko-layer [config]="{}">
            <ko-onoff-${testId - 1}></ko-onoff-${testId - 1}>
          </ko-layer>
        </ko-stage>
      `,
      imports: [StageComponent, CoreShapeComponent, OnOffComponent],
    })
    class TestComponent {}

    const { stage, destroy } = await render(TestComponent);
    const layer = stage.getLayers()[0];
    // The group from the wrapper component should be in the layer
    expect(layer.children.length).toBe(1);
    expect(layer.children[0]).toBeInstanceOf(Konva.Group);
    destroy();
  });
});

describe('Drawing', () => {
  it('calls batchDraw when adding nodes', async () => {
    @KoTest(
      `<ko-rect [config]="{ width: 50, height: 50, fill: 'red' }"></ko-rect>`,
    )
    class TestComponent {}

    const { stage, destroy } = await render(TestComponent);
    const layer = stage.getLayers()[0];
    const spy = vi.spyOn(layer, 'batchDraw');

    const rect = new Konva.Rect({ width: 20, height: 20, fill: 'blue' });
    layer.add(rect);
    layer.batchDraw();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    destroy();
  });

  it('calls batchDraw when config changes', async () => {
    @KoTest(`<ko-rect [config]="rectConfig()"></ko-rect>`)
    class TestComponent {
      rectConfig = signal({ width: 100, height: 100, fill: 'red' });
    }

    const { component, stage, destroy, update } = await render(TestComponent);
    const spy = vi.spyOn(stage.getLayers()[0], 'batchDraw');

    component.rectConfig.set({ width: 150, height: 100, fill: 'red' });
    await update();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    destroy();
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

    const { component, stage, destroy, update } = await render(TestComponent);
    const spy = vi.spyOn(stage.getLayers()[0], 'batchDraw');

    component.showRect.set(true);
    await update();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    destroy();
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

    const { component, stage, destroy, update } = await render(TestComponent);
    const spy = vi.spyOn(stage.getLayers()[0], 'batchDraw');

    component.showRect.set(false);
    await update();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    destroy();
  });
});

describe('Lifecycle', () => {
  it('destroys Konva nodes when component is destroyed', async () => {
    @KoTest(`<ko-rect [config]="{ width: 50, height: 50 }"></ko-rect>`)
    class TestComponent {}

    const stagesBefore = Konva.stages.length;
    const { destroy } = await render(TestComponent);
    expect(Konva.stages.length).toBe(stagesBefore + 1);
    destroy();
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

    const { component, stage, destroy, update } = await render(TestComponent);
    const layer = stage.getLayers()[0];
    expect(layer.children.length).toBe(2);

    component.showText.set(false);
    await update();
    expect(layer.children.length).toBe(1);
    expect(layer.children[0].getClassName()).toBe('Rect');
    destroy();
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

    const { component, stage, destroy, update } = await render(TestComponent);
    const layer = stage.getLayers()[0];
    expect(layer.children.length).toBe(0);

    component.showCircle.set(true);
    await update();
    expect(layer.children.length).toBe(1);
    expect(layer.children[0]).toBeInstanceOf(Konva.Circle);
    destroy();
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

    const { stage, destroy } = await render(TestComponent);
    const layer = stage.getLayers()[0];
    expect(layer.children.length).toBe(3);
    expect(layer.children[0].name()).toBe('rect1');
    expect(layer.children[1].name()).toBe('rect2');
    expect(layer.children[2].name()).toBe('rect3');
    destroy();
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

    const { component, stage, destroy, update } = await render(TestComponent);
    const layer = stage.getLayers()[0];

    component.items.set([
      { name: 'rect1', width: 10, height: 10 },
      { name: 'rect2', width: 20, height: 20 },
      { name: 'rect3', width: 30, height: 30 },
    ]);
    await update();
    await wait();
    expect(layer.children.length).toBe(3);
    // New item (rect2) is appended since @for inserts new views
    expect(layer.children.map((c: any) => c.name()).sort()).toEqual(['rect1', 'rect2', 'rect3']);
    destroy();
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

    const { component, stage, destroy, update } = await render(TestComponent);
    const layer = stage.getLayers()[0];

    component.items.set([
      { name: 'rect3', width: 30, height: 30 },
      { name: 'rect2', width: 20, height: 20 },
      { name: 'rect1', width: 10, height: 10 },
    ]);
    await update();
    await wait();
    // All items are still present (reorder doesn't lose nodes)
    expect(layer.children.length).toBe(3);
    expect(layer.children.map((c: any) => c.name()).sort()).toEqual(['rect1', 'rect2', 'rect3']);
    destroy();
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

    const { component, stage, destroy, update } = await render(TestComponent);
    const imageNode = stage.getLayers()[0].children[0];
    expect(imageNode).toBeInstanceOf(Konva.Image);
    expect(imageNode.getAttr('image')).toBeFalsy();

    const img = new Image();
    img.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNjN9GQAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAA0lEQVQI12P4z8BQDwAEgAF/QualIQAAAABJRU5ErkJggg==';

    component.imageConfig.set({
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      image: img,
    });
    await update();
    expect(imageNode.getAttr('image')).toBe(img);
    destroy();
  });

  it('renders two stages simultaneously', async () => {
    @Component({
      selector: `ko-test-${++testId}`,
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
    const { destroy } = await render(TestComponent);
    expect(Konva.stages.length).toBe(stagesBefore + 2);

    const stage1 = Konva.stages[Konva.stages.length - 2];
    const stage2 = Konva.stages[Konva.stages.length - 1];
    expect(stage1.width()).toBe(200);
    expect(stage2.width()).toBe(400);

    destroy();
    expect(Konva.stages.length).toBe(stagesBefore);
  });
});

describe('DOM Structure', () => {
  it('ko-* elements stay connected in DOM with no extra wrapper divs', async () => {
    @KoTest(`<ko-rect [config]="{ fill: 'red', width: 50, height: 50 }"></ko-rect>`)
    class TestComponent {}

    const { destroy } = await render(TestComponent);

    const koStage = document.querySelector('ko-stage')!;

    // Angular host elements should stay connected, not wiped by Konva
    const koLayer = koStage.querySelector('ko-layer');
    const koRect = koStage.querySelector('ko-rect');
    expect(koLayer).toBeTruthy();
    expect(koRect).toBeTruthy();

    // No extra wrapper divs inside ko-layer or ko-rect
    expect(koLayer!.querySelector(':scope > div')).toBeNull();
    expect(koRect!.querySelector(':scope > div')).toBeNull();

    destroy();
  });
});
