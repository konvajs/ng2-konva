### Shape types
Core shapes are: ko-stage, ko-layer, ko-rect, ko-circle, ko-ellipse, ko-line, ko-image, ko-text, ko-text-path, ko-star, ko-label, SVG Path, ko-regular-polygon.
Also you can create custom shape.

All `ng2-konva` components correspond to `Konva` components of the same name with the prefix 'ko-'. All the parameters available for `Konva` objects can add as `config` in the prop as Observable for corresponding `ng2-konva` components.

### Properties

**Note**: For more information about possible options please refer to original [Konva Overview](http://konvajs.github.io/docs/overview.html) documentation

- `config` (`Observable<any>`) -  All the parameters available for Konva objects

### Methods

- `getConfig`: Getting config props
- `getStage`: Getting reference to Konva objects. Returns — Konva object

### Events

All events returns two params, the angular component and the event

- `click`
- `dblclick`
- `mouseover`
- `tap`
- `dbltap`
- `touchstart`
- `scaleXChange`
- `fillChange`
- `dragstart`
- `dragmove`
- `dragend`

