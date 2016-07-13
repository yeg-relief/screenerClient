import { Component, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { MasterScreenerActions } from '../actions/index';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Component({
  selector: 'ms-controls',
  template:`
    <div style="margin-left:20%;margin-right:20%;width:60%;boder:solid;">
      <button md-raised-button color="primary" (click)="submit()">SUBMIT</button>
      <button md-raised-button color="primary" (click)="next()">NEXT</button>
      <button md-raised-button color="primary" (click)="previous()">PREVIOUS</button>
      {{payload$ | async }}
    </div>
  `,
  styles: [``], 
  directives: [MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES]
})
export class MsControls implements OnInit{
  payload$: Observable<any>
  
  constructor(private store: Store<AppState>) {}
  
  ngOnInit(){
    this.payload$ = this.store.select('masterScreener')
        .map( (msState:any) => msState.data.payload)

  }
  
  submit(){
    this.store.dispatch({type: MasterScreenerActions.SUBMIT});
  }
  
  next(){
    this.store.dispatch({type: MasterScreenerActions.NEXT_QUESTION});
  }
  
  previous(){
    this.store.dispatch({type: MasterScreenerActions.PREVIOUS_QUESTION});
  }
}