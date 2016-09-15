import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
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
        <div *ngIf="keys.length > 0">
          <md-card-subtitle class="center">keys available to associate with the program</md-card-subtitle>
          <table class="table-light overflow-hidden bg-white border rounded">
            <thead class="bg-darken-1">
              <tr>
                <th>id</th> <th>type</th> <th>add key</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let key of keys "> 
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
        
        <div *ngIf="keys.length === 0">
          <md-card-subtitle class="center"> There are no available keys to associate</md-card-subtitle>
        </div>
        
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="addKeys()">confirm</button>
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
export class ProgramKeyAdd{
  @Input() programKeys: Subject<Key[]>;
  @Input() keys: Subject<Key[]>;
  // keys that are checked, but not removed (third table column)
  selectedKeys = new Array<Key>();
  
  
  
}