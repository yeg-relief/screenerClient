import { FormControl } from '@angular/forms';

export type Question = {
  value: any;
  validators: ValidatorTypes[];
  key: string;
  label: string;
  order: number;
  controlType: string;
  type?: string;
}

export type ConditionalQuestion = {
  value: boolean;
  validators: ValidatorTypes[];
  key: string;
  label: string;
  controlType: string;
  conditional: string;
}

export type QuestionGroup = {
  group: Question[];
}

export type ExpandableGroup = {
  conditional: ConditionalQuestion;
  expandable: Question[];
}

// ???
export type ValidatorTypes = string;

export type ControlMap = { [key: string]: FormControl };

export type QuestionMap = { [key: string]: Question | ConditionalQuestion };

export type MasterScreener = {
  controls: ControlMap;
  questionGroups: Array<GeneralQuestionGroup>;
}

export type GeneralQuestionGroup = QuestionGroup | ExpandableGroup;

export const REQUIRED_VALIDATOR: ValidatorTypes = 'REQUIRED';