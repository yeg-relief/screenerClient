import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { Program } from '../../../models';

@Component({
  selector: 'program-metadata-display',
  template: `
    <md-card>
      <md-card-title> METADATA </md-card-title>
      <md-card-content class="flex flex-column">

        <div class="p1 m1 border">
          <div *ngIf="program.title.length > 0">
            <p>{{program.title}}</p>
          </div>
          <div *ngIf="program.title.length === 0">
            <md-card-subtitle>no program title found</md-card-subtitle>
          </div>
        </div>
        

        <div class="p1 m1 border">
          <div *ngIf="program.details.length > 0">
            <p>{{program.details}}</p>
          </div>
          <div *ngIf="program.details.length === 0">
            <md-card-subtitle>no program details found</md-card-subtitle>
          </div>
        </div>

        <div class="p1 m1 border">
          <div *ngIf="program.link.length === 0">
            <md-card-subtitle>no program link found</md-card-subtitle>
          </div>
          <div *ngIf="program.link.length > 0">
            {{program.link}}
          </div>
        </div>
        
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="edit()">edit</button>
        </md-card-actions >
      </md-card-content>
    </md-card>
  `,
  directives: [
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_INPUT_DIRECTIVES,
    MD_CHECKBOX_DIRECTIVES
  ]
})
export class DisplayProgramMeta{
  @Input() program: Program;
  @Output() toggleEdit = new EventEmitter<boolean>()
  
  edit(){
    this.toggleEdit.emit(true);
  }
}