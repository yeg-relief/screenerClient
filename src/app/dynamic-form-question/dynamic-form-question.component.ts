import { Component, Input, OnInit } from '@angular/core';
import { ControlGroup } from '@angular/common';
import { QuestionBase } from '../Question/base/question-base';
import { Subscription } from 'rxjs/Subscription';
import { ChangeDetectionStrategy } from '@angular/core';
@Component({
  styleUrls: ['app/dynamic-form-question/dynamic-form-question.component.css'],
  selector: 'df-question',
  template: `
            <div [ngFormModel]="form">
              <label [attr.for]="question.key">{{question.label}}</label>
              <div [ngSwitch]="question.controlType">
                <input *ngSwitchWhen="'textbox'" [ngControl]="question.key"
                        [id]="question.key" [type]="question.type" [value]="question.value">
                        
                <input *ngSwitchWhen="'checkbox'" [ngControl]="question.key"
                        [id]="question.key" type="checkbox" [(ngModel)]="question.checked">
                
              </div>
              <div class="errorMessage" *ngIf="!isValid">{{question.label}} is required</div>
            </div>
              `,
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormQuestionComponent implements OnInit{
  private _subscription: Subscription;
  @Input() question: QuestionBase<any>;
  @Input() form: ControlGroup;
  
  get isValid() { return this.form.controls[this.question.key].valid; }
  ngOnInit() {}
}