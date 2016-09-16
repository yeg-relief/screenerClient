import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Key } from '../../../models';
import { AddProgramActions } from '../../../actions';
import { AddProgramState } from '../../../reducers/add-program';

import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';

@Component({
  selector: 'add-keys',
  template: `
    <md-card>
      <md-card-title class="center"> KEYS </md-card-title>
      <md-card-content class="flex flex-column">
        <div *ngIf="(freeKeys$ | async).length > 0">
          <md-card-subtitle class="center">keys available to associate with the program</md-card-subtitle>
          <table class="table-light overflow-hidden bg-white border rounded">
            <thead class="bg-darken-1">
              <tr>
                <th>id</th> <th>type</th> <th>add key</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let key of (freeKeys$ | async) "> 
                <td>{{key.id}}</td> 
                <td>{{key.type}}</td> 
                <td>
                  <md-checkbox 
                    [checked]="false" 
                    (change)="stageKey($event, key)">
                  </md-checkbox>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="(freeKeys$ | async).length === 0">
          <md-card-subtitle class="center"> There are no available keys to associate</md-card-subtitle>
        </div>
        
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="addKeys()">confirm</button>
          <button md-raised-button color="primary" (click)="toggleDisplay()">cancel</button>
        </md-card-actions >
     </md-card-content>
   </md-card>
  `, 
  directives: [
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES, 
    MD_CHECKBOX_DIRECTIVES
  ]
})
export class AddKeys{
  programKeys$: Observable<Key[]>;
  freeKeys$: Observable<Key[]>;
  // keys that are checked, but not removed (third table column)
  selectedKeys = new Array<Key>();
  
  @Output() onToggleDisplay = new EventEmitter<boolean>();
  
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.programKeys$ = this.store.select('addProgram')
                        .map( (addProgram:AddProgramState) => addProgram.programKeys)
                        
    this.freeKeys$ = this.store.select('addProgram')
                     .map( (addProgram:AddProgramState) => addProgram.freeKeys)
  }
  
  addKeys(){
    if(this.selectedKeys.length > 0){
      this.store.dispatch({
        type: AddProgramActions.ADD_PROGRAM_KEYS,
        payload: [].concat(this.selectedKeys)
      })
      this.selectedKeys = new Array<Key>();
    }
    this.onToggleDisplay.emit(true);
  }
  
  toggleDisplay(){
    this.onToggleDisplay.emit(true);
  }
  
  stageKey($event, key){
    const index = this.selectedKeys.indexOf(key);
    if($event.checked === true && index < 0){
      this.selectedKeys.push(key)
    } else if ($event.checked === false && index >= 0){
      this.selectedKeys.splice(index, 1);
    } else {
      // something funky is going on, ie, unchecked for removal but not in staged removal 
      console.log(`${key.id} is ${$event.checked} with index: ${index}`);
    }
  }
}