import { OutputEmitterRef } from '@angular/core';
import { KonvaComponent } from '../interfaces/ko-component.interface';
import applyNodeProps from './applyNodeProps';
import updatePicture from './updatePicture';

export type PropsType = Record<string, any>;

function camelize(str: string): string {
  return str
    .replace(/^\w|[A-Z]|\b\w/g, function (letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, '');
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getName(componentTag: string): string {
  return capitalizeFirstLetter(
    camelize(componentTag.slice(3).replace('-', ' ')),
  );
}

export function createListener(instance: KonvaComponent): PropsType {
  const output: PropsType = {};
  [
    'mouseover',
    'mousemove',
    'mouseout',
    'mouseenter',
    'mouseleave',
    'mousedown',
    'mouseup',
    'wheel',
    'contextmenu',
    'click',
    'dblclick',
    'touchstart',
    'touchmove',
    'touchend',
    'tap',
    'dbltap',
    'dragstart',
    'dragmove',
    'dragend',
    'transformstart',
    'transform',
    'transformend',
  ].forEach((eventName) => {
    const outputEmitter = (instance as unknown as Record<string, unknown>)[
      eventName
    ] as OutputEmitterRef<unknown> | undefined;
    if (
      outputEmitter &&
      (outputEmitter as unknown as { listeners: unknown[] })['listeners']
        ?.length > 0
    ) {
      output['on' + eventName] = outputEmitter.emit.bind(outputEmitter);
    }
  });
  return output;
}

export { applyNodeProps, updatePicture };
