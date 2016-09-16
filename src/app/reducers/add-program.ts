import { ActionReducer, Action } from '@ngrx/store';
import { AddProgramActions } from '../actions';
import { Key, GeneralCondition, ProgramDetails } from '../models';

export interface AddProgramState{
  programKeys: Key[];
  boundKeys: Key[];
  freeKeys: Key[];
  conditions: GeneralCondition[];
  details: ProgramDetails;
  loadingKeys: boolean;
  loadedKeys: boolean;
}

const initialState: AddProgramState = {
  programKeys: new Array<Key>(),
  boundKeys: new Array<Key>(),
  freeKeys: new Array<Key>(),
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
        freeKeys: [].concat(action.payload)
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
    
    case AddProgramActions.REMOVE_CONDITIONS: {
      const conditionsToRemove: GeneralCondition[] = [].concat(action.payload);
      const newConditions = state.conditions.filter( (condition:GeneralCondition) => {
        return conditionsToRemove.indexOf(condition) < 0;
      })
      
      return (<any>Object).assign({}, state, {
        conditions: [].concat(newConditions)
      })
    }
    
    case AddProgramActions.CONSTRAIN_KEY: {
      const constrainKey = action.payload.key;
      const condition = action.payload.condition;
      
      const updatedFreeKeys = state.freeKeys.filter( (key: Key) => {
        return key.id !== constrainKey.id;
      })
      
      
      
      
      return (<any>Object).assign({}, state, {
        conditions: state.conditions.concat(condition),
        freeKeys: updatedFreeKeys,
        boundKeys: state.boundKeys.concat(constrainKey)
      })
      
    }
    
    default: {
      return state;
    }
  } 
}