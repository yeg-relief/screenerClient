import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import {
  MdUniqueSelectionDispatcher,
  MD_RADIO_DIRECTIVES
} from '@angular2-material/radio';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import 'rxjs/add/operator/map'
import { KeyActions } from '../../actions/keys';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  template: `
    <md-card style="width:100%; margin-top:2%; height:200vh;">
      <md-card-title> ADD KEY </md-card-title>
      <md-card-subtitle> Add a key to the backend</md-card-subtitle>
      <md-card-content>
        <md-input placeholder="key id" [(ngModel)]="id"></md-input>
        <md-card-subtitle> key type</md-card-subtitle>
        <md-radio-group [(ngModel)] = "type">
          <md-radio-button value="number">number</md-radio-button>
          <md-radio-button value="string">string</md-radio-button>
          <md-radio-button value="boolean">boolean</md-radio-button>
        </md-radio-group>
      </md-card-content>
      <md-card-actions>
        <button md-raised-button (click)="submit()">ADD</button>
      </md-card-actions>
      <md-card *ngIf="error !== null" style="background-color: red">
        <md-card-subtitle > {{ error }} </md-card-subtitle>
      </md-card>
      <md-card *ngIf="success === true" style="background-color: green">
        <md-card-subtitle > key uploaded successfully </md-card-subtitle> 
        <md-card-actions>
          <a [routerLink]="['/editor/keys']">
            <button button md-raised-button color="primary">OVERIVEW</button>
          </a>
        </md-card-actions>
      </md-card>
    </md-card>
    
  `,
  providers: [MdUniqueSelectionDispatcher],
  directives: [
    MD_CARD_DIRECTIVES, 
    MD_INPUT_DIRECTIVES, 
    MD_RADIO_DIRECTIVES, 
    MD_BUTTON_DIRECTIVES,
    ROUTER_DIRECTIVES
  ]
})
export class KeyEditorAdd implements OnInit{
  keys$: any;
  keys: any = new Array<any>();
  type: any = '';
  id: any = '';
  newKey = {
    type: null,
    id: null
  };
  success = false;
  error = null;
  errorTypes = {
    identicalID: 'this ID already exits with a different type',
    identicalIDandType: 'this ID already exists with this type',
    invalidIDorType: 'either the id or type is blank/unselected'
  }
  
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.keys$ = this.store.select('keys').map( (store:any) => store.keys)
    const sub = this.keys$.subscribe(
      (key) => {
        this.keys.push(key);
      }
    )
    sub.unsubscribe();
  }
  
  submit(){
    let valid = true;
    
    if(this.id === '' || this.type === ''){
      valid = false;
      this.success = false;
      this.error = this.errorTypes.invalidIDorType;
    }
    
    
    if(valid){
      for(let i = 0; i < this.keys.length; i++){
        const key = this.keys[i];
        if(key.id === this.id && key.type !== this.type){
          valid = false;
          this.success = false;
          this.error = this.errorTypes.identicalID;
          break;
        } else if(key.id === this.id && key.type === this.type){
          valid = false;
          this.success = false;
          this.error = this.errorTypes.identicalIDandType;
          break;
        }
      }
    }
    
    
    if(valid){
      this.error = null;
      this.success = true;
      this.store.dispatch({
        type: KeyActions.ADD_KEY, 
        payload: {
          id: this.id,
          type: this.type
        }
      })
    } 
  }
}