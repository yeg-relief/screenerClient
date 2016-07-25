import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { GenYcbQuestion } from '../question';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MasterScreenerEditActions } from '../../actions/master-screener-edit';
@Component({
  template: `
  <div style="width:80vw;margin-top:5vh;height:200vh;">
    <md-card>
      <md-card-title>Master Screener Edit Mode</md-card-title>
      <md-card-subtitle>delete, edit or reorder</md-card-subtitle>
      <md-card-content>
        <div class="flex flex-column flex-center" >
          <div *ngFor="let question of (questions$ | async)" 
            style="margin-left:15%;margin-right:15%;width:70%">
            <md-card style="background-color:lightblue">
              <md-card-content>
                <gen-ycb-question [question]="question" [controls]="false"></gen-ycb-question>
              </md-card-content>
              <md-card-actions>
                <button md-button>EDIT</button>
                <button md-button (click)="deleteQuestion(question)">DELETE</button>
              </md-card-actions>
            </md-card>
            <br><br>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </div>
  `,
  directives: [GenYcbQuestion, MD_CARD_DIRECTIVES,MD_BUTTON_DIRECTIVES]
})
export class MasterScreenerEdit implements OnInit{
  questions$ 
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.questions$ = this.store.select('masterScreenerEdit')   
                      .map( (msEdit:any) => msEdit.data.questions); 
  }
  
  deleteQuestion(question:any){
    this.store.dispatch({type: MasterScreenerEditActions.DELETE_QUESTION, payload:question})
  }
}