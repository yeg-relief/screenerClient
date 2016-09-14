import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { Key } from '../../../models';

@Component({
  selector: 'conditions-add',
  template: `
    <md-card>
      <md-card-title class="center"> Conditions </md-card-title>
      <md-card-content class="flex flex-column">
        <div *ngIf="unassignedKeys.length > 0">
          <md-card-subtitle class="center">keys available to constrain</md-card-subtitle>
          <table class="table-light overflow-hidden bg-white border rounded">
            <thead class="bg-darken-1">
              <tr>
                <th>key</th> <th>type</th> <th>constrain</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let key of unassignedKeys " class="py1"> 
                <td>{{key.id}}</td> 
                <td>{{key.type}}</td>
                <td>
                  <button md-button (click)="constrainKey(key)"></button>
                </td> 
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="unassignedKeys.length === 0">
          <md-card-subtitle class="center"> All program keys are constrained </md-card-subtitle>
        </div>
        
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="pushConditions()">confirm changes</button>
        </md-card-actions>
     </md-card-content>
   </md-card>
  `, 
  directives: [
    MD_CARD_DIRECTIVES, 
    MD_BUTTON_DIRECTIVES
  ]
})
export class ProgramAddConditions implements OnInit{
  @Input() programKeys: Key[];
  // this is an array, but build error occurs wrt the find call
  @Input() programConditions: any;
  @Output() conditionsConfirmed = new EventEmitter<boolean>();
  
  unassignedKeys: Key[] = new Array<Key>();
  
  pushConditions(){
    this.conditionsConfirmed.emit(true);
  }
  
  ngOnInit(){
    // find the keys that are unconstrained, ie in programKeys, but the keys are not in programConditions
    // these are the keys that are available to be constrained  
    this.programKeys.map( (key: Key) => {
      // predicate to test if the key is constrained
      const findKey = (condition:any):boolean => {
        return key.id === condition.condition.keyID;
      }
      // if true then the key is not constrained 
      if(typeof this.programConditions.find(findKey) === 'undefined'){
        this.unassignedKeys.push(key);
      }
      
    })
  }
}