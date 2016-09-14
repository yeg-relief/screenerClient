import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';

@Component({
  selector: 'conditions-display', 
  template: `
    <md-card>
      <md-card-title class="center"> Conditions </md-card-title>
      <md-card-content class="flex flex-column">
        <div *ngIf="programConditions.length > 0">
          <md-card-subtitle class="center">conditions associated with this program</md-card-subtitle>
          <table class="table-light overflow-hidden bg-white border rounded">
            <thead class="bg-darken-1">
              <tr>
                <th>key</th> <th>type</th> <th>value</th> <th>qualifier</th> <th>remove</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let condition of programConditions "> 
                <td>{{condition.condition.keyID}}</td> 
                <td>{{condition.type}}</td>
                <td>{{condition.condition.value}}</td> 
                <div *ngIf="condition.type === 'number'">
                  <td *ngIf="condition.condition.qualifier?.lessThan === true">
                    LESS THAN
                  </td>
                  <td *ngIf="condition.condition.qualifier?.equal === true">
                    EQUAL
                  </td>
                  <td *ngIf="condition.condition.qualifier?.greaterThan === true">
                    GREATER THAN
                  </td>
                </div>
                <td>
                  <md-checkbox [checked]="false" (change)="stageRemoval($event, condition)">
                  </md-checkbox>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="programConditions.length === 0">
          <md-card-subtitle class="center"> There are no conditions associated with this program </md-card-subtitle>
        </div>
        
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="addConditions()">add</button>
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
export class ProgramConditionsDisplay{
  // reference models/program ... I should export conditions
  @Input() programConditions: any; 
  @Output() toggleDisplay: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  stagedRemoval = new Array<any>();
  
  stageRemoval($event, condition){
    if($event.checked === true){
      this.stagedRemoval.push(condition);
    } else {
      const index = this.stagedRemoval.indexOf(condition);
      this.stagedRemoval.splice(index, 1);
    }
  }
  
  removeConditions(){
    this.stagedRemoval.map( (condition:any) => {
      const index = this.programConditions.indexOf(condition);
      this.programConditions.splice(index, 1);
    })
  }
  
  addConditions(){
    this.toggleDisplay.emit(true);
  }
}