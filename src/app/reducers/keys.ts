import { ActionReducer, Action } from '@ngrx/store';
import { KeyActions } from '../actions';

export interface KeyState{
  keys: {key:string, id:string}[];
}

const initialState: KeyState = {
  keys: new Array<{key:string, id:string}>()
}

export function keyReducer(state = initialState, action: Action): KeyState{
  switch(action.type){
    default: {
      return state;
    }
  }
}