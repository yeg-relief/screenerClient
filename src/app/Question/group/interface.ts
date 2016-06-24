import { QuestionSet } from './question-set';
import { FormControl } from '@angular/forms';
import { IOptions } from '../question-base';

export class GROUP_TYPE{
  static EXPANDABLE(): string{
    return 'EXPANDABLE'
  }
  
  static CONSTANT(): string{
    return 'CONSTANT';
  }
}

export interface Controls{
  leadQuestion?: FormControl;
  hiddenQuestions?: FormControl[];
  constantQuestions?: FormControl[];
}

export interface QuestionGroup{
  getControls(): Controls;
  GROUP_TYPE(): string
}

export interface RawQuestionGroup{
  lead?: IOptions<string|boolean>,
  following?: Array<IOptions<string|boolean>>,
  constants?: Array<IOptions<string|boolean>>
}