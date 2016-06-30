import * as QuestionTypes from './types';

export interface ControllableQuestion{
  validators: QuestionTypes.ValidatorTypes[];
  value: string | boolean;
  key: string
}

export interface ConcreteQuestionGroup{
  group?: QuestionTypes.Question[];
  conditional?: QuestionTypes.ConditionalQuestion;
  expandable?: QuestionTypes.Question[];
}