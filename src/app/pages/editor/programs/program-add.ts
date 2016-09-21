import { Component, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { AddProgramActions } from '../../../actions';
import { 
  DetailDisplay, EditDetails,  
  RemoveConditions, AddConditions 
} from '../../../components';
import { AddProgramState } from '../../../reducers/add-program';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
      <md-card-actions class="ml2 mr2  bg-darken-1">
        <div class="ml1 mr1 p1">
          <md-checkbox [checked]="showDetails" (change)="expandDetails($event)">
            show program details
          </md-checkbox>
          <md-checkbox [checked]="showConditions" (change)="expandConditions($event)" class="ml1">
            show condition details
          </md-checkbox>
        </div>
      </md-card-actions>
      
      <!-- upload or save program --> 
      <md-card-actions class="ml2 mr2 mb2 bg-darken-1">
        <div class="ml1 mr1 p1">
          <button 
           md-raised-button color="primary" 
           (click)="uploadProgram()"
           *ngIf="!(uploaded$ | async)">
            upload
          </button>
          <button 
           md-raised-button color="primary" 
           disabled
           *ngIf="(uploaded$ | async)">
            upload
          </button>
          
          <button disabled md-raised-button color="primary">save</button>
        </div>
      </md-card-actions>
      
      <md-card-content class="ml2 mr2 border bg-darken-1 mb1 mt1" style="boder-color:red">
        
      </md-card-content>
      
      
      <md-card-content>
        
        <!-- DETAILS -->
        <details-display
          *ngIf="displayDetails && !editDetails && showDetails" 
          (onToggleDisplay)="removeDetailsDisplay($event)">
        </details-display>
        <detail-editor 
          *ngIf="!displayDetails && editDetails && showDetails"
          (onToggleDisplay)="removeDetailsEdit($event)">
        </detail-editor>
        
        <div 
          class="mt2 mb2 border-top border-bottom bg-darken-1"
          *ngIf="showDetails && showConditions">
        </div>
        
        <!-- CONDITIONS -->
        <remove-conditions 
         *ngIf="!addConditions && removeConditions && showConditions"
         (onToggleDisplay)="removeConditionsDisplay($event)">
        </remove-conditions>
        <add-conditions 
          *ngIf="addConditions && !removeConditions && showConditions"
          (onToggleDisplay)="addConditionsDisplay($event)">
        </add-conditions>
      </md-card-content>
    </md-card>
  `,
  directives: [
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_CHECKBOX_DIRECTIVES,
    DetailDisplay, 
    EditDetails, 
    RemoveConditions, 
    AddConditions
  ]
})
export class ProgramAdd implements OnInit{
  // details display booleans
  showDetails = true;
  displayDetails = true;
  editDetails = false;
  
  
  // condition display booleans 
  showConditions = true;
  removeConditions = true;
  addConditions = false;
  
  uploaded$: Observable<boolean>;
  
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.store.dispatch({type: AddProgramActions.LOAD_KEYS})
    
    this.uploaded$ = this.store.select('addProgram')
                     .map( (addProgramState:AddProgramState) => addProgramState.uploadedProgram)
                     
    
  }
  
 
 
  expandDetails($event){
    this.showDetails = $event.checked;
  }
  

  expandConditions($event){
    this.showConditions = $event.checked;
  }
  
  
  
  removeDetailsDisplay($event){
    this.displayDetails = !$event;
    this.editDetails = $event;
  }
  
  removeDetailsEdit($event){
    this.displayDetails = $event;
    this.editDetails = !$event;
  }

  removeConditionsDisplay($event){
    this.addConditions = $event;
    this.removeConditions = !$event;
  }
  
  addConditionsDisplay($event){
    this.removeConditions = $event;
    this.addConditions = !$event;
  }
  
  uploadProgram(){
    this.store.dispatch({
      type: AddProgramActions.UPLOAD_PROGRAM
    })
  }
}
