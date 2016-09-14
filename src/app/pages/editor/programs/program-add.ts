import { Component, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Key } from '../../../models';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { 
  EditProgramMeta, DisplayProgramMeta, ProgramKeyDisplay,
  ProgramKeyAdd, ProgramConditionsDisplay, ProgramAddConditions 
} from '../../../components';

@Component({
  template: `
    <md-card 
      style="width:65vw; 
             margin-left:5vw; 
             margin-top:2%;  
             margin-right:5vw; 
             background-color:lightyellow;
             min-height:100vh"
         
       class="flex flex-column flex-grow">
      <md-card-title> ADD PROGRAM </md-card-title>
      <md-card-subtitle> Create a new program </md-card-subtitle>
      <md-card-content class="ml2">
        <md-card-actions> 
          <md-checkbox [(ngModel)]="expandMetaData">show meta data</md-checkbox> 
          <md-checkbox class="ml1" [(ngModel)]="expandProgramKeys">show program keys</md-checkbox>
          <md-checkbox class="ml1" [(ngModel)]="expandProgramConditions">show program conditions</md-checkbox>
        </md-card-actions>
        <md-card-actions>
          <button md-raised-button color="primary">upload</button>
        </md-card-actions>
        
        <!-- METADATA -->
        
        <program-metadata-editor 
          [program]="programDetails" 
          (onSave)="saveMetaData()"
          *ngIf="editProgramMetaData && expandMetaData">
        </program-metadata-editor>
        <program-metadata-display
          [program]="programDetails"
          (toggleEdit)="toggleEditMeta()"
          *ngIf="!editProgramMetaData && expandMetaData">
        </program-metadata-display>
        
        
        <!-- KEYS --> 
        
        <key-display 
          [programKeys]="programKeys" 
          *ngIf="expandProgramKeys && !editProgramKeys"
          (toggleAdd)="displayAddKey()"
          class="mt2">
        </key-display>
        
        <key-add
          [programKeys]="programKeys"
          *ngIf="expandProgramKeys && editProgramKeys"
          (saveKeys)="saveKeys($event)"
          class="mt2">
        </key-add>
        
        
        <!-- CONDITIONS --> 
        
        <conditions-display
          *ngIf="expandProgramConditions && !editConditions"
          [programConditions] = "programConditions"
          (toggleDisplay)="toggleConditionsEdit()">
        </conditions-display>
        
        <conditions-add 
          *ngIf="expandProgramConditions && editConditions"
          [programConditions] = "programConditions"
          [programKeys] = "programKeys"
          (conditionsConfirmed)="confirmedConditions()">
        </conditions-add>
        
      </md-card-content>
    </md-card>
  `,
  directives: [
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_CHECKBOX_DIRECTIVES,
    EditProgramMeta,
    DisplayProgramMeta,
    ProgramKeyDisplay,
    ProgramKeyAdd, 
    ProgramConditionsDisplay, 
    ProgramAddConditions
  ]
})
export class ProgramAdd implements OnInit{
  // all available keys
  keys$: Observable<Key[]>
  
  //booleans for edit state 
  editProgramMetaData: boolean = false; 
  expandMetaData: boolean = true;
 
  expandProgramKeys: boolean = false;
  editProgramKeys: boolean = false;
  
  expandProgramConditions: boolean = false;
  editConditions: boolean = false;
  
  // object containing program details -- reference models/programs.Program
  // local model using push state to reducer only upon submit 
  programDetails = {
    title: '',
    details: '',
    link: ''
  }
  
  programKeys: Key[] = new Array<Key>();
  
  programConditions = new Array<any>();
  
  constructor(private store: Store<AppState>){}
  
  saveMetaData(){
    this.editProgramMetaData = false;
  }
  
  saveKeys(keys){
    this.programKeys = this.programKeys.concat(keys);
    this.editProgramKeys = false;
  }
  
  toggleEditMeta(){
    this.editProgramMetaData = true;
  }
  
  displayAddKey(){
    this.editProgramKeys = true;
  }
  
  toggleConditionsEdit(){
    this.editConditions = true;
  }
  
  confirmedConditions(){
    this.editConditions = false;
  }
  
  ngOnInit(){
    this.keys$ = this.store.select('keys').map( (store:any) => store.keys)
  }
}
