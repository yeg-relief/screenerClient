import { ActionReducer, Action } from '@ngrx/store';
import { AddProgramActions } from '../actions';
import { Key, GeneralCondition, ProgramDetails } from '../models';

export interface AddProgramState{
  keys: Key[];
  programKeys: Key[];
  boundKeys: Key[];
  conditions: GeneralCondition[];
  details: ProgramDetails;
  loadingKeys: boolean;
  loadedKeys: boolean;
}

const initialState: AddProgramState = {
  keys: new Array<Key>(),
  programKeys: new Array<Key>(),
  boundKeys: new Array<Key>(),
  conditions: new Array<GeneralCondition>(),
  details: {
    title: '',
    description: '', 
    link: ''
  },
  loadingKeys: false,
  loadedKeys: false
}

export function addProgramReducer(state = initialState, action: Action): AddProgramState{
  switch(action.type){
    case AddProgramActions.LOAD_KEYS: {
      return (<any>Object).assign({}, state, {
        loadingKeys: true
      })
    }
    
    case AddProgramActions.LOAD_KEYS_SUCCESS: {
      return (<any>Object).assign({}, state, {
        loadingKeys: false,
        loadedKeys: true,
        keys: action.payload
      })
    }
    
    case AddProgramActions.UPDATE_DETAILS: {
      return (<any>Object).assign({}, state, {
        details: {
          title: new String(action.payload.details.title),
          description: new String(action.payload.details.description),
          link: new String(action.payload.details.link)
        }
      })
    }
    
    default: {
      return state;
    }
  } 
}