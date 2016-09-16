import { ActionReducer, Action } from '@ngrx/store';
import { AddProgramActions } from '../actions';
import { Key, GeneralCondition, ProgramDetails } from '../models';

export interface AddProgramState{
  keys: Key[];
  programKeys: Key[];
  freeKeys: Key[];
  conditions: GeneralCondition[];
  details: ProgramDetails;
  loadingKeys: boolean;
  loadedKeys: boolean;
}

const initialState: AddProgramState = {
  keys: new Array<Key>(),
  programKeys: new Array<Key>(),
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
        freeKeys: [].concat(action.payload), 
        keys: [].concat(action.payload)
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
      const key_ids_to_free = [];
      conditionsToRemove.map( (condition:GeneralCondition) => {
        key_ids_to_free.push(condition.concreteCondition.keyID);
      })
      console.log(key_ids_to_free);
      // newConditions = conditions NOT in conditions to remove
      const newConditions = state.conditions.filter( (condition:GeneralCondition) => {
        return conditionsToRemove.indexOf(condition) < 0;
      })
      
      // newProgramKeys = programKeys NOT in key_ids_to_free 
      const newProgramKeys = state.programKeys.filter( (key:Key) => {
        return key_ids_to_free.indexOf(key.id) < 0;
      })
      console.log(newProgramKeys)
      const newlyFreeKeys = state.keys.filter( (key:Key) => {
        return key_ids_to_free.indexOf(key.id) >= 0;
      })
      console.log(newlyFreeKeys)
      
      return (<any>Object).assign({}, state, {
        conditions: [].concat(newConditions),
        programKeys: [].concat(newProgramKeys),
        freeKeys: state.freeKeys.concat(newlyFreeKeys)
      })
    }
    
    case AddProgramActions.ADD_CONDITION: {
      const constrainKey = action.payload.key;
      const condition = action.payload.condition;
      
      
      
      const updatedFreeKeys = state.freeKeys.filter( (key: Key) => {
        return key.id !== constrainKey.id;
      })
            
      
      return (<any>Object).assign({}, state, {
        conditions: state.conditions.concat(condition),
        freeKeys: updatedFreeKeys,
        programKeys: state.programKeys.concat(constrainKey)
      })
      
    }
    
    default: {
      return state;
    }
  } 
}