import { Component, Input, OnInit }     from '@angular/core';
import { ControlGroup }                 from '@angular/common';
import { QuestionGroup }                from '../Question/group/question-group';
import { QuestionBase }                 from '../Question/base/question-base';
import { QuestionControlService }       from '../Question/control/question-control.service';
import { DynamicQuestionGroupComponent } from '../dynamic-question-group/dynamic-question-group.component';
import { Control } from '@angular/common';

@Component({
  selector: 'dynamic-form',
  templateUrl: 'app/dynamic-form/dynamic-form.component.html',
  directives: [DynamicQuestionGroupComponent],
  providers:  [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {
  @Input() questions: QuestionGroup<any>[];
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
