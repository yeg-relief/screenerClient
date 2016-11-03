import { Action } from '@ngrx/store';

export const ProgramEditActionsTypes = {
  SAVE_SUCCESS: '[PROGRAM_EDIT] SAVE_SUCCESS',
};

export class SaveSuccess implements Action {
  type = ProgramEditActionsTypes.SAVE_SUCCESS;

  constructor(public payload: {}) { }
}

export type ProgramEditActions = SaveSuccess;
