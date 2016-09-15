import { Component, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { AddProgramActions } from '../../../actions';
import { DetailDisplay, EditDetails } from '../../../components';


@Component({
  template: `
    <md-card 
      style="width:65vw; 
             margin-left:5vw; 
             margin-top:2%;  
             margin-right:5vw; 
             background-color:lightyellow;
             min-height:100vh">
      <md-card-title class="center"> CREATE A PROGRAM </md-card-title>
      <md-card-subtitle class="center mb1"> create a new benefit program </md-card-subtitle>  
      
      <!-- expand or hide input and display sections -->
      <md-card-actions class="ml2">
        <md-checkbox [checked]="showDetails" (change)="expandDetails($event)">show program details</md-checkbox>
      </md-card-actions>
      <md-card-content>
        
        <!-- DETAILS -->
        <details-display
          *ngIf="displayDetails && !editDetails && showDetails" 
          (hideDetails)="hideDetails()">
        </details-display>
        
        <detail-editor 
          *ngIf="!displayDetails && editDetails && showDetails"
          (onSave)="saveDetails()">
        </detail-editor>
      </md-card-content>
    </md-card>
  `,
  directives: [
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_CHECKBOX_DIRECTIVES,
    DetailDisplay, 
    EditDetails
  ]
})
export class ProgramAdd implements OnInit{
  showDetails = false;
  displayDetails = true;
  editDetails = false;
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.store.dispatch({type: AddProgramActions.LOAD_KEYS})
  }
  
  hideDetails(){
    this.displayDetails = false;
    this.editDetails = true;
  }
  
  saveDetails(){
    this.displayDetails = true;
    this.editDetails = false;
  }
  
  expandDetails($event){
    this.showDetails = $event.checked;
  }
}
