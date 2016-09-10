import { Component, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import {
  MdUniqueSelectionDispatcher,
  MD_RADIO_DIRECTIVES
} from '@angular2-material/radio';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';

@Component({
  template: '<h1>Programs</h1>'
})
export class ProgramsEdit{
  
  constructor(private store: Store<AppState>){}
}