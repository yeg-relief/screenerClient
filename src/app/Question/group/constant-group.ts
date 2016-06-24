import { IOptions } from '../question-base';
import { QuestionSet } from './question-set';
import { FormControl } from '@angular/forms';
import { QuestionGroup, Controls, GROUP_TYPE } from './interface';

export class ConstantGroup implements QuestionGroup{
  questions: QuestionSet;

   
  constructor(group: IOptions<string|boolean>[]){
    this.questions = new QuestionSet(group);
  }
  
  getControls(): Controls{
    let controls = {};
    controls['constantQuestions'] = this.questions.getControls();
    return controls;
  }
  
  GROUP_TYPE(): string{
    return GROUP_TYPE.CONSTANT();
  }
}