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
      questionKey: null
    },
    {
      id: 'number_of_children',
      type: 'number',
      questionKey: null
    },
    {
      id: 'yearly_personal_income',
      type: 'number',
      questionKey: null
    },
    {
      id: 'married',
      type: 'boolean',
      questionKey: null
    },
    {
      id: 'expand',
      type: 'boolean',
      questionKey: 'expand'
    },
    {
      id: 'firstName',
      type: 'string',
      questionKey: 'firstName'
    },
    {
      id: 'emailAddress',
      type: 'string',
      questionKey: 'emailAddress'
    },
    {
      id: 'numberChildren',
      type: 'number',
      questionKey: 'numberChildren'
    },
    {
      id: 'dropDownQuestion',
      type: 'string',
      questionKey: 'dropDownQuestion'
    }
  ]  
  
  loadKeys():Observable<any>{
    const mockKeys = () => {
      return this.mockKeys;
    }
    
    return <Observable<any>>Observable.from(this.mockKeys).toArray();
  }
}