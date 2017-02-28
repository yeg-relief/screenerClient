import { Key } from '../../models/key';

export type Id = string;
export type Question = {
  conditionalQuestions?: Id[],
  controlType: '' | 'invalid' | 'NumberSelect' | 'NumberInput' | 'CheckBox',
  expandable: boolean,
  id: Id,
  index: number,
  key: string,
  label: string,
  options: number[]
};
export type Model = {
  conditionalQuestions: Question[]
  created: number,
  keys: Key[]
  questions: Question[],
  unusedKeys: Key[]
};
export type State = {
  questions: Id[],
  created: number,
  unusedKeys: string[],
  keys: string[],
  errors: Map<string, string[]>
};

export type Command = {
  fn: Function,
  args?: any[]
};