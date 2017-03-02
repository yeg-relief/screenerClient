export type ID = string;

type ControlType = '' | 'invalid' | 'NumberSelect' | 'NumberInput' | 'CheckBox';

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

export interface QuestionThumbNail {
  key: string,
  controlType: ControlType,
  expandable: boolean,
  conditionalLength?: number,
};