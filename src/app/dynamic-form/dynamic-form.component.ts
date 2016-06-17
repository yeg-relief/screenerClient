import { Component, Input, OnInit }     from '@angular/core';
import { ControlGroup }                 from '@angular/common';
import { QuestionBase }                 from '../Question/base/question-base';
import { QuestionControlService }       from '../Question/control/question-control.service';
import { DynamicFormQuestionComponent } from '../dynamic-form-question/dynamic-form-question.component';
import { INewValue } from '../dynamic-form-question/dynamic-form-question.component';
import { RadioButtonState } from '@angular/common';
import {Control} from '@angular/common';
import { CheckboxControlValueAccessor } from '@angular/common';

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
    console.log(this.form);
  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }
  
  logChange(change: INewValue){
    //console.log(this.form);
    console.log(`key: ${change.key}, data: ${change.data}`);
  }
}
