import { Component, OnInit, Input } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { MasterScreenerActions } from '../actions/index';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon/icon';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'ms-controls',
  template:`
  <div [ngSwitch]="width">
    <div *ngSwitchCase="'LARGE'" class="flex-column" style="margin-left:25%;margin-right:25%;width:50%;">
      <div>
        <button md-raised-button color="primary" (click)="previous()">PREVIOUS</button>
        <a [routerLink]="['/master-screener-results']">
          <button md-raised-button color="primary">SUBMIT</button>
        </a>
        <button md-raised-button color="primary" (click)="next()">NEXT</button>
      </div>
      <div> 
        <span> Question {{currentIndex$ | async}} of {{questionsLength$ | async}}</span>
      </div>
    </div>
    
    <div *ngSwitchDefault class="flex-column" style="margin-left:25%;margin-right:25%;width:50%;">
      <div>
        <button md-mini-fab (click)="previous()">
          <md-icon class="md-24">skip_previous</md-icon>
        </button>
        <a [routerLink]="['/master-screener-results']">
          <button md-mini-fab>
            <md-icon class="md-24">done</md-icon>
          </button>
        </a>
        <button md-mini-fab (click)="next()">
          <md-icon class="md-24">skip_next</md-icon>
        </button>
      </div>
      <div> 
        <span> Question {{currentIndex$ | async}} of {{questionsLength$ | async}}</span>
      </div>
    </div>
  </div>
  `,
  styles: [``], 
  viewProviders: [MdIconRegistry],
  directives: [MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, MdIcon, ROUTER_DIRECTIVES]
})
export class MsControls implements OnInit{
  @Input() width: any;
  
  payload$: Observable<any>
  currentIndex$: Observable<any>
  questionsLength$: Observable<any>
  
  constructor(private store: Store<AppState>) {}
  
  ngOnInit(){
    this.payload$ = this.store.select('masterScreener')
                    .map( (msState:any) => msState.data.payload)

    this.currentIndex$ = this.store.select('masterScreener')
                         .map( (msState:any) => msState.currentIndex + 1)
     
     this.questionsLength$ = this.store.select('masterScreener')
                             .map( (msState:any) => msState.data.questions.length)                    
  }
 
  next(){
    this.store.dispatch({type: MasterScreenerActions.NEXT_QUESTION});
  }
  
  previous(){
    this.store.dispatch({type: MasterScreenerActions.PREVIOUS_QUESTION});
  }
}