import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Key, ProgramDetails, GeneralCondition } from '../models';

@Injectable()
export class AddProgramActions{
  static LOAD_KEYS = '[ADD_PROGRAM] LOAD_KEYS';
  loadKeys():Action{
    return{
      type: AddProgramActions.LOAD_KEYS
    }
  }
  
  static LOAD_KEYS_SUCCESS = '[ADD_PROGRAM] LOAD_KEYS_SUCCESS';
  loadKeysSuccess(keys:Key[]):Action{
    return {
      type: AddProgramActions.LOAD_KEYS_SUCCESS,
      payload: keys
    }
  }
  
  static UPDATE_DETAILS = '[ADD_PROGRAM] UPDATE_DETAILS';
  updateDetails(details:ProgramDetails):Action{
    return {
      type: AddProgramActions.UPDATE_DETAILS, 
      payload: details
    }
  }
  
  static REMOVE_PROGRAM_KEYS = '[ADD_PROGRAM] REMOVE_PROGRAM_KEYS';
  removeProgramKeys(keys:Key[]):Action{
    return{
      type: AddProgramActions.REMOVE_PROGRAM_KEYS,
      payload: keys
    }
  }
  
  static ADD_PROGRAM_KEYS = '[ADD_PROGRAM] ADD_PROGRAM_KEYS';
  addProgramKeys(keys:Key[]):Action{
    return{
      type: AddProgramActions.ADD_PROGRAM_KEYS,
      payload: keys
    }
  }
  
  static REMOVE_CONDITIONS = '[ADD_PROGRAM] REMOVE_CONDITIONS';
  removeConditions(conditions:GeneralCondition[]):Action{
    return{
      type: AddProgramActions.REMOVE_CONDITIONS,
      payload: conditions
    }
  }
  
  static CONSTRAIN_KEY = '[ADD_PROGRAM] CONSTRAIN_KEY';
  constrainKey(key:Key, condition:GeneralCondition):Action{
    return{
      type: AddProgramActions.CONSTRAIN_KEY,
      payload: {
        key: key, 
        condition: condition
      }
    }
  }
}