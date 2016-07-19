import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { GenYcbQuestion } from '../question';
import { MasterScreenerEditActions } from '../../actions/master-screener-edit';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_RADIO_DIRECTIVES } from '@angular2-material/radio';
import {
  MdUniqueSelectionDispatcher
} from '@angular2-material/core/coordination/unique-selection-dispatcher';



import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'preview-question',
  template: `
    <h4> Preview "main" question </h4>
    <gen-ycb-question [question]="question" [controls]="false"></gen-ycb-question>
    <br><br><br><br><br>
    
    <h4> Preview in progress "expandable question"</h4>
    <gen-ycb-question 
      *ngIf="question.type === 'expandable'"
      [question]="expandableQuestion" 
      [controls]="false">
    </gen-ycb-question>
  `,
  directives: [GenYcbQuestion]
})
class PreviewQuestion{
  @Input() question: any
  @Input() expandableQuestion: any
}



@Component({
  selector: 'new-question',
  template: `
  <div>
    <h3> Question Label </h3>
    <md-input placeholder="enter label" [(ngModel)]="label" (change)="labelChange()"></md-input>
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
    
    <div *ngIf="expandable === 'no'">
      <h3> Input Type </h3>
      <md-radio-group name="question_controlType" [(ngModel)]="controlType" (change)="controlTypeChange()">
        <div *ngFor="let type of controlTypes">
          <md-radio-button  name="questionTypeOptions" [value]="type">
            {{type}}
          </md-radio-button>
          <br>
        </div>
      </md-radio-group>
      <div *ngIf="controlType === 'radio'">
        <br>
        <div class="flex flex-column">
          <strong> Add Options </strong>
          <md-input placeholder="enter option" [(ngModel)]="newOption"></md-input>
          <button md-raised-button color="primary" (click)="addOption()">ADD OPTION</button>
        </div>
        <br>
        <div class="flex flex-column">
          <strong> Remove Option </strong>
          <div *ngFor="let option of options" style="color:blue;" (click)="removeOption(option)">
            {{option}}
          </div>
        </div>
      </div>
      <br><br>
    </div>
    
    <div *ngIf="expandable === 'yes'">
      <i>This section represents the current expandable question you're working on </i>
      <h3> Question Label </h3>
      <md-input placeholder="enter label" [(ngModel)]="expandableLabel" (change)="expandablelabelChange()"></md-input>
      <br>
      <h3> Input Type </h3>
      <md-radio-group 
        name="expandable_question_controlType" 
        [(ngModel)]="expandableControlType" 
        (change)="expandableControlTypeChange()">
        <div *ngFor="let type of controlTypes">
          <md-radio-button  name="questionTypeOptions" [value]="type">
            {{type}}
          </md-radio-button>
          <br>
        </div>
      </md-radio-group>
      <div *ngIf="expandableControlType === 'radio'">
        <br>
        <div class="flex flex-column">
          <strong> Add Options </strong>
          <md-input placeholder="enter option" [(ngModel)]="expandableNewOption"></md-input>
          <button md-raised-button color="primary" (click)="addExpandableOption()">ADD OPTION</button>
        </div>
        <br><br>
        <div class="flex flex-column">
          <strong> Remove Option </strong>
          <div *ngFor="let option of expandableOptions" style="color:blue;" (click)="removeExpandableOption(option)">
            {{option}}
          </div>
        </div>
        <br><br>
      </div>
      <button md-raised-button 
        color="primary" 
        (click)="pushExpandableQuestion()"
        *ngIf="expandableControlType !== ''">PUSH EXPANDABLE QUESTION</button>
    </div>
  
    
    
  </div>
  `,
  providers: [MdUniqueSelectionDispatcher],
  directives: [MD_RADIO_DIRECTIVES, MD_INPUT_DIRECTIVES, MD_BUTTON_DIRECTIVES]
})
class QuestionInput implements OnInit{
  typeSub: Subscription
  
  // is main question expandable
  expandable: string = '';
  questionTypes = [
    'no',
    'yes'
  ]
  
  // label for main question
  label: string = '';
  
