import { Component, Input, OnInit }     from '@angular/core';
import { ControlGroup }                 from '@angular/common';
import { QuestionGroup }                from '../Question/group/question-group';
import { QuestionBase }                 from '../Question/base/question-base';
import { QuestionControlService }       from '../Question/control/question-control.service';
import { DynamicFormQuestionComponent, INewValue } 
       from '../dynamic-form-question/dynamic-form-question.component';
import { Control } from '@angular/common';

@Component({
  selector: 'dynamic-form',
  templateUrl: 'app/dynamic-form/dynamic-form.component.html',
  directives: [DynamicFormQuestionComponent],
  providers:  [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {
  
  @Input() questions: QuestionGroup<any>;
  form: ControlGroup;
  leadingQuestion: QuestionBase<any>;
  followingQuestions: QuestionBase<any>[];
  payLoad = '';
  
  constructor(private qcs: QuestionControlService) {  }
  ngOnInit() {
    this.leadingQuestion = this.questions.leadingQuestion;
    this.followingQuestions = this.questions.followingQuestions;
    this.form = this.qcs.toControlGroup(this.questions);
    
  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }
  
  logChange(change: INewValue){
    console.log(`key: ${change.key}, data: ${change.data}`);
  }
}
