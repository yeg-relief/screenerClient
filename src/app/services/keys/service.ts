import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/toArray';
import { Key } from '../../models';

@Injectable()
export class KeyService{
  private mockKeys:Array<Key> = [
    {
      id: 'children',
      type: 'boolean',
      questionKeys: []
    },
    {
      id: 'number_of_children',
      type: 'number',
      questionKeys: []
    },
    {
      id: 'yearly_personal_income',
      type: 'number',
      questionKeys: []
    },
    {
      id: 'married',
      type: 'boolean',
      questionKeys: []
    },
    {
      id: 'expand',
      type: 'boolean',
      questionKeys: ['expand']
    },
    {
      id: 'firstName',
      type: 'string',
      questionKeys: ['firstName']
    },
    {
      id: 'emailAddress',
      type: 'string',
      questionKeys: ['emailAddress']
    },
    {
      id: 'numberChildren',
      type: 'number',
      questionKeys: ['numberChildren']
    },
    {
      id: 'dropDownQuestion',
      type: 'string',
      questionKeys: ['dropDownQuestion']
    }
  ]  
  
  loadKeys():Observable<any>{
    const mockKeys = () => {
      return this.mockKeys;
    }
    
    return <Observable<any>>Observable.from(this.mockKeys).toArray();
  }
}