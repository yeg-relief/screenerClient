import { Component, Input} from '@angular/core';
import { QuestionBase } from '../Question/base/question-base';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl } from '@angular/forms';

@Component({
  styleUrls: ['app/dynamic-form-question/dynamic-form-question.component.css'],
  selector: 'df-question',
  template: `
            <div [formGroup]="form">
              <label [attr.for]="question.key">{{question.label}}</label>
              <div [ngSwitch]="question.controlType">
                <input *ngSwitchCase="'textbox'" [formControlName]="question.key"
                        [id]="question.key" [type]="question.type" [value]="question.value">
                        
                <input *ngSwitchCase="'checkbox'" [formControlName]="question.key"
                        [id]="question.key" type="checkbox" [(ngModel)]="question.checked">
                
              </div>
              <div class="errorMessage" *ngIf="!isValid">{{question.label}} is required</div>
            </div>
              `,
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class DynamicFormQuestionComponent{

  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  
  get isValid() { return this.form.controls[this.question.key].valid; }
}