import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { GenYcbQuestion } from '../question';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MasterScreenerEditActions } from '../../actions';


@Component({
  selector: 'ms-preview-tab',
  template: `
    <md-card>
      <md-card-title>New Question Overview</md-card-title>
      <md-card-subtitle>
        <p>
          This section provides a full live preview of the new question
          and is where one can add the question to the <strong> master screener </strong> 
        </p> 
      </md-card-subtitle>
      <md-card-content>
        <gen-ycb-question [question]="question" [controls]="false"></gen-ycb-question>
        <br><br>
        <button md-raised-button color="primary">CLEAR QUESTION</button> 
        <button style="margin-left:2vw" 
          md-raised-button color="primary" 
          (click)="add(question)">
          ADD QUESTION
        </button> 
        <br><br>
        <p style="color:red">NOTE: these buttons are not implemented</p>
      </md-card-content>
    </md-card>
  `,
  directives: [GenYcbQuestion, MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES]
})
export class MsPreviewTab{
  @Input() question;
  
  constructor(private store: Store<AppState>){}
  
  add(question){
    this.store.dispatch({
      type: MasterScreenerEditActions.ADD_QUESTION_TO_SCREENER,
      payload: question
    })
  }
  
}