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
      type: 'boolean'
    },
    {
      id: 'number_of_children',
      type: 'number'
    },
    {
      id: 'yearly_personal_income',
      type: 'number'
    },
    {
      id: 'married',
      type: 'boolean'
    }
  ]  
  
  loadKeys():Observable<any>{
    const mockKeys = () => {
      return this.mockKeys;
    }
    
    return <Observable<any>>Observable.from(this.mockKeys).toArray();
  }
}