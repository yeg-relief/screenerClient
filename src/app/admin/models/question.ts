import { Key } from './key';

export type ID = string;
export type QuestionType = 'conditional' | 'constant';

export const QUESTION_TYPE_CONSTANT: QuestionType = 'constant';
export const QUESTION_TYPE_CONDITIONAL: QuestionType = 'conditional';

export type ControlType = '' | 'invalid' | 'NumberSelect' | 'NumberInput' | 'CheckBox';

export interface Question {
  conditionalQuestions?: ID[],
  controlType: ControlType,
  expandable: boolean,
  id: ID,
  index: number,
  key: string,
  label: string,
  options: number[]
};

export interface Question_2 {
  conditionalQuestions?: ID[],
  controlType: ControlType,
  expandable: boolean,
  id: ID,
  index: number,
  key: Key,
  label: string,
  options: number[]
}