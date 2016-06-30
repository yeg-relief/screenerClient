import { Component, OnInit, Input } from '@angular/core';
import { GeneralQuestionGroup, QuestionGroup, ExpandableGroup } from '../MasterScreener/index';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl } from '@angular/forms';
import { MSQuestionComponent } from '../question/master-screener-question.component';

// a normal or 'constant' question group
@Component({
  selector: 'question-group',
  template:` 
  <div>
    <div *ngFor="let question of questionGroup.group" class="form-row">
      <ms-question [question]="question" [form]="form"></ms-question>
    </div>
  </div>`,
  styles: [''], 
  directives: [REACTIVE_FORM_DIRECTIVES, MSQuestionComponent]
})
export class QuestionGroupComponent implements OnInit {
  @Input()
  questionGroup: QuestionGroup;
  @Input()
  form: FormGroup;
  ngOnInit(){}
}

// an expandable question group, ie click a checkbox => more question pop up
@Component({
  selector: 'expandable-group',
  template:` 
  <div>
    <ms-question [question]="expandableGroup.conditional" 
      [form]="form"
      (change)="toggleExpanded()">
    </ms-question>
    <div *ngIf="expanded" class="bg-darken-2 rounded">
      <div *ngFor="let question of expandableGroup.expandable" class="form-row">
        <ms-question [question]="question" [form]="form"></ms-question>
      </div>
    </div>
  </div>`,
  styles: [''], 
  directives: [REACTIVE_FORM_DIRECTIVES, MSQuestionComponent]
})
export class ExpandableGroupComponent implements OnInit{
  @Input()
  expandableGroup: ExpandableGroup;
  @Input()
  form: FormGroup;
  @Input()
  collapsedControls: {key:string, control:FormControl}[];
    
  expanded: boolean;
    
  ngOnInit(){
    this.expanded = this.expandableGroup.conditional.value;
  }  
    
  toggleExpanded(){
    if(!this.expanded){
      this.collapsedControls.map( (collapsedControl) => {
        this.form.addControl(collapsedControl.key, collapsedControl.control);
      })
    }else{
      this.collapsedControls.map( (collapsedControl) => {
        this.form.removeControl(collapsedControl.key);
      })
    }
    this.expanded = !this.expanded;
  }
}


// a partitioning component
@Component({
  selector: 'general-question-group',
  template:` 
  <div [formGroup]="form">
    <div [ngSwitch]="groupType">
      <question-group 
        *ngSwitchCase="'QuestionGroup'" 
        [questionGroup]="questionGroup" 
        [form]="form">
      </question-group> 
      <expandable-group 
        *ngSwitchCase="'ExpandableGroup'" 
        [expandableGroup]="questionGroup"
        [collapsedControls]="collapsedControlMap[questionGroup.conditional.key]"
        [form]="form">
      </expandable-group>
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
  
  @Input()
  collapsedControlMap: { [key:string]:{key:string, control:FormControl}[]}
  
  groupType: string;
  
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