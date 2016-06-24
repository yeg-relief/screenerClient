import { QuestionBase } from '../question-base';
import { QuestionSet } from './question-set';
import { FormControl, Validators } from '@angular/forms';
import { QuestionGroup, Controls, GROUP_TYPE } from './interface';


export class ExpandableGroup implements QuestionGroup{
  private hiddenQuestions: QuestionSet;
  private leadingQuestion: QuestionBase<boolean>;
  private controls: Controls;
  constructor(lead: QuestionBase<boolean>, following?: QuestionBase<any>[]){
    this.leadingQuestion = lead;
    if(following !== undefined){
      this.hiddenQuestions = new QuestionSet(following);
    }
  }
  
  getControls(): Controls{
    if (this.controls === undefined){
      this.controls = {};
      this.controls['hiddenQuestions'] = this.hiddenQuestions.getControls();
      this.controls['leadQuestion'] = this.leadingToControl();
    }
    return this.controls;
  }
  
  private leadingToControl(): FormControl{
    if(this.leadingQuestion.required === true){
      return new FormControl(this.leadingQuestion.value, Validators.required)
    }
    return new FormControl(this.leadingQuestion.value);
  }
  
  GROUP_TYPE(): string{
    return GROUP_TYPE.EXPANDABLE();
  }
 }
