import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { Key } from '../../../models';

@Component({
  selector: 'key-display',
  template: `
    <md-card>
      <md-card-title class="center"> PROGRAM KEYS </md-card-title>
      <md-card-content class="flex flex-column">
        <div *ngIf="programKeys.length > 0">
          <md-card-subtitle class="center">keys associated with program</md-card-subtitle>
          <table class="table-light overflow-hidden bg-white border rounded">
            <thead class="bg-darken-1">
              <tr>
                <th>id</th> <th>type</th> <th>remove</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let key of programKeys"> 
                <td>{{key.id}}</td> 
                <td>{{key.type}}</td> 
                <md-checkbox [checked]="false" (change)="stageRemoval($event, key)"></md-checkbox>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="programKeys.length === 0">
          <md-card-subtitle class="center"> There are 0 keys associated with this program </md-card-subtitle>
        </div>
        
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="addKey()">add</button>
          <button class="ml1" *ngIf="stagedRemoval.length > 0" md-raised-button color="primary" (click)="removeKeys()">remove</button>
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
export class ProgramKeyDisplay{
  @Input() programKeys: Key[];
  @Output() toggleAdd = new EventEmitter<boolean>();
  
  stagedRemoval: Key[] = new Array<Key>();
  
  addKey(){
    this.toggleAdd.emit(true);
  }
  
  stageRemoval($event, key){
    if($event.checked === true){
      this.stagedRemoval.push(key);
    } else {
      const index = this.stagedRemoval.indexOf(key);
      this.stagedRemoval.splice(index, 1);
    }
  }
  
  removeKeys(){
    this.stagedRemoval.map( (key:Key) => {
      const index = this.programKeys.indexOf(key);
      this.programKeys.splice(index, 1);
    })
  }
  
}
