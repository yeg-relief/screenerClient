import { Key } from './key';
import { Question } from './question';

export type QuestionType = 'conditional' | 'constant';

export interface Screener{
  conditionalQuestions: Question[]
  created: number,
  keys: Key[]
  questions: Question[],
  unusedKeys: Key[]
};