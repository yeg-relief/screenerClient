import { Component, Input, OnInit }     from '@angular/core';
import { ControlGroup }                 from '@angular/common';
import { QuestionBase }                 from '../Question/question-base';
import { QuestionControlService }       from '../Question/question-control.service';
import { DynamicFormQuestionComponent } from '../dynamic-form-question/dynamic-form-question.component';

@Component({
  selector: 'dynamic-form',
  templateUrl: 'app/dynamic-form/dynamic-form.component.html',
  directives: [DynamicFormQuestionComponent],
  providers:  [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {
  
  @Input() questions: QuestionBase<any>[] = [];
  form: ControlGroup;
  payLoad = '';
  
  constructor(private qcs: QuestionControlService) {  }
  ngOnInit() {
    this.form = this.qcs.toControlGroup(this.questions);
  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }
}
