import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Key } from '../../../models';

import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';

@Component({
  selector: 'key-add',
  template: `
    <md-card>
      <md-card-title class="center"> KEYS </md-card-title>
      <md-card-content class="flex flex-column">
        <div *ngIf="availableKeys.length > 0">
          <md-card-subtitle class="center">keys available to associate with the program</md-card-subtitle>
          <table class="table-light overflow-hidden bg-white border rounded">
            <thead class="bg-darken-1">
              <tr>
                <th>id</th> <th>type</th> <th>add key</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let key of availableKeys "> 
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
        
        <div *ngIf="availableKeys.length === 0">
          <md-card-subtitle class="center"> There are no available keys to associate</md-card-subtitle>
        </div>
        
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="addKeys()">add</button>
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
export class ProgramKeyAdd implements OnInit{
  
  @Input() programKeys: Key[];
  @Output() saveKeys = new EventEmitter<Key[]>();
  
  keys$: Observable<Key>;
  availableKeys: Key[] = new Array<Key>();
  
  stagingKeys: Key[] = new Array<Key>();
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.keys$ = this.store.select('keys').map( (store:any) => store.keys);
    
    
    
    const sub = this.keys$ 
                .map( (storeKeys: any):Key[] => {
                  const freeKeys = new Array<Key>();
                  storeKeys.map( (key:Key) => {
                    const findFunction = (programKey:Key):boolean => {
                      return programKey.id === key.id;
                    }
                    let push = true;
                    for(let i = 0; i < this.programKeys.length; i++){
                      if(findFunction(this.programKeys[i])){
                        push = false;
                        break;
                      }
                    }
                    if(push){freeKeys.push(key)}
                  })
                  return freeKeys;
                }).subscribe(
                  (freeKeys: Key[]) => {
                    freeKeys.map( (key:Key) => this.availableKeys.push(key))
                  }, 
                  (error) => console.log(error)
                )
    
    sub.unsubscribe();
  }
  
  addKeys(){
    this.saveKeys.emit(this.stagingKeys);
  }
  
  stageKey($event, key){
    if($event.checked){
      this.stagingKeys.push(key);
    } else {
      const index = this.stagingKeys.indexOf(key);
      this.stagingKeys.splice(index, 1);
    }
  }
}