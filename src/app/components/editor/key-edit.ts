import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import {
  MdUniqueSelectionDispatcher,
  MD_RADIO_DIRECTIVES
} from '@angular2-material/radio';
import 'rxjs/add/operator/map'

@Component({
  template: `
    <md-card>
      <md-card-title> EDIT KEY </md-card-title>
      <md-card-subtitle> edit a key name and type</md-card-subtitle>
      <md-card-content>
        <md-input value="{{(editKey$ | async)?.id}}" placeholder="key id"></md-input>
        <md-card-subtitle> key type</md-card-subtitle>
        <md-radio-group [value]="(editKey$ | async)?.type">
          <md-radio-button value="number">number</md-radio-button>
          <md-radio-button value="string">string</md-radio-button>
          <md-radio-button value="boolean">boolean</md-radio-button>
        </md-radio-group>
      </md-card-content>
    </md-card>
  `,
  providers: [MdUniqueSelectionDispatcher],
  directives: [MD_CARD_DIRECTIVES, MD_INPUT_DIRECTIVES, MD_RADIO_DIRECTIVES]
})
export class KeyDetailEdit implements OnInit{
  editKey$: any;
  
  constructor(private store: Store<AppState>){}  
  
  ngOnInit(){
    this.editKey$ = this.store.select('keys').map( (store:any) => store.editKey)
  }
}