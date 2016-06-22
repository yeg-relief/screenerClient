import { Component, OnInit, Input } from '@angular/core';
import { QuestionGroup } from '../Question/group/question-group';
import { DynamicFormQuestionComponent } from '../dynamic-form-question/dynamic-form-question.component';
import { QuestionControlService }       from '../Question/control/question-control.service';
import { ControlGroup } from '@angular/common';
import { QuestionBase } from '../Question/base/question-base';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'df-question-group',
  templateUrl: 'app/dynamic-question-group/dynamic-question-group.component.html',
  styleUrls: ['app/dynamic-question-group/dynamic-question-group.component.css'],
  directives: [DynamicFormQuestionComponent],
  providers: [QuestionControlService]
})
export class DynamicQuestionGroupComponent implements OnInit {
  private _subscription: Subscription;
  @Input() group: QuestionGroup<any>;
  @Input() form: ControlGroup;
  @Input() showFollowing: boolean;
  
  ngOnInit() {
    /*
    this._subscription = this.form.controls[this.group.leadingQuestion.key].valueChanges
    .subscribe(data => {
      this.toggleFollowing();
    });
    */
  }
  
  toggleFollowing(){
    this.showFollowing = !this.showFollowing;
    console.log('changed');
    
  }

}
