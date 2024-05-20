import { ShapeConfigTypes } from './configTypes';

export type ListenerRecord = Record<string, (value?: unknown) => void>;
export type PropsType = ShapeConfigTypes & ListenerRecord;
