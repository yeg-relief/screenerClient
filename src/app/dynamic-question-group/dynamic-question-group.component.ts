import { Component, Input } from '@angular/core';
import { QuestionGroup } from '../Question/group/question-group';
import { DynamicFormQuestionComponent } from '../dynamic-form-question/dynamic-form-question.component';
import { ControlGroup, Control } from '@angular/common';
import { QuestionBase } from '../Question/base/question-base';

@Component({
  selector: 'df-question-group',
  styleUrls: ['app/dynamic-question-group/dynamic-question-group.component.css'],
  directives: [DynamicFormQuestionComponent],
  template: `
            <div *ngIf="group.leadingQuestion" [ngFormModel]="form">
              <label [attr.for]="group.leadingQuestion.key">{{group.leadingQuestion.label}}</label>
              <input [ngControl]="group.leadingQuestion.key" 
                [id]="group.leadingQuestion.key" 
                type="checkbox" [(ngModel)]="group.leadingQuestion.checked"
                (ngModelChange)="toggleFollowing()">
            </div>
            <div *ngIf="showFollowing">
              <div *ngFor="let question of group.followingQuestions" class="form-row">
                <df-question [question]="question" [form]="form"></df-question>
              </div>
            </div>`
})
export class DynamicQuestionGroupComponent{

  @Input() group: QuestionGroup<any>;
  @Input() form: ControlGroup;
  @Input() showFollowing: boolean;
  
  toggleFollowing(){
    if(this.showFollowing = !this.showFollowing){
      this.group.followingQuestions.map( question => {
        this.form.addControl(question.key, new Control(''));
        this.form.include(question.key);
      })
    }else{
      this.group.followingQuestions.map( question => {
        this.form.removeControl(question.key);
        this.form.exclude(question.key);
      })
    }
  }
}
