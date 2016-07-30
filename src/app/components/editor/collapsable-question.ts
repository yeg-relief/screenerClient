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
  selector: 'preview-collapsable',
  template: `
  <md-card *ngIf="question.type === 'expandable'">
    <md-card-title>Preview of current question</md-card-title>
    <md-card-subtitle>this question has not been added to the collapsable list</md-card-subtitle>
    <md-card-content>
      <gen-ycb-question [question]="expandableQuestion" [controls]="false"></gen-ycb-question>
    </md-card-content>
  </md-card>
  <br>
  <md-card *ngIf="question.type === 'expandable'">
    <md-card-title>List of collapsable questions</md-card-title>
    <md-card-subtitle>these question will be shown only if the <strong>main question</strong> is checked</md-card-subtitle>
    <md-card-content  *ngFor="let question of question.expandable; let i = index">
      <gen-ycb-question [question]="question" [controls]="false"></gen-ycb-question><br>
      <div class="flex">
        <button md-raised-button color="primary" (click)="delete(i)">DELETE</button> 
        <span style="width:3vw"></span>
        <button md-raised-button color="primary" (click)="edit(i)">EDIT</button> 
      </div>
    </md-card-content>
  </md-card>
  `,
  directives: [GenYcbQuestion, MD_BUTTON_DIRECTIVES, MD_CARD_DIRECTIVES]
})
class PreviewCollapsableSection{
  @Input() question: any;
  @Input() expandableQuestion: any;
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
      <md-card>
        <md-card-title>Collapsable Section</md-card-title>
        <md-card-subtitle>enter the questions you want hidden below</md-card-subtitle>
        <md-card-content> 
          <p>You can edit or delete a hidden question with the controls on the right.</p>
          <p>Remember that you can also preview the question by navigating to the 
            <strong>Preview Question</strong> tab above.
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
          <select [(ngModel)]="expandableQuestion.key">
            <option *ngFor="let key of keys">
              {{key.id}}
            </option>
          </select>
        </md-card-content>
      </md-card>
      
      <md-card>
        <md-card-title>Input Options </md-card-title>
        <md-card-subtitle>How the user inputs their answer</md-card-subtitle>
        <md-card-content>
          <md-radio-group name="collapsableQuestion_controlType" 
          [(ngModel)]="expandableQuestion.controlType"
          (change)="typeChange()">
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
          <md-input placeholder="write your question here" [(ngModel)]="expandableQuestion.label"></md-input>
        </md-card-content>
      </md-card>
      
      <md-card *ngIf="expandableQuestion.controlType === 'radio'">
        <md-card-title>Add a choice</md-card-title>
        <md-card-subtitle>add an option to the multiple choice question</md-card-subtitle>
        <md-card-content>
          <md-input placeholder="enter option" [(ngModel)]="newOption"></md-input> <br>
          <button md-raised-button color="primary" (click)="addOption()">ADD OPTION</button> <br><br>
          <div *ngIf="optionError !== ''" style="color:red">
            <p> {{optionError}} </p>
          </div>
        </md-card-content>
      </md-card>
      
      <md-card *ngIf="expandableQuestion.controlType === 'radio'">
        <md-card-title>Remove a choice</md-card-title>
        <md-card-subtitle>remove an option to the multiple choice question</md-card-subtitle>
        <md-card-content>
          <div *ngFor="let option of expandableQuestion.options" style="color:blue;" (click)="removeOption(option)">
            {{option}}
          </div>
        </md-card-content>
      </md-card>
 
      <md-card>
        <md-card-title>Add your question</md-card-title>
        <md-card-subtitle>By clicking done you will add this question to the list of collapsable questions</md-card-subtitle>
        <md-card-content>
          <button md-raised-button color="primary" (click)="pushExpandable()">DONE</button>
          <div class="flex flex-column">
            <div *ngFor="let error of errors" style="color:red">
              <p>{{error}}</p>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>
    
    <div *ngIf="question.type !== 'expandable'" >
      <md-card>
        <md-card-title> The new question does not have a collapsable section.</md-card-title>
        <md-card-subtitle>because there is no collapsable section this tab has no usable content </md-card-subtitle>
        <md-card-content>
          <p> If you want to add a collapsable section, then navigate to the <strong>Main Question</strong> tab 
          and select <i>yes</i> to the <strong> Does the question have collapsable question(s)? </strong> option.
          </p>
        </md-card-content>
      </md-card>
    </div>
  `,
  directives: [MD_INPUT_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_RADIO_DIRECTIVES, MD_CARD_DIRECTIVES],
  viewProviders: [MdUniqueSelectionDispatcher]
})
class CollapsableQuestionInput{
  @Input() question;
  @Input() expandableQuestion;
  @Input() keys;
  
  controlTypes = [
    'radio',
    'textbox',
    ''
  ]
  newOption: string = '';
  
  errors = [];
  optionError = '';
  
  constructor(private store: Store<AppState>){}
  
  typeChange(){
    if(this.expandableQuestion.controlType === 'textbox'){
      this.expandableQuestion.options = [];
    }
  }
  
  addOption(){
    if(this.expandableQuestion.controlType === 'radio' && 
       this.expandableQuestion.options.indexOf(this.newOption) === -1 &&
       this.newOption !== ''){
      this.expandableQuestion.options.push(this.newOption)
      this.newOption = '';
      this.optionError = '';
      return;
    }
    if(this.newOption === ''){
      this.optionError = 'you must enter option text above';
    }
  }
  
  removeOption(option){
    const index = this.expandableQuestion.options.indexOf(option);
    if(index >= 0){
      this.expandableQuestion.options.splice(index, 1);
    }
  }
  
  pushExpandable(){
    let error = false;
    if(this.expandableQuestion.label === ''){
      if(this.errors.indexOf('You need to enter Question Text.') === -1){
        this.errors.push('You need to enter Question Text.');
      }
      error = true;
    }
    
    if(this.expandableQuestion.controlType === ''){
      if(this.errors.indexOf('You need to select an input option.') === -1){
        this.errors.push('You need to select an input option.');
      }
      error = true;
    }
    
    if(error){
      return;
    }
    
    const index = this.question.expandable.indexOf(this.expandableQuestion);
    if(index === -1){
      this.store.dispatch({type: MasterScreenerEditActions.PUSH_EXPANDABLE_QUESTION});
    } else {
      this.store.dispatch({type: MasterScreenerEditActions.CLEAR_EXPANDABLE_QUESTION});
    }
    
    this.errors = [];
  }
}

@Component({
  selector: 'collapsable-question',
  template:  `
  <div class="flex" style="width:80vw;margin-left:2vw;margin-top:2vh">
    
    <section class="flex flex-column" style="width:40vw;">
      <collapsable-question-input 
        [question]="question"
        [expandableQuestion]="expandableQuestion"
        [keys]="keys">
      </collapsable-question-input>
    </section>
    
    <section class="flex flex-column" style="width:40vw; padding-left:2vw; padding-right:2vw;">
      <preview-collapsable 
        [question]="question"
        [expandableQuestion]="expandableQuestion">
      </preview-collapsable>
    </section>
  </div>
  `,
  directives: [CollapsableQuestionInput, PreviewCollapsableSection]
})
export class CollapsableQuestion{
  @Input() question;
  @Input() expandableQuestion;
  @Input() keys;
}