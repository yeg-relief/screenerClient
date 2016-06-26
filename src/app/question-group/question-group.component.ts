import { Component, OnInit, Input } from '@angular/core';
import { GeneralQuestionGroup, QuestionGroup, ExpandableGroup } from '../Screener';
import { FormGroup, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';

@Component({
  selector: 'general-question-group',
  template:` 
  <div [formGroup]="form">
    <div [ngSwitch]="groupType">
      <question-group *ngSwitchCase='QuestionGroup' [questionGroup]="questionGroup"></question-group> 
      <expandable-group *ngSwitchCase='ExpandableGroup' [expandableGroup]="questionGroup></expandable-group>
    </div>
  </div>`,
  styles: [''], 
  directives: [REACTIVE_FORM_DIRECTIVES, QuestionGroupComponent,ExpandableGroupComponent],
})
export class GeneralQuestionGroupComponent implements OnInit {
  @Input()
  questionGroup: GeneralQuestionGroup;  
  
  @Input()
  form: FormGroup;
  
  private groupType: string;
  
  ngOnInit(){
     this.checkGroupType();
  }
  
  private checkGroupType(){
    const expandable: ExpandableGroup = <ExpandableGroup>this.questionGroup;
    const regular: QuestionGroup = <QuestionGroup>this.questionGroup;
    if(expandable.conditional === undefined && 
        expandable.expandable === undefined && regular.group !== undefined){
      this.groupType = 'QuestionGroup';
    }
    else if(expandable.conditional !== undefined && 
        expandable.expandable !== undefined && regular.group === undefined){
      this.groupType = 'ExpandableGroup';      
    }    
  }
}



@Component({
  selector: 'question-group',
  template:` 
  <div>
    <div *ngFor="let question of questionGroup.group" class="form-row">
      <ms-question [question]="question" [form]="form"></ms-question>
    </div>
  </div>`,
  styles: [''], 
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class QuestionGroupComponent implements OnInit {
  @Input()
  questionGroup: QuestionGroup;
  ngOnInit(){}
}



@Component({
  selector: 'expandable-question-group',
  template:` 
  <div>
    <ms-question [question]="expandableGroup.expandable" [form]="form">
    
    <div *ngIf="expandableGroup.conditional.value">
      <div *ngFor="let question of expandableGroup.expandable" class="form-row">
        <ms-question [question]="question" [form]="form"></ms-question>
      </div>
    </div>
  </div>`,
  styles: [''], 
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class ExpandableGroupComponent implements OnInit {
  @Input()
  expandableGroup: ExpandableGroup;
  
  ngOnInit(){}
}
