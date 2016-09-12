import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { GenYcbQuestion } from '../../../components/question';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import 'rxjs/add/operator/map'

@Component({
  template: `
  <md-card style="width:85vh; width: 60vw; margin-left:10vw; margin-right: 10vw; margin-top:2%; height:95vh;">
    <md-card-title> QUESTION PREVIEW </md-card-title>
    <md-card-subtitle> These questions are associated with the following key: <strong>{{key$ | async}}</strong></md-card-subtitle>
    <md-card-subtitle> note: the key may be associated with a "hidden" question in the case of expandable questions </md-card-subtitle>
    <div style="margin-top: 3vh; margin-bottom: 3vh"></div>
    <div style="margin-bottom: 3vh" *ngFor=" let question of (previewQuestions$ | async)">
      <gen-ycb-question
        [question] = "question"
        [controls] = "false">
      </gen-ycb-question>
    </div>
  </md-card>
  `,
  directives: [GenYcbQuestion, MD_CARD_DIRECTIVES]
})
export class QuestionPreview implements OnInit{
  previewQuestions$: any;
  key$: any;
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
   this.previewQuestions$ = this.store.select('masterScreenerEdit').map( (store:any) => store.previewQuestions)
   this.key$ = this.store.select('masterScreenerEdit').map( (store:any) => store.previewQuestionKeyID)
  }
  
}