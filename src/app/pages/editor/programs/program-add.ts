import { Component, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Key } from '../../../models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
            <md-input placeholder="program title" [(ngModel)]="programDetails.title"></md-input>
            <div style="margin-top:2vh; margin-bottom:2vh"></div>
            <textarea name="textarea" rows="10" cols="50" [(ngModel)]="programDetails.details">Edit Program Description</textarea>
            <div style="margin-top:2vh; margin-bottom:2vh"></div>
            <md-input placeholder="link" [(ngModel)]="programDetails.link"></md-input>
          </md-card-content>
        </md-card>
        <div style="margin-top: 3vh;"></div>
        <md-card>
          <md-card-subtitle> associate a key with this program </md-card-subtitle>
          <md-checkbox [(ngModel)]="showKeyDetails">
            expand key details
          </md-checkbox>
          <md-card-content style="margin-top: 2vh" *ngIf="showKeyDetails">
            <label for="keySelect">Select a key</label>
            <select name="keySelect" [(ngModel)]="selectKey">
              <option *ngFor="let key of (keys$ | async)">
                {{key.id}}
              </option>
            </select>
            <button md-raised-button color="primary" (click)="addSelectedKey()">ADD KEY</button>
            <hr>
            <div style="margin-top: 1vh"></div>
            
            <table *ngIf="selectKey !== ''" style='table-layout:fixed;'>
              <caption><md-card-subtitle>Selected Key Information</md-card-subtitle></caption>
              <tr>
                <th>id</th>
                <th>type</th> 
              </tr>
              <tr>
                <td> {{selectKey}} </td>
                <td> {{getKeyType(selectKey)}} </td>
              </tr>
            </table>
            <hr>
            <div style="margin-top: 3vh"></div>
            <table *ngIf="programKeys.length > 0">
              <caption><md-card-subtitle>Associated Keys Summary</md-card-subtitle></caption>
              <tr>
                <th>id</th>
                <th>type</th>
                <th>remove key</th> 
              </tr>
              <tr *ngFor="let key of programKeys">
                <td> {{key.id}} </td>
                <td> {{key.type}} </td>
                <td>
                  <md-checkbox
                    [checked]="false"
                    (change)="removeKey(key, $event)">
                  </md-checkbox>
                </td>
              </tr>
            </table>
          </md-card-content>
        </md-card>
        <div style="margin-top: 3vh;"></div>
        
        <!-- conditions -->
        
        <md-card>
          <md-card-subtitle> constrain a key with a condition </md-card-subtitle>
          <md-checkbox [(ngModel)]="showConditions">
            expand condition details
          </md-checkbox> 
          <md-card-content style="margin-top: 2vh" *ngIf="showConditions">
            <table style='table-layout:fixed; margin-top: 2vh;'>
              <caption><md-card-subtitle>new condition</md-card-subtitle></caption>
              <tr>
                <th>key</th>
                <th>value</th>
                <th>qualifier</th>
              </tr>
              <tr>
                <td>
                  <select [value]="''" (change)="setKeyType($event.target.value)">
                    <option *ngFor="let key of programKeys">
                      {{key.id}}
                    </option>
                  </select>
                </td>
                <td>
                  <md-input [(ngModel)]="condition.condition.value"></md-input>
                </td>
                <td *ngIf="condition.type === 'number'">
                  <select [value]="lessThan" (change)="qualifierChange($event.target.value)">
                    <option> LESS THAN </option>
                    <option> EQUAL </option>
                    <option> GREATER THAN </option>
                  </select>
                </td>
              </tr>
            </table>
          
            <table style='table-layout:fixed; margin-top: 2vh;'>
              <caption><md-card-subtitle>current conditions</md-card-subtitle></caption>
              <tr>
                <th>key</th>
                <th>type</th>
                <th>value</th>
                <th>qualifier</th>
                <th>edit</th>
              </tr>
              <tr *ngFor="let _condition of conditions">
                <td>{{_condition.condition.key}}</td>
                <td>{{_condition.type}}</td>
                <td>{{_condition.condition.type}}</td>
                <td *ngIf="condition.condition.qualifier.greaterThan === true">
                  GREATER THAN
                </td>
                <td *ngIf="condition.condition.qualifier.equal === true">
                  EQUAL
                </td>
                <td *ngIf="condition.condition.qualifier.lessThan === true">
                  LESS THAN
                </td>
                <td><md-checkbox></md-checkbox></td>
              </tr>
            </table> 
            
             
          </md-card-content>
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
export class ProgramAdd implements OnInit{
  // all available keys
  keys$: Observable<Key[]>
  
  // booleans for managing UI state 
  showProgramDetails: boolean = false;
  showKeyDetails: boolean = false;
  showConditions: boolean = false;
  
  // object containing program details -- reference models/programs.Program
  // local model using push state to reducer only upon submit 
  programDetails: Object = {
    title: '',
    details: '',
    link: ''
  }
  
  // the keys associated with the program
  programKeys: Key[] = new Array<Key>();
  // this is the key selected but not yet added to the programKeys
  selectKey: string = '';
  
  // the conditions associated with the program 
  conditions: Array<any> = new Array<any>();
  // reference models/programs 
  condition = {
    type: '',
    condition: {
      keyID: '',
      value: '',
      qualifier: {
        greaterThan: false,
        equal: false,
        lessThan: false
      }
    }
  }
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.keys$ = this.store.select('keys').map( (store:any) => store.keys)
  }
  
  addSelectedKey(){
    const searchID  = this.selectKey;
    const findById = (key:Key):boolean => {
      for(let i = 0; i < this.programKeys.length; i++){
        const key = this.programKeys[i];
        if(key.id === searchID){
          return true;
        }
      }
      return false;
    }
    
    const sub = this.keys$
                .map( (keys:Key[]) => {
                  let key = null;
                  const filtered = keys.filter( (key:Key) => {
                    return key.id === searchID;
                  })
                  if(filtered.length === 1 && findById(filtered[0]) === false){
                    key = filtered[0];
                  }
                  return key;
                })
                .subscribe(
                  (key) => {
                    if(key != null){
                      this.programKeys.push(key)
                    }
                    
                  },
                  (error) => console.log(error)
                )
    sub.unsubscribe();
  }
  
  removeKey(key:Key, $event){
    let index: number;
    if($event.checked === true){
      index = this.programKeys.indexOf(key);
    }
    if(index !== -1){
      this.programKeys.splice(index, 1);
    }
  }
  
  getKeyID(){
    return this.selectKey;
  }
  
  getKeyType(searchID:string){
    let discoveredType = '';
    const sub = this.keys$
                .map( (keys:Key[]) => {
                  let type:string = '';
                  for(let i = 0; i < keys.length; i++){
                    if(keys[i].id === searchID){
                      type = keys[i].type;
                      break;
                    }                    
                  }
                  return type
                }).subscribe(
                  (type:string) => {
                    discoveredType = type;
                  },
                  (error) => console.log(error)
                )
    sub.unsubscribe();
    return discoveredType;
  }
  
  qualifierChange(value){
    for(const key in this.condition.condition.qualifier){
      if(key === value){
        this.condition.condition.qualifier[key] = true;
      } else {
        this.condition.condition.qualifier[key] = false;
      }
    }
  }
  
  keyType(key:Key){
    return this.getKeyType(key.id);
  }
  
  setKeyType(keyID){
    console.log(`in setKeyType(${keyID})`)
    console.log(keyID)
    this.condition.type = this.getKeyType(keyID)
    console.log(this.condition.type);
  }
}
