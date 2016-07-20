import { Component, Input, OnInit } from '@angular/core';
import { MasterScreenerEditActions } from '../../actions/master-screener-edit';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_RADIO_DIRECTIVES } from '@angular2-material/radio';
import {
  MdUniqueSelectionDispatcher
} from '@angular2-material/core/coordination/unique-selection-dispatcher';

import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { GenYcbQuestion } from '../question';

@Component({
  selector: 'preview-question',
  template: `
    <md-card>
      <md-card-title>Question Preview</md-card-title>
      <md-card-subtitle>A preview of the question you're currently working on</md-card-subtitle>
      <md-card-content>
        <gen-ycb-question [question]="question" [controls]="false"></gen-ycb-question>
      </md-card-content>
    </md-card>
    
  `,
  directives: [GenYcbQuestion, MD_CARD_DIRECTIVES]
})
class PreviewQuestion{
  @Input() question: any
}



@Component({
  selector: 'main-question-input',
  template: `
  <div style="padding-bottom: 5vh;">
    <md-card>
      <md-card-title>Does the question have collapsable question(s)?</md-card-title>
      <md-card-subtitle>Click yes if you want to hide questions unless the user checks the box</md-card-subtitle>
      <md-card-content>
        <md-radio-group name="question_type" [(ngModel)]="expandable" (change)="typeChange()">
          <div *ngFor="let type of questionTypes">
            <md-radio-button  name="questionTypeOptions" [value]="type">
              {{type}}
            </md-radio-button>
            <br>
          </div>
        </md-radio-group>  
        <div *ngIf="question.type === 'expandable'">
          <strong> navigate to the Collapsable Section tab above to manage the list of hidden questions </strong>
        </div>                
      </md-card-content>
    </md-card>
    
    <md-card>
      <md-card-title>Input Question Key</md-card-title>
      <md-card-subtitle>
        <p>
           Every question must have a key, so that the program can match programs against the master screener. 
           <strong> A key may only occur once per master screener </strong>
        </p>
      </md-card-subtitle>
      <md-card-content>
        <select [(ngModel)]="question.key">
          <option *ngFor="let key of keys">
            {{key.key}}
          </option>
        </select>
      </md-card-content>
    </md-card>
    
    <md-card *ngIf="question.type !== 'expandable'">
      <md-card-title>Input Options</md-card-title>
      <md-card-subtitle>How the user inputs their answer</md-card-subtitle>
      <md-card-content>
        <md-radio-group name="question_controlType" [(ngModel)]="question.controlType">
          <div *ngFor="let type of controlTypes">
            <md-radio-button  name="questionTypeOptions" [value]="type">
              {{type}}
            </md-radio-button>
            <br>
          </div>
        </md-radio-group>
      </md-card-content>
    </md-card>
    
    <md-card>
      <md-card-title>Question Text</md-card-title>  
      <md-card-subtitle>The question you want to ask</md-card-subtitle>
      <md-card-content>
        <md-input placeholder="Write your question here" [(ngModel)]="question.label"></md-input>
      </md-card-content>
    </md-card>
    
    <md-card *ngIf="question.controlType === 'radio'">
      <md-card-title>Add a choice</md-card-title>
      <md-card-subtitle>add an option to the multiple choice question</md-card-subtitle>
      <md-card-content>
        <div class="flex flex-column">
          <strong> Add Options </strong>
          <md-input placeholder="enter option" [(ngModel)]="newOption"></md-input>
          <button md-raised-button color="primary" (click)="addOption()">ADD OPTION</button>
        </div>
      </md-card-content>
    </md-card>
    
    <md-card *ngIf="question.controlType === 'radio'">
      <md-card-title>Remove a choice</md-card-title>
      <md-card-subtitle>remove an option from the multiple choice question</md-card-subtitle>
      <md-card-content>
        <div *ngFor="let option of question.options" style="color:blue;" (click)="removeOption(option)">
          {{option}}
        </div>
      </md-card-content>
    </md-card>
  </div>
  `,
  directives: [MD_INPUT_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_RADIO_DIRECTIVES, MD_CARD_DIRECTIVES],
  viewProviders: [MdUniqueSelectionDispatcher]
})
export class MainQuestionInput implements OnInit{
  @Input() question: any;
  @Input() keys: any;
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
  <div class="flex" style="width:80vw;margin-left:5vw;margin-top:2vh;">
    
    <section style="width:40vw;">
      <main-question-input 
        [question]="question"
        [keys]="keys"></main-question-input>
    </section>
    
    <section style="width:40vw; margin-left:2vw;margin-right:2vw;">
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
  @Input() keys: any;
}
