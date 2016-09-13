import { Component, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import 'rxjs/add/operator/map'

@Component({
  template: `
  <div class="flex flex-column">
    <md-card style="width:65vw; margin-left:5vw; margin-top:2%; height:95vh; margin-right:5vw; background-color:lightyellow">
      <md-card-title> ADD PROGRAM </md-card-title>
      <md-card-subtitle> Create a new program </md-card-subtitle>
      <md-card-content>
        <md-card>
          <md-card-subtitle> edit program title, description and external link</md-card-subtitle>
          <md-checkbox [(ngModel)]="showProgramDetails">
            expand program details
          </md-checkbox>
          <md-card-content *ngIf="showProgramDetails">
            <md-input placeholder="program title"></md-input>
            <div style="margin-top:2vh; margin-bottom:2vh"></div>
            <textarea name="textarea" rows="10" cols="50">Program Description</textarea>
            <div style="margin-top:2vh; margin-bottom:2vh"></div>
            <md-input placeholder="link"></md-input>
          </md-card-content>
        </md-card>
        <div style="margin-top: 3vh;"></div>
        <md-card>
          <md-card-subtitle> associate a key with this program </md-card-subtitle>
          <md-checkbox [(ngModel)]="showKeyDetails">
            expand key details
          </md-checkbox>
        </md-card>
        <div style="margin-top: 3vh;"></div>
        <md-card>
          <md-card-subtitle> constrain a key with a condition </md-card-subtitle>
          <md-checkbox [(ngModel)]="showConditions">
            expand condition details
          </md-checkbox> 
        </md-card>
      </md-card-content>
    </md-card>
  </div>
  `,
  directives: [
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_INPUT_DIRECTIVES,
    MD_CHECKBOX_DIRECTIVES
  ]
})
export class ProgramAdd{
  showProgramDetails: boolean = false;
  showKeyDetails: boolean = false;
  showConditions: boolean = false;
}
