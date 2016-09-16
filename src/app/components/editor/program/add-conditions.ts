import { Component, Output, EventEmitter, OnInit  } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { Key, GeneralCondition } from '../../../models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AddProgramActions } from '../../../actions';
import { AddProgramState } from '../../../reducers/add-program';
import { MD_RADIO_DIRECTIVES } from '@angular2-material/radio';
import {
  MdUniqueSelectionDispatcher
} from '@angular2-material/core/coordination/unique-selection-dispatcher';


@Component({
  selector: 'add-conditions',
  template: `
    <md-card>
      <md-card-title class="center"> Add Condition </md-card-title>
      <md-card-actions class="ml2">
        <md-checkbox [checked]="showFreeConditions" (change)="toggleFreeKeyDisplay()">
          show free keys
        </md-checkbox>
      </md-card-actions>
      <md-card-content class="flex flex-column">
        <div *ngIf="(freeKeys$ | async).length > 0 && showFreeConditions">
          <md-card-subtitle class="center">keys available to constrain</md-card-subtitle>
          <table class="table-light overflow-hidden bg-white border rounded">
            <thead class="bg-darken-1">
              <tr>
                <th>key</th> <th>type</th> <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let key of (freeKeys$ | async) " class="py1"> 
                <td>{{key.id}}</td> 
                <td>{{key.type}}</td>
                <td>
                  <button md-button  (click)="constrainKey(key)">select</button>
                </td> 
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="(freeKeys$ | async).length === 0 && showFreeConditions">
          <md-card-subtitle class="center"> All program keys are constrained </md-card-subtitle>
        </div>
        
        <md-card class="mt2" *ngIf="selectedKey !== null">
          <md-card-title class="center mt1"> 
            constrain {{selectedKey.id}} of type: {{selectedKey.type}} 
          </md-card-title>
          <div class="center" [ngSwitch]="selectedKey.type">
          
            <!-- NUMBER KEY TYPE --> 
            <md-input  
              *ngSwitchCase="'number'" 
              placeholder="enter number"
              [(ngModel)]="constraintSettings.number.value"> 
            </md-input>
            
            <!-- STRING KEY TYPE --> 
            <md-input 
              *ngSwitchCase="'string'" 
              placeholder="enter text"
              [(ngModel)]="constraintSettings.string.value"> 
            </md-input>
              
            <!-- BOOLEAN KEY TYPE --> 
            <md-radio-group [(ngModel)]="constraintSettings.boolean.value" *ngSwitchCase="'boolean'">
              <md-radio-button value="true">true</md-radio-button>
              <md-radio-button value="false">false</md-radio-button>
            </md-radio-group>
            
            <!-- MALFORMED KEY --> 
            <md-card-title *ngSwitchDefault> No Key Type Found </md-card-title>
          </div>
          
        </md-card>
        
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="addCondition()">confirm</button>
          <button md-raised-button color="primary" (click)="toggleDisplay()">cancel</button>
        </md-card-actions>
     </md-card-content>
   </md-card>
  `, 
  directives: [
    MD_CARD_DIRECTIVES, 
    MD_BUTTON_DIRECTIVES,
    MD_CHECKBOX_DIRECTIVES, 
    MD_RADIO_DIRECTIVES, 
    MD_INPUT_DIRECTIVES
  ], 
  viewProviders: [MdUniqueSelectionDispatcher]
})
export class AddConditions implements OnInit{
  @Output() onToggleDisplay = new EventEmitter<boolean>();
  conditions$: Observable<GeneralCondition[]>;
  freeKeys$: Observable<Key[]>;
  showFreeConditions = true;
  selectedKey: Key = null;
  
  constraintSettings = this.setConstraintSettings();
 
  
  constructor(private store: Store<AppState>){};
  
  
  ngOnInit(){
    this.conditions$ = this.store.select('addProgram')
                       .map( (addProgram:AddProgramState) => addProgram.conditions)
                       
    this.freeKeys$ = this.store.select('addProgram')
                     .map( (addProgram:AddProgramState) => addProgram.freeKeys)
  }
  
  setConstraintSettings(){
    return {
      number: {
        value: '',
        qualifier: ''
      }, 
      boolean: {
        value: false
      },
      string: {
        value: ''
      }
    }
  }
  
  constrainKey(key:Key){
    this.selectedKey = key;
    this.constraintSettings = this.setConstraintSettings();
  }
  
  toggleFreeKeyDisplay(){
    this.showFreeConditions = !this.showFreeConditions;
  }
  
  toggleDisplay(){
    this.constraintSettings = this.setConstraintSettings();
    this.onToggleDisplay.emit(true);
  }
  
  addCondition(){
    const payload = {
      key: this.selectedKey,
    }
    
    switch(this.selectedKey.type){
      case 'number': {
        (<any>Object).assign(payload, {
          condition: {
            concreteCondition: {
              value: this.constraintSettings.number.value,
              qualifier: this.constraintSettings.number.qualifier,
              keyID: this.selectedKey.id
            }, 
            type: 'number'
          }
        })
      };
      break;
      
      case 'boolean': {
        (<any>Object).assign(payload, {
          condition: {
            concreteCondition: {
              value: this.constraintSettings.boolean.value, 
              keyID: this.selectedKey.id
            }, 
            type: 'boolean'
          }
        })
      };
      break;
      
      case 'string': {
        (<any>Object).assign(payload, {
          condition: {
            concreteCondition: {
              value: this.constraintSettings.string.value,
              keyID: this.selectedKey.id
            },
            type: 'string'
          }
        })
      };
      break;
      
      default: {
        console.log(`malformed key id: ${this.selectedKey.id}, type: ${this.selectedKey.type}`)
      } 
    }
    
    this.store.dispatch({
      type: AddProgramActions.CONSTRAIN_KEY,
      payload: payload
    })
    
    this.onToggleDisplay.emit(true);
    
  }
}