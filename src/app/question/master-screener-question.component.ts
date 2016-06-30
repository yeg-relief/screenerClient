import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Question } from '../MasterScreener/index';

@Component({
  selector:'ms-question',
  template:`
  <div [formGroup]="form">
    
    <div [ngSwitch]="question.controlType">
     <div  class="px1 py1">   
      <label [attr.for]="question.key">{{question.label}}</label>
      <input 
          *ngSwitchCase="'checkbox'" 
          [formControlName]="question.key"
          [id]="question.key" 
          type="checkbox" 
          [(ngModel)]="question.value">
      
        
        
        <input 
        *ngSwitchCase="'textbox'" 
        [formControlName]="question.key"
        [id]="question.key" 
        type="textbox">
       
        <select 
          *ngSwitchCase="'dropdown'" 
          [id]="question.key" 
          [formControlName]="question.key">
            <option *ngFor="let opt of question.options" [value]="opt.key">
                {{opt.value}}
            </option>
        </select>
     </div>
      
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