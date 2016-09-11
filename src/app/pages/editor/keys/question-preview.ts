import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { GenYcbQuestion } from '../../../components/question';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';

@Component({
  template: `
  <md-card style="width:85%; margin-left:10%; margin-top:2%; height:95vh;">
    <md-card-title> QUESTION PREVIEW </md-card-title>
    <md-card-subtitle> This question is related to the key TODO: list key name here </md-card-subtitle>
    <md-card-subtitle> note: if this is an expandable question, the key may be related to a 'hidden' question.</md-card-subtitle>
    <gen-ycb-question
      [question] = "previewQuestion$ | async"
      [controls] = "false">
    </gen-ycb-question>
  </md-card>
  `,
  directives: [GenYcbQuestion, MD_CARD_DIRECTIVES]
})
export class QuestionPreview implements OnInit{
  previewQuestion$: any;
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
   this.previewQuestion$ = this.store.select('masterScreenerEdit').map( (store:any) => store.previewQuestion)
  }
  
}