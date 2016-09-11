import { Component, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import 'rxjs/add/operator/map'
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { KeyActions, MasterScreenerEditActions } from '../../../actions';

@Component({
  selector: 'key-overview',
  template: `
    <div class="flex flex-column" style="width:100%;">
      <md-card style="width:85%; margin-left:10%; margin-top:2%; height:200vh;">
        <md-card-title>Question Keys</md-card-title>
        <md-card-subtitle>Inspect, edit and add question keys here</md-card-subtitle> 
        <md-card-content>
          <md-card-title> Active Keys </md-card-title>
          <md-card-subtitle> These are the currently used keys </md-card-subtitle> 
          <md-card-content style="width:50%"> 
            <div>
              <table style="width:100%">
                <tr>
                  <th>id</th>
                  <th>type</th> 
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                <tr *ngFor="let key of (keys$ | async)">
                  <td *ngIf="key.questionKey != null">{{key.id}}</td>
                  <td *ngIf="key.questionKey != null">{{key.type}}</td> 
                  <td *ngIf="key.questionKey != null"> 
                    <button 
                      md-raised-button 
                      color="primary"
                      (click)="goToEdit(key)"> 
                      EDIT 
                    </button>
                  </td>
                  <td *ngIf="key.questionKey != null"> 
                    <button md-raised-button (click)="delete(key)"> DELETE </button> 
                  </td>
                  <td *ngIf="key.questionKey != null"> 
                    <button md-raised-button (click)="viewQuestion(key.questionKey)"> QUESTION </button> 
                  </td> 
                </tr>
              </table>
            </div>
            <hr>
            <div> 
              <md-card-title> Unused Keys </md-card-title>
              <md-card-subtitle> These are the unused keys </md-card-subtitle> 
              <table style="width:100%">
                <tr>
                  <th>id</th>
                  <th>type</th> 
                </tr>
                <tr *ngFor="let key of (keys$ | async)">
                  <td *ngIf="key.questionKey == null">{{key.id}}</td>
                  <td *ngIf="key.questionKey == null">{{key.type}}</td> 
                  <td *ngIf="key.questionKey == null"> 
                    <button 
                      md-raised-button 
                      color="primary"
                      (click)="goToEdit(key)"> 
                        EDIT 
                    </button>
                  </td>
                  <td *ngIf="key.questionKey == null"> 
                    <button md-raised-button (click)="delete(key)"> DELETE </button> 
                  </td>
                </tr>
              </table>
            </div>
            <hr>
          </md-card-content>
        </md-card-content>
        <md-card-actions>
          <a [routerLink]="['/editor/keys/add']">
            <button button md-raised-button color="primary">ADD KEY</button>
          </a>
        </md-card-actions>
      </md-card>
    </div>
  `,
  directives: [MD_CARD_DIRECTIVES,MD_BUTTON_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class KeyOverview implements OnInit{
  private keys$: any;
  private questions$: any;
  
  ngOnInit(){
    this.keys$ = this.store.select('keys').map( (store:any) => store.keys)
    
    this.questions$ = this.store.select('masterScreener').map( (store:any) => store.data.questions)
  }
  
  constructor(private store: Store<AppState>, private router: Router){}
  
  goToEdit(key){
    this.store.dispatch({
      type: KeyActions.SET_EDIT_KEY,
      payload: key
    })
    this.router.navigate(['/editor/keys/edit']);
  }
  
  delete(key){
    this.store.dispatch({
      type: KeyActions.DELETE_KEY,
      payload: key
    })
  }
  
  viewQuestion(questionKey){
    this.store.dispatch({
      type: MasterScreenerEditActions.SET_INSPECT_QUESTION,
      payload: questionKey
    })
    this.router.navigate(['/editor/keys/preview-question'])
  }
}