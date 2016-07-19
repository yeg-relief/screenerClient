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
  selector: 'preview-question',
  template: `
    <gen-ycb-question [question]="question" [controls]="false"></gen-ycb-question>
  `,
  directives: [GenYcbQuestion]
})
class PreviewQuestion{
  @Input() question: any
}



@Component({
  selector: 'main-question-input',
  template: `
    <h3> Question Label </h3>
    <md-input placeholder="enter label" [(ngModel)]="question.label"></md-input>
    <br>
    
    <h3> Does the question have collapsable question(s)? </h3> 
    <md-radio-group name="question_type" [(ngModel)]="expandable" (change)="typeChange()">
      <div *ngFor="let type of questionTypes">
        <md-radio-button  name="questionTypeOptions" [value]="type">
          {{type}}
        </md-radio-button>
        <br>
      </div>
    </md-radio-group>
    <br>
    <br>
    
    <div *ngIf="question.type !== 'expandable'">
      <h3> Input Type </h3>
      <md-radio-group name="question_controlType" [(ngModel)]="question.controlType">
        <div *ngFor="let type of controlTypes">
          <md-radio-button  name="questionTypeOptions" [value]="type">
            {{type}}
          </md-radio-button>
          <br>
        </div>
      </md-radio-group>
      <div *ngIf="question.controlType === 'radio'">
        <br>
        <div class="flex flex-column">
          <strong> Add Options </strong>
          <md-input placeholder="enter option" [(ngModel)]="newOption"></md-input>
          <button md-raised-button color="primary" (click)="addOption()">ADD OPTION</button>
        </div>
        <br>
        <div class="flex flex-column">
          <strong> Remove Option </strong>
          <div *ngFor="let option of question.options" style="color:blue;" (click)="removeOption(option)">
            {{option}}
          </div>
        </div>
      </div>
      <br><br>
    </div>
    
  `,
  directives: [MD_INPUT_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_RADIO_DIRECTIVES],
  viewProviders: [MdUniqueSelectionDispatcher]
})
export class MainQuestionInput implements OnInit{
  @Input() question: any;
  
  expandable: string = '';
  questionTypes = [
    'no',
    'yes'
  ]
  
  controlTypes = [
    'radio',
    'textbox',
    ''
  ]
  
  newOption: string = '';
  
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    if(this.question.type === 'expandable'){
      this.expandable = 'yes';
    } else {
      this.expandable = 'no';
    }
  }
  
  typeChange(){
    switch(this.expandable){
      case 'yes': {
        this.store.dispatch({type: MasterScreenerEditActions.MAKE_EXPANDABLE_QUESTION})
        this.expandable = 'yes';
        break;
      }
      case 'no': {
        this.store.dispatch({type: MasterScreenerEditActions.UNMAKE_EXPANDABLE_QUESTION})
        this.expandable = 'no';
        break;
      }
    }
  }
  
  
  addOption(){
    if(this.question.controlType === 'radio' && this.question.options.indexOf(this.newOption) === -1){
      this.question.options.push(this.newOption)
      this.newOption = '';
    }
  }
  
  removeOption(option){
    const index = this.question.options.indexOf(option);
    if(index >= 0){
      this.question.options.splice(index, 1);
    }
  }
}

@Component({
  selector: 'main-question',
  template: `
  <div class="flex" style="height:90vh;width:80vw;margin-left:2vw;margin-top:2vh">
    
    <section style="width:40vw; height:100%;">
      <main-question-input [question]="question"></main-question-input>
    </section>
    
    <section style="width:40vw; padding-left:2vw; height:100%; padding-right:2vw;">
      <preview-question 
        [question]="question">
      </preview-question>
    </section>
  </div>
  `,
  directives: [MainQuestionInput, PreviewQuestion]
})
export class MainQuestion{
  @Input() question: any;
}
