import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Question } from '../Screener/index';

@Component({
  selector:'ms-question',
  template:`
  <div [formGroup]="form">
    <label [attr.for]="question.key" class="z2 ml2">{{question.label}}</label>
    <div [ngSwitch]="question.controlType">
      <input 
        *ngSwitchCase="'textbox'" 
        [formControlName]="question.key"
        [id]="question.key" 
        type="textbox" 
        class="block mt1 mb1 field fit ml2 z2">
            
      <input 
        *ngSwitchCase="'checkbox'" 
        [formControlName]="question.key"
        [id]="question.key" 
        type="checkbox" 
        [(ngModel)]="question.value" 
        class="block mt1 mb2 fit ml2 z2">
      
      <select 
        *ngSwitchCase="'dropdown'" 
        [id]="question.key" 
        [formControlName]="question.key"
        class="block mt1 mb1 field fit ml2 z2">
          <option *ngFor="let opt of question.options" [value]="opt.key">
              {{opt.value}}
          </option>
      </select>
      
    </div>
  </div>
  `,
  styleUrls: ['app/question/styles.css'],
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class MSQuestionComponent{
  @Input() question: Question;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }
}