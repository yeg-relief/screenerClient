import { Action } from '@ngrx/store';
import { Key } from '../../models/key';

export const KeyActionsTypes = {
  LOAD_KEYS: '[KEY] LOAD_KEYS',
  LOAD_KEYS_SUCCESS: '[KEY] LOAD_KEYS_SUCCESS'
};

export class LoadKeys implements Action {
  type = KeyActionsTypes.LOAD_KEYS;
  constructor(public payload: {}) { }
};

export class LoadKeysSuccess implements Action {
  type = KeyActionsTypes.LOAD_KEYS_SUCCESS;
  constructor(public payload: Key[]) { }
};

export type KeyActions =
    LoadKeys
  | LoadKeysSuccess
