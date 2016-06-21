import { QuestionBase } from '../base/question-base';
import { CheckboxQuestion } from '../checkbox/question-checkbox';
import { Control, ControlGroup } from '@angular/common';

export interface IQuestionGroup{
 leading: Control;
 following?: ControlGroup; 
}

export class QuestionGroup<T> {
  followingQuestions: QuestionBase<T>[];
  leadingQuestion: QuestionBase<T>;
  constructor(lead: QuestionBase<T>, following?: QuestionBase<T>[]){
    this.leadingQuestion = lead;
    this.leadingQuestion.order = 1;
    this.followingQuestions = following || [];    
  }
 }
