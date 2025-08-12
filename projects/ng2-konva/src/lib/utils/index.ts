import { OutputEmitterRef } from '@angular/core';
import { KonvaComponent } from '../interfaces/ko-component.interface';
import applyNodeProps from './applyNodeProps';
import { ListenerRecord } from './types';
import updatePicture from './updatePicture';

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

export function createListener(instance: KonvaComponent): ListenerRecord {
  const output: ListenerRecord = {};
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
  ].forEach((eventName) => {
    const name: keyof KonvaComponent = <keyof KonvaComponent>eventName;

    const outputEmitter: OutputEmitterRef<unknown> = <
      OutputEmitterRef<unknown>
    >instance[name];
    if (outputEmitter['listeners']?.length > 0) {
      output['on' + eventName] = outputEmitter.emit.bind(outputEmitter);
    }
  });
  return output;
}

export { applyNodeProps, updatePicture };
