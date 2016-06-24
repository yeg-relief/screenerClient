import { Injectable } from '@angular/core';
import { QuestionBase } from '../Question/index';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/from';

@Injectable()
export class DataService {
  obs: Observable<any>
  private cache: any = [
    {
      lead: {
        key: 'expand',
        label: 'expand group 0?',
        controlType: 'checkbox',
        value: false,
        checked: false,
        required: false,
        lead: true,
        order: 1
      },
      following: 
      [
        {
          key: 'firstName',
          label: 'First name',
          value: 'Bombasto',
          required: true,
          order: 2
        },
        {
          key: 'emailAddress',
          label: 'Email',
          type: 'email',
          value: '',
          required: false,
          order: 3
        },
        {
          key: 'numberChildren',
          label: "How many children under 18?",
          required: true,
          value: '',
          order: 4
        }
        ]
      }
  ] 
   
  
  constructor() {
    this.obs = Observable.from(this.cache);
  }

}