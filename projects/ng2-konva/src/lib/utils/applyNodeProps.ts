// adapted FROM: https://github.com/lavrton/react-konva/blob/master/src/react-konva-fiber.js

import updatePicture from './updatePicture';
import { KonvaComponent } from 'ng2-konva';

declare const Image: any;

export default function applyNodeProps(
  component: KonvaComponent,
  props = {},
  oldProps = {}
): void {
  if ('id' in props) {
    const message = `ng2-konva: You are using "id" attribute for Konva node. In some very rare cases it may produce bugs. Currently we recommend not to use it and use "name" attribute instead.`;
    console.warn(message);
  }

  const instance = component.getStage();
  const updatedProps = {};
  let hasUpdates = false;

  Object.keys(oldProps).forEach((key) => {
    const isEvent = key.slice(0, 2) === 'on';
    const propChanged = oldProps[key] !== props[key];
    if (isEvent && propChanged) {
      let eventName = key.slice(2).toLowerCase();
      if (eventName.slice(0, 7) === 'content') {
        eventName =
          'content' + eventName.slice(7, 1).toUpperCase() + eventName.slice(8);
      }
      instance.off(eventName, oldProps[key]);
    }
    const toRemove = !props.hasOwnProperty(key);
    if (toRemove) {
      instance.setAttr(key, undefined);
    }
  });
  Object.keys(props).forEach((key) => {
    const isEvent = key.slice(0, 2) === 'on';
    const toAdd = oldProps[key] !== props[key];
    if (isEvent && toAdd) {
      let eventName = key.slice(2).toLowerCase();
      if (eventName.slice(0, 7) === 'content') {
        eventName =
          'content' + eventName.slice(7, 1).toUpperCase() + eventName.slice(8);
      }
      if (props[key]) {
        instance.off(eventName);
        instance.on(eventName, (evt) => {
          props[key](evt.target.AngularComponent, evt);
        });
      }
    }
    if (
      !isEvent &&
      (props[key] !== oldProps[key] || props[key] !== instance.getAttr(key))
    ) {
      hasUpdates = true;
      updatedProps[key] = props[key];
    }
  });

  if (hasUpdates) {
    instance.setAttrs(updatedProps);
    updatePicture(instance);
    let val;
    Object.keys(updatedProps).forEach((prop) => {
      val = updatedProps[prop];
      if (val instanceof Image && !val.complete) {
        const node = instance;
        val.addEventListener('load', function () {
          const layer = node.getLayer();
          if (layer) {
            layer.batchDraw();
          }
        });
      }
    });
  }
}
