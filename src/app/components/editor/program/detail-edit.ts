import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { ProgramDetails } from '../../../models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { AddProgramActions } from '../../../actions';
import { AddProgramState } from '../../../reducers/add-program';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'detail-editor',
  template: `
    <md-card>
      <md-card-title> EDIT METADATA </md-card-title>
      <md-card-subtitle class="mb2"> edit program title, description and external link</md-card-subtitle>
      <md-card-content class="flex flex-column">
        
        <md-input class="mb2 ml2 mr2" 
          placeholder="program title" 
          [value]="(details$ | async).title"
          (input)="titleInput($event)">
        </md-input>

        <textarea 
          rows="4" 
          class="block col-12 field mb2 ml2 mr2" 
          [value]="(details$ | async).description"
          (input)="descriptionInput($event)">
        </textarea>        
        
        <md-input 
          class="mb2 ml2 mr2" 
          placeholder="link" 
          [value]="(details$ | async).link"
          (input)="linkInput($event)"></md-input>

        <md-card-actions class="py1 ml1">
          <button md-raised-button color="primary" (click)="save()">save</button>
          <button md-raised-button color="primary" (click)="cancel()">cancel</button>
        </md-card-actions>
      </md-card-content>
    </md-card>
  `,
  directives: [
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_INPUT_DIRECTIVES,
  ]
})
export class EditDetails implements OnInit{
  @Output() onToggleDisplay = new EventEmitter<boolean>()
  details$: Observable<ProgramDetails>;
  
  // local mutating variables
  title: string;
  description: string;
  link: string;
  
  constructor(private store: Store<AppState>){}
  
  save(){
    const details = {
      title: this.title,
      description: this.description,
      link: this.link
    }
    this.store.dispatch({
      type: AddProgramActions.UPDATE_DETAILS,
      payload: {
        details: details
      }
    })
    this.onToggleDisplay.emit(true);
  }
  
  cancel(){
    this.onToggleDisplay.emit(true);
  }
  
  ngOnInit(){
    this.details$ = this.store.select('addProgram')
                    .map( (addProgram:AddProgramState) => addProgram.details)
                    
    const sub = this.store.select('addProgram')
                    .map( (addProgram:AddProgramState) => addProgram.details)
                    .subscribe(
                      (details: ProgramDetails) => {
                        this.title = details.title;
                        this.description = details.description;
                        this.link = details.link;
                      },
                      (error) => console.log(error)
                    )
    sub.unsubscribe();
  }
  
  titleInput($event){
    this.title = $event.target.value;
  }
  
  descriptionInput($event){
    this.description = $event.target.value;
  }
  
  linkInput($event){
    this.link = $event.target.value;
  }
}