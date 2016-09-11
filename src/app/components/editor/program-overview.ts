import { Component, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import 'rxjs/add/operator/map'
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ProgramActions } from '../../actions';
import { MD_RADIO_DIRECTIVES } from '@angular2-material/radio';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox'; 


interface ProgramDisplayControl{
  showConditions: boolean;
  showKeys: boolean;
}


@Component({
  template: `
  <div class="flex flex-column">
    <md-card style="width:65vw; margin-left:10vw; margin-top:2%; height:200vh; margin-right:10vw">
      <md-card-title> PROGRAM OVERVIEW </md-card-title>
      <md-card-subtitle> Programs are the benefits available to the user </md-card-subtitle>
      <md-card-actions>
        <button md-raised-button color="primary"> ADD PROGRAM </button>
      </md-card-actions>
      <md-card-content>
        <md-card *ngFor="let program of (programs$ | async); let i=index">
          <md-card-title> {{ program.title }} </md-card-title>
          <md-card-subtitle style="flex"> <div>{{ program.details }} </div></md-card-subtitle>
          <a href="{{ program.link }}"> link to program </a>
          <md-card-actions> 
            <button md-raised-button> EDIT </button>
            <md-checkbox [(ngModel)]="displayControls[i].showKeys">
              display keys
            </md-checkbox>
            <md-checkbox [(ngModel)]="displayControls[i].showConditions">
              display conditions
            </md-checkbox>
          </md-card-actions>
          <md-card  style="width:50%" *ngIf="displayControls[i].showKeys">
            <md-card-title>KEYS</md-card-title>
            <md-card-subtitle>here are the keys associated with this program</md-card-subtitle>
            <md-card-content>
              <md-card>
                <md-card-content>
                  <ul>
                    <li *ngFor="let key of program.conditions">
                      {{key.condition.keyID}}
                    </li>
                  </ul>
                </md-card-content>
              </md-card>
            </md-card-content>
          </md-card>
          <md-card style="width:50%" *ngIf="displayControls[i].showConditions">
            <md-card-title>Conditions</md-card-title>
            <md-card-subtitle>here are the conditions associated with this program</md-card-subtitle>
            <md-card-content>
              <table>
                <tr>
                  <th>key ID </th>
                  <th>type </th> 
                  <th>value</th>
                  <th>qualifier</th>
                </tr>
                <tr *ngFor="let condition of program.conditions">
                  <td>{{condition.condition.keyID}}</td>
                  <td>{{condition.type}}</td>
                  <td>{{condition.condition.value}}</td>
                  <!-- sloppy model -->
                  <div *ngIf="condition.type === 'number'">
                    <div *ngIf="condition.condition.qualifier.lessThan === true">
                      <td> LESS THAN </td>
                    </div>
                    <div *ngIf="condition.condition.qualifier.equal === true">
                      <td> EQUAL </td>
                    </div>
                    <div *ngIf="condition.condition.qualifier.greaterThan === true">
                      <td> GREATER THAN </td>
                    </div>
                  </div> 
                </tr>
              </table>
            </md-card-content>
          </md-card>
        </md-card>
      </md-card-content>
    </md-card> 
  </div>
  `,
  directives: [
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_CHECKBOX_DIRECTIVES
  ]
})
export class ProgramOverview implements OnInit{
  programs$: any;
  displayControls: ProgramDisplayControl[] = new Array<ProgramDisplayControl>();
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.programs$ = this.store.select('programs').map( (store:any) => store.programs)
    const sub = this.programs$.subscribe(
      (programs) => {
        programs.map( () => {
          this.displayControls.push({
            showConditions: false,
            showKeys: false
          })
        })
        
      }
    )
    sub.unsubscribe();
  }
  
  
}