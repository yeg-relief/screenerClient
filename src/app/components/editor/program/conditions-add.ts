import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { Key } from '../../../models';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

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
                <th>key</th> <th>type</th> <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let key of unassignedKeys " class="py1"> 
                <td>{{key.id}}</td> 
                <td>{{key.type}}</td>
                <td>
                  <button md-button  (click)="constrainKey(key)">select</button>
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
export class ProgramAddConditions implements OnInit, OnDestroy{
  @Input() programKeys: Key[];
  // this is an array, but build error occurs wrt the find call
  @Input() programConditions: any;
  @Input() addKeysSubject: Subject<Key[]>;
  @Output() conditionsConfirmed = new EventEmitter<boolean>();
  
  unassignedKeys: Key[] = new Array<Key>();
  newlyAdded: Subscription;
  
  pushConditions(){
    this.conditionsConfirmed.emit(true);
  }
  
  ngOnInit(){
    // find the keys that are unconstrained, ie in programKeys, but the keys are not in programConditions
    // these are the keys that are available to be constrained  
    this.programKeys.map( (key: Key) => {
      // if false then the key is not constrained 
      if(!this.find(key)){
        this.unassignedKeys.push(key);
      }
      
    })
    
    this.newlyAdded = this.addKeysSubject.subscribe(
      (keys:Key[]) => {
        keys.map( (key:Key) => {
          if(!this.find(key)){
            this.unassignedKeys.push(key);
          }
        })
        
      },
      (error) => console.log(error)
    ); 
    
    
  }
  
  ngOnDestroy(){
    this.newlyAdded.unsubscribe();
  }
  
  find(key:Key):boolean{
    const findKey = (condition:any):boolean => {
      return key.id === condition.condition.keyID;
    }
    
    this.programConditions.map( (condition:any) => {
      if(findKey(condition)){
        return true;
      }
    })
    return false;
  }
}