import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Key, ProgramDetails } from '../models';

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
}