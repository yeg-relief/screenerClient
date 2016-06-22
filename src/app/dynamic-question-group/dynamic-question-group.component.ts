import { Component, OnInit, Input } from '@angular/core';
import { QuestionGroup } from '../Question/group/question-group';
import { DynamicFormQuestionComponent } from '../dynamic-form-question/dynamic-form-question.component';
import { QuestionControlService }       from '../Question/control/question-control.service';
import { ControlGroup } from '@angular/common';

@Component({
  selector: 'df-question-group',
  templateUrl: 'app/dynamic-question-group/dynamic-question-group.component.html',
  styleUrls: ['app/dynamic-question-group/dynamic-question-group.component.css'],
  directives: [DynamicFormQuestionComponent],
  providers: [QuestionControlService]
})
export class DynamicQuestionGroupComponent implements OnInit {
  
  @Input() group: QuestionGroup<any>;
  @Input() form: ControlGroup;
  // onChanged will be called on initialization, so you need to initialize showFollowing 
  // to true to hide at start...
  @Input() showFollowing: boolean;
  
  ngOnInit() {
    console.log(this.showFollowing);
  }
  
  toggleFollowing($event){
    this.showFollowing = !this.showFollowing;
    console.log(this.showFollowing);
  }

}