  // control type for main question
  controlType: string = '';
  controlTypes = [
    'radio',
    'textbox'
  ]
  
  // options used if control type for main question is 'radio'
  newOption: string = '';
  options: string[] = [];
  
  /* expandable question area */
  expandableQuestions = [];
  expandableLabel = '';
  expandableControlType = '';
  expandableNewOption = '';
  expandableOptions = [];
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.typeSub = this.store.select('masterScreenerEdit')
                   .map( (msStoreEdit:any) => msStoreEdit.editQuestion)
                   .subscribe( editQuestion => {
                     if(editQuestion.type === 'expandable'){
                       this.expandable = 'yes';
                     } else {
                       this.expandable = 'no';
                     }
                     
                     this.label = editQuestion.label;
                     this.controlType = editQuestion.controlType
                   });
    this.typeSub.unsubscribe();
  }
  
  labelChange(){
    this.store.dispatch({type: MasterScreenerEditActions.EDIT_QUESTION_LABEL, payload: this.label});
  }
  
  expandablelabelChange(){
    this.store.dispatch({type: MasterScreenerEditActions.EDIT_EXPANDABLE_QUESTION_LABEL, payload: this.expandableLabel});
  }
  
  expandableControlTypeChange(){
    this.store.dispatch(
      { 
        type: MasterScreenerEditActions.SET_EXPANDABLE_CONTROL_TYPE, 
        payload: this.expandableControlType
      }
    );
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
  
  addExpandableOption(){
    if(this.expandableControlType === 'radio' && this.expandableOptions.indexOf(this.expandableNewOption) === -1){
      this.store.dispatch({type: MasterScreenerEditActions.ADD_EXPANDABLE_OPTION, payload: this.expandableNewOption})
      this.expandableOptions.push(this.expandableNewOption);
      this.expandableNewOption = '';
    }
  }
  
  addOption(){
    if(this.controlType === 'radio' && this.expandableOptions.indexOf(this.newOption) === -1){
      this.store.dispatch({type: MasterScreenerEditActions.ADD_OPTION, payload: this.newOption})
      this.options.push(this.newOption);
      this.newOption = '';
    }
  }
  
  removeOption(option){
    const index = this.options.indexOf(option);
    if(index >= 0){
      this.options.splice(index, 1);
      this.store.dispatch({type: MasterScreenerEditActions.REMOVE_OPTION, payload: index});
    }
    
  }
  
  removeExpandableOption(option){
    const index = this.expandableOptions.indexOf(option);
    if(index >= 0){
      this.expandableOptions.splice(index, 1);
      this.store.dispatch({type: MasterScreenerEditActions.REMOVE_EXPANDABLE_OPTION, payload: index});
    }
  }
  
  controlTypeChange(){
    this.store.dispatch({type: MasterScreenerEditActions.SET_CONTROL_TYPE, payload: this.controlType})
  }
  
  pushExpandableQuestion(){
    this.expandableQuestions = [];
    this.expandableLabel = '';
    this.expandableControlType = '';
    this.expandableNewOption = '';
    this.expandableOptions = [];
    this.store.dispatch({type: MasterScreenerEditActions.PUSH_EXPANDABLE_QUESTION})
  }
}


@Component({
  selector: 'ms-new-tab',
  template: `
  <div class="flex" style="height:90vh;width:80vw;margin-left:2vw;margin-top:2vh">
    
    <section style="width:40vw; height:100%;">
      <new-question></new-question>
    </section>
    
    <section style="width:40vw; padding-left:2vw; height:100%;">
      <preview-question 
        [question]="question$ | async"
        [expandableQuestion]="expandableQuestion$ | async">
      </preview-question>
    </section>
  </div>
  `,
  directives: [QuestionInput, PreviewQuestion]
})
export class MsNewTab implements OnInit {
  question$: any
  expandableQuestion$: any
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.question$ = this.store.select('masterScreenerEdit')
                     .map( (msEdit:any) => msEdit.editQuestion)
                     
     this.expandableQuestion$ = this.store.select('masterScreenerEdit')
                                .map( (msEdit:any) => msEdit.expandableQuestion)
  }
}