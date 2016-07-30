import { ActionReducer, Action } from '@ngrx/store';
import { KeyActions } from '../actions';
import { Key } from '../models';

export interface KeyState{
  keys: Key[];
}

const initialState: KeyState = {
  keys: new Array<Key>()
}

export function keyReducer(state = initialState, action: Action): KeyState{
  switch(action.type){
    case KeyActions.LOAD_KEYS: {
      return state;
    }
    
    case KeyActions.LOAD_KEYS_SUCCESS: {
      let keys = new Array<Key>();
      action.payload.map( (key:Key) => {
        keys.push( (<any>Object).assign({}, key) )
      })
      
      return{
        keys: keys
      }
    }
    
    default: {
      return state;
    }
  }
}