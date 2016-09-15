import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { ProgramDetails } from '../../../models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { AddProgramActions } from '../../../actions';
import { AddProgramState } from '../../../reducers/add-program';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'details-display',
  template: `
    <md-card>
      <md-card-title class="center"> Program Details </md-card-title>
      <md-card-content class="flex flex-column">
      
        <!-- PROGRAM DETAILS TITLE -->
        <div 
          *ngIf="(details$ | async).title.length > 0"
          class="p1 m1 border bg-darken-1">
          {{ (details$ | async).title }}
        </div>
        <div 
          *ngIf="(details$ | async).title.length === 0"
          class="p1 m1 border bg-darken-1">
          <p>no program title found</p>
        </div>
        
        
        <!-- PROGRAM DETAILS DESCRIPTION -->
        <div 
          *ngIf="(details$ | async).description.length > 0"
          class="p1 m1 border bg-darken-1">
          {{ (details$ | async).description }}
        </div>
        <div 
          *ngIf="(details$ | async).description.length === 0"
          class="p1 m1 border bg-darken-1">
          <p>no program description found</p>
        </div>
        
        
        <!-- PROGRAM DETAILS LINK -->
        <div 
          *ngIf="(details$ | async).link.length > 0"
          class="p1 m1 border bg-darken-1">
          {{ (details$| async).link  }}
        </div>
        <div 
          *ngIf="(details$ | async).link.length === 0"
          class="p1 m1 border bg-darken-1">
          <p>no external link to program found</p>
        </div>
        
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="hide()">edit</button>
        </md-card-actions >
      </md-card-content>
    </md-card>
  `,
  directives: [
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES
  ]
})
export class DetailDisplay implements OnInit{
  @Output() hideDetails = new EventEmitter<boolean>();
  details$: Observable<ProgramDetails>;
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.details$ = this.store.select('addProgram')
                    .map( (addProgram:AddProgramState) => addProgram.details)
  }
  
  hide(){
    this.hideDetails.emit(true);
  }
}