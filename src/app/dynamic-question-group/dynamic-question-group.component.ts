import { Component, Input } from '@angular/core';
import { QuestionGroup } from '../Question/group/question-group';
import { DynamicFormQuestionComponent } from '../dynamic-form-question/dynamic-form-question.component';
import { QuestionControlService }       from '../Question/control/question-control.service';
import { ControlGroup, Control } from '@angular/common';
import { QuestionBase } from '../Question/base/question-base';

@Component({
  selector: 'df-question-group',
  templateUrl: 'app/dynamic-question-group/dynamic-question-group.component.html',
  styleUrls: ['app/dynamic-question-group/dynamic-question-group.component.css'],
  directives: [DynamicFormQuestionComponent],
  providers: [QuestionControlService]
})
export class DynamicQuestionGroupComponent{

  @Input() group: QuestionGroup<any>;
  @Input() form: ControlGroup;
  @Input() showFollowing: boolean;
  
  toggleFollowing(){
    if(this.showFollowing = !this.showFollowing){
      this.group.followingQuestions.map( question => {
        this.form.addControl(question.key, new Control(''));
      })
    }else{
      this.group.followingQuestions.map( question => {
        this.form.removeControl(question.key);
        this.form.exclude(question.key);
      })
    }
  }

}
