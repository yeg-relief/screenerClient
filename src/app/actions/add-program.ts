import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Key, ProgramDetails, GeneralCondition, Program } from '../models';

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
  
  static REMOVE_CONDITIONS = '[ADD_PROGRAM] REMOVE_CONDITIONS';
  removeConditions(conditions:GeneralCondition[]):Action{
    return{
      type: AddProgramActions.REMOVE_CONDITIONS,
      payload: conditions
    }
  }
  
  static ADD_CONDITION = '[ADD_PROGRAM] ADD_CONDITION';
  constrainKey(key:Key, condition:GeneralCondition):Action{
    return{
      type: AddProgramActions.ADD_CONDITION,
      payload: {
        key: key, 
        condition: condition
      }
    }
  }
  
  static UPLOAD_PROGRAM = '[ADD_PROGRAM] UPLOAD_PROGRAM';
  uploadProgram():Action{
    return{
      type: AddProgramActions.UPLOAD_PROGRAM
    }
  }
  
  static UPLOAD_PROGRAM_SUCCESS = '[ADD_PROGRAM] UPLOAD_PROGRAM_SUCCESS';
  uploadProgramSuccess():Action{
    return {
      type: AddProgramActions.UPLOAD_PROGRAM_SUCCESS
    }
  }
}