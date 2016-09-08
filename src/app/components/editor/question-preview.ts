import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { GenYcbQuestion } from '../question';

@Component({
  template: `
    <gen-ycb-question
      [question] = "previewQuestion$ | async"
      [controls] = "false">
    </gen-ycb-question>
  `,
  directives: [GenYcbQuestion]
})
export class QuestionPreview implements OnInit{
  previewQuestion$: any;
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
   this.previewQuestion$ = this.store.select('masterScreenerEdit').map( (store:any) => store.previewQuestion)
  }
  
}