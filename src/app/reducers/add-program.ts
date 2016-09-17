import { ActionReducer, Action } from '@ngrx/store';
import { AddProgramActions } from '../actions';
import { Key, GeneralCondition, ProgramDetails, Program } from '../models';

export interface AddProgramState{
  keys: Key[];
  programKeys: Key[];
  freeKeys: Key[];
  conditions: GeneralCondition[];
  details: ProgramDetails;
  loadingKeys: boolean;
  loadedKeys: boolean;
  validProgram: boolean;
  uploadingProgram: boolean;
  uploadedProgram: boolean;
  errors: string[];
  program: Program;
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
  loadedKeys: false,
  validProgram: true,
  uploadingProgram: false,
  uploadedProgram: false, 
  errors: new Array<string>(),
  program: undefined
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
        },
        program: {},
        uploadedProgram: false,
        uploadingProgram: false
      })
    }
    
    case AddProgramActions.REMOVE_CONDITIONS: {
      const conditionsToRemove: GeneralCondition[] = [].concat(action.payload);
      const key_ids_to_free: string[] = [];
      conditionsToRemove.map( (condition:GeneralCondition) => {
        key_ids_to_free.push(condition.concreteCondition.keyID);
      })

      // newConditions = conditions NOT in conditions to remove
      const newConditions = state.conditions.filter( (condition:GeneralCondition) => {
        return conditionsToRemove.indexOf(condition) < 0;
      })
      
      // newProgramKeys = programKeys NOT in key_ids_to_free 
      const newProgramKeys = state.programKeys.filter( (key:Key) => {
        return key_ids_to_free.indexOf(key.id) < 0;
      })

      const newlyFreeKeys = state.keys.filter( (key:Key) => {
        return key_ids_to_free.indexOf(key.id) >= 0;
      })

      
      return (<any>Object).assign({}, state, {
        conditions: [].concat(newConditions),
        programKeys: [].concat(newProgramKeys),
        freeKeys: state.freeKeys.concat(newlyFreeKeys),
        program: {},
        uploadedProgram: false, 
        uploadingProgram: false
      })
    }
    
    case AddProgramActions.ADD_CONDITION: {
      const constrainKey: Key = action.payload.key;
      const condition: GeneralCondition = action.payload.condition;
      
      
      
      const updatedFreeKeys = state.freeKeys.filter( (key: Key) => {
        return key.id !== constrainKey.id;
      })
            
      
      return (<any>Object).assign({}, state, {
        conditions: state.conditions.concat(condition),
        freeKeys: updatedFreeKeys,
        programKeys: state.programKeys.concat(constrainKey),
        program: {},
        uploadedProgram: false, 
        uploadingProgram: false
      })
      
    }
    
    
    case AddProgramActions.UPLOAD_PROGRAM: {
      const program: Program = (<any>Object).assign({}, {
        details: {
          title: new String(state.details.title),
          description: new String(state.details.description),
          link: new String(state.details.link)
        },
        conditions: [].concat(state.conditions)
      })
      
      return (<any>Object).assign({}, state, {
        uploadingProgram: true, 
        program: program
      })
    }
    
    case AddProgramActions.UPLOAD_PROGRAM_SUCCESS: {
      return (<any>Object).assign({}, state, {
        uploadedProgram: true, 
        uploadingProgram: false
      })
    }
    
    default: {
      return state;
    }
  } 
}