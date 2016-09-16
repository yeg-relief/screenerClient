import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { Key } from '../../../models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { AddProgramActions } from '../../../actions';
import { AddProgramState } from '../../../reducers/add-program';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Component({
  selector: 'remove-keys',
  template: `
    <md-card>
      <md-card-title class="center"> PROGRAM KEYS </md-card-title>
      <md-card-content class="flex flex-column">
        <div *ngIf="(programKeys$ | async).length > 0">
          <md-card-subtitle class="center">keys associated with program</md-card-subtitle>
          <table class="table-light overflow-hidden bg-white border rounded">
            <thead class="bg-darken-1">
              <tr>
                <th>id</th> <th>type</th> <th>remove</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let key of (programKeys$ | async)"> 
                <td>{{key.id}}</td> 
                <td>{{key.type}}</td> 
                <md-checkbox [checked]="false" (change)="stageRemoval($event, key)"></md-checkbox>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="(programKeys$ | async).length === 0">
          <md-card-subtitle class="center"> There are 0 keys associated with this program </md-card-subtitle>
        </div>
        
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="toggleDisplay()">add</button>
          <button class="ml1" *ngIf="selectedKeys.length > 0" md-raised-button color="primary" (click)="removeKeys()">remove</button>
        </md-card-actions>
     </md-card-content>
   </md-card>
  `,
  directives: [
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_CHECKBOX_DIRECTIVES
  ]
})
export class RemoveKeys{
  @Output() onToggleDisplay = new EventEmitter<boolean>();
  programKeys$: Observable<Key[]>;
  selectedKeys = new Array<Key>();
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.programKeys$ = this.store.select('addProgram')
                        .map( (addProgram:AddProgramState) => addProgram.programKeys)
  }
   
  stageRemoval($event, key){
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
  
  removeKeys(){
    if(this.selectedKeys.length > 0){
      this.store.dispatch({
        type: AddProgramActions.REMOVE_PROGRAM_KEYS, 
        payload: [].concat(this.selectedKeys)
      })
      this.selectedKeys = new Array<Key>();
    }
  }
  
  toggleDisplay(){
    this.onToggleDisplay.emit(true);
  }
}
