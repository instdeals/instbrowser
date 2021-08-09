export interface Callback<T> {
  (arg: T): any;
}
export interface RetCallback<T, R> {
  (arg: T): R;
}
export interface StringMap<T> {
  [index: string]: T;
}
export interface NumberMap<T> {
  [index: number]: T;
}
export interface KeyValue<T> {
  key: string;
  value: T;
}
export interface ActionHandler {
  (onDone?: Callback<void>): any;
}
export interface Action {
  label: string;
  handler: ActionHandler;
}
export interface LabeledValue<T> {
  label: string;
  value: T;
}
export interface DataWithTimestamp<T> {
  updateTsInSeconds: number;
  data: T;
}

export const doNothing = () => {
  return null;
};
export function dataWithTimestamp<T>(data: T, ts: number | undefined = undefined) {
  return { updateTsInSeconds: ts || Date.now(), data };
}

export function labeledValue<T>(label: string, value: T): LabeledValue<T> {
  return { label, value };
}

export interface FormSubmitCallback {
  (formData: FormData, fields?: StringMap<string>): Promise<any>
}

export function identity<T>(v: T) {
  return v;
}

export type VerificationMode = 'Mobile' | 'Email';

