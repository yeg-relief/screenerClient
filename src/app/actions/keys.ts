import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Key } from '../models';

@Injectable()
export class KeyActions{
  static LOAD_KEYS = '[KEY_ACTIONS] LOAD_KEYS';
  loadKeys():Action{
    return {
      type: KeyActions.LOAD_KEYS
    };
  }
  
  static LOAD_KEYS_SUCCESS = '[KEY_ACTIONS] LOAD_KEYS_SUCCESS';
  loadKeysSuccess(keys:Key[]):Action{
    return {
      type: KeyActions.LOAD_KEYS_SUCCESS,
      payload: keys
    }
  }
  
  static SET_EDIT_KEY = '[KEY_ACTIONS] SET_EDIT_KEY';
  setEditKey(key:Key):Action{
    return {
      type: KeyActions.SET_EDIT_KEY,
      payload: key
    }
  }
}