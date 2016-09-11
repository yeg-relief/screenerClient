import { ActionReducer, Action } from '@ngrx/store';
import { KeyActions } from '../actions';
import { Key } from '../models';

export interface KeyState{
  keys: Key[];
  editKey: Key;
  originalKey: Key;
}

const initialState: KeyState = {
  keys: new Array<Key>(),
  editKey: null,
  originalKey: null
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
      
      return (<any>Object).assign({}, state, {
        keys: keys
      })
    }
    
    case KeyActions.SET_EDIT_KEY: {
      return (<any>Object).assign({}, state, {
        editKey: action.payload, 
        originalKey: action.payload
      })
    }
    
    case KeyActions.UPDATE_EDIT_KEY: {
      const index = state.keys.indexOf(state.originalKey);
      const keys = state.keys;
      if(index > -1){
        keys.splice(index, 1, action.payload);
      }
      return (<any>Object).assign({}, state, {
        keys: keys
      }) 
    }
    
    case KeyActions.ADD_KEY: {
      const keys = state.keys;
      keys.push(action.payload)
      return (<any>Object).assign({}, state, {
        keys: keys
      }) 
    }
    
    case KeyActions.DELETE_KEY: {
      const index = state.keys.indexOf(action.payload);
      const keys = state.keys;
      if(index > -1){
        keys.splice(index, 1)
      }
      return (<any>Object).assign({}, state, {
        keys: keys
      }) 
    }
    
    default: {
      return state;
    }
  }
}