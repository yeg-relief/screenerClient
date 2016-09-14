import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';

@Component({
  selector: 'program-metadata-editor',
  template: `
    <md-card>
      <md-card-title> EDIT METADATA </md-card-title>
      <md-card-subtitle class="mb2"> edit program title, description and external link</md-card-subtitle>
      <md-card-content class="flex flex-column">
        <md-input class="mb2" placeholder="program title" [(ngModel)]="program.title"></md-input>
        
        <textarea 
          rows="4" 
          class="block col-12 field mb2" 
          [(ngModel)]="program.details"
          *ngIf="program.details.length > 0">
          {{program.details}}
        </textarea>        
        
        <md-input class="mb2" placeholder="link" [(ngModel)]="program.link"></md-input>
        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="save()">save</button>
        </md-card-actions>
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
export class EditProgramMeta implements OnInit{
  @Input() program: any;
  @Output() onSave = new EventEmitter<boolean>()
  
  save(){
    this.onSave.emit(true);
    if(this.program.details === 'Enter Program Details'){
      this.program.details = '';
    }
  }
  
  ngOnInit(){
    if(this.program.details.length === 0){
      this.program.details = 'Enter Program Details';
    }
  }
}