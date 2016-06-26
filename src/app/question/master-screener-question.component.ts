import { Component, Input } from '@angular/core';
import { FormGroup, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Question } from '../Screener';

@Component({
  selector:'ms-question',
  template:`
  <div [formGroup]="form">
    <label [attr.for]="question.key">{{question.label}}</label>
    <div [ngSwitch]="question.controlType">
      <input *ngSwitchCase="'textbox'" [formControlName]="question.key"
            [id]="question.key" [type]="question.type">
            
      <input *ngSwitchCase="'checkbox'" [formControlName]="question.key"
            [id]="question.key" [type]="question.type" >
    </div>
  </div>
  `,
  styles: [''],
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class MSQuestionComponent{
  @Input() question: Question;
  @Input() form: FormGroup;
  
  get isValid() { return this.form.controls[this.question.key].valid; }
}