import { Component, Input, OnInit } from '@angular/core';
import { MasterScreenerEditActions } from '../../actions/master-screener-edit';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_RADIO_DIRECTIVES } from '@angular2-material/radio';
import {
  MdUniqueSelectionDispatcher
} from '@angular2-material/core/coordination/unique-selection-dispatcher';

import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { GenYcbQuestion } from '../question';

@Component({
  selector: 'preview-collapsable',
  template: `
  <div *ngFor="let question of question.expandable; let i = index">
    <gen-ycb-question [question]="question" [controls]="false"></gen-ycb-question><br>
    <div class="flex">
      <button md-raised-button color="primary" (click)="delete(i)">DELETE</button> 
      <span style="width:3vw"></span>
      <button md-raised-button color="primary" (click)="edit(i)">EDIT</button> 
    </div>
  </div>
  `,
  directives: [GenYcbQuestion, MD_BUTTON_DIRECTIVES]
})
class PreviewCollapsableSection{
  @Input() question: any
  
  constructor(private store: Store<AppState>){}
  
  delete(index){
    this.store.dispatch({type: MasterScreenerEditActions.DELETE_EXPANDABLE_QUESTION, payload: index})
  }
  
  edit(index){
    this.store.dispatch({type: MasterScreenerEditActions.SET_EDIT_EXPANDABLE, payload: index})
  }
}

@Component({
  selector: 'collapsable-question-input',
  template: `
    <div *ngIf="question.type === 'expandable'">
      <md-input placeholder="enter label" [(ngModel)]="expandableQuestion.label"></md-input><br>
      <h3> Input Type </h3>
      <md-radio-group name="collapsableQuestion_controlType" [(ngModel)]="expandableQuestion.controlType">
        <div *ngFor="let type of controlTypes">
          <md-radio-button  name="questionTypeOptions" [value]="type">
            {{type}}
          </md-radio-button>
          <br>
        </div>
      </md-radio-group>
      <div *ngIf="expandableQuestion.controlType === 'radio'">
        <br>
        <strong> Add Options </strong> <br>
        <md-input placeholder="enter option" [(ngModel)]="newOption"></md-input> <br>
        <button md-raised-button color="primary" (click)="addOption()">ADD OPTION</button> <br><br>
        <div class="flex flex-column">
          <strong> Remove Option </strong>
          <div *ngFor="let option of expandableQuestion.options" style="color:blue;" (click)="removeOption(option)">
            {{option}}
          </div>
        </div>
      </div>
      <br><br>
      <button md-raised-button color="primary" (click)="pushExpandable()">DONE</button>
    </div>
    
    <div *ngIf="question.type !== 'expandable'" >
      <h4> This question does not have an expandable section. </h4>
    </div>
  `,
  directives: [MD_INPUT_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_RADIO_DIRECTIVES],
  viewProviders: [MdUniqueSelectionDispatcher]
})
class CollapsableQuestionInput{
  @Input() question;
  @Input() expandableQuestion;
  
  controlTypes = [
    'radio',
    'textbox',
    ''
  ]
  newOption: string = '';
  
  constructor(private store: Store<AppState>){}
  
  addOption(){
    if(this.expandableQuestion.controlType === 'radio' && 
       this.expandableQuestion.options.indexOf(this.newOption) === -1){
      this.expandableQuestion.options.push(this.newOption)
      this.newOption = '';
    }
  }
  
  removeOption(option){
    const index = this.expandableQuestion.options.indexOf(option);
    if(index >= 0){
      this.expandableQuestion.options.splice(index, 1);
    }
  }
  
  pushExpandable(){
    const index = this.question.expandable.indexOf(this.expandableQuestion);
    if(index === -1){
      this.store.dispatch({type: MasterScreenerEditActions.PUSH_EXPANDABLE_QUESTION});
    }
    
  }
}

@Component({
  selector: 'collapsable-question',
  template:  `
  <div class="flex" style="height:90vh;width:80vw;margin-left:2vw;margin-top:2vh">
    
    <section style="width:40vw; height:100%;">
      <collapsable-question-input 
        [question]="question"
        [expandableQuestion]="expandableQuestion">
      </collapsable-question-input>
    </section>
    
    <section style="width:40vw; padding-left:2vw; height:100%; padding-right:2vw;">
      <preview-collapsable 
        [question]="question">
      </preview-collapsable>
    </section>
  </div>
  `,
  directives: [CollapsableQuestionInput, PreviewCollapsableSection]
})
export class CollapsableQuestion{
  @Input() question;
  @Input() expandableQuestion;
}