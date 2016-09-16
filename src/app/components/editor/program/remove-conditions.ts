import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { GeneralCondition } from '../../../models';
import { AddProgramActions } from '../../../actions';
import { AddProgramState } from '../../../reducers/add-program';


@Component({
  selector: 'remove-conditions', 
  template: `
    <md-card>
      <md-card-title class="center"> Conditions </md-card-title>
      <md-card-content class="flex flex-column">
        <div *ngIf="(conditions$ | async).length > 0">
          <md-card-subtitle class="center">conditions associated with this program</md-card-subtitle>
          <table class="table-light overflow-hidden bg-white border rounded">
            <thead class="bg-darken-1">
              <tr>
                <th>key</th> <th>type</th> <th>value</th> <th>qualifier</th> <th>remove</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let condition of (conditions$ | async) "> 
                <td>{{condition.concreteCondition.keyID}}</td> 
                <td>{{condition.type}}</td>
                <td>{{condition.concreteCondition.value}}</td> 
                <div *ngIf="condition.type === 'number'">
                  <div [ngSwitch]="condition.concreteCondition.qualifier">
                    <td *ngSwitchCase="'lessThan'">
                      LESS THAN
                    </td>
                    <td *ngSwitchCase="'equal'">
                      EQUAL
                    </td>
                    <td *ngSwitchCase="'greaterThan'">
                      GREATER THAN
                    </td>
                    <td *ngSwitchDefault>
                      ERROR: no qualifier
                    </td>
                  </div>
                </div>
                <div *ngIf="condition.type !== 'number'"> 
                  <td></td>
                </div>
                <td>
                  <md-checkbox [checked]="false" (change)="stageRemoval($event, condition)">
                  </md-checkbox>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="(conditions$ | async).length === 0">
          <md-card-subtitle class="center"> There are no conditions associated with this program </md-card-subtitle>
        </div>
        
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="toggleDisplay()">add</button>
          <button md-raised-button color="primary" class="ml1" (click)="removeConditions()">remove conditions</button>
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
export class RemoveConditions implements OnInit{
  @Output() onToggleDisplay = new EventEmitter<boolean>();
  conditions$: Observable<GeneralCondition[]>;
  selectedConditions = new Array<GeneralCondition>();
  
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.conditions$ = this.store.select('addProgram')
                       .map( (addProgram:AddProgramState) => addProgram.conditions)
  }
  
  removeConditions(){
    if(this.selectedConditions.length > 0){
      this.store.dispatch({
        type: AddProgramActions.REMOVE_CONDITIONS, 
        payload: [].concat(this.selectedConditions)
      })
      this.selectedConditions = new Array<GeneralCondition>();
    }
  }
  
  toggleDisplay(){
    this.onToggleDisplay.emit(true);
  }
  
  stageRemoval($event, condition){
    const index = this.selectedConditions.indexOf(condition);
    if($event.checked === true && index < 0){
      this.selectedConditions.push(condition)
    } else if ($event.checked === false && index >= 0){
      this.selectedConditions.splice(index, 1);
    } else {
      // something funky is going on, ie, unchecked for removal but not in staged removal 
      console.log(`${condition.details.title} is ${$event.checked} with index: ${index}`);
    }
  }
}