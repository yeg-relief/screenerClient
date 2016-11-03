import { Action } from '@ngrx/store';

export const ProgramDeleteActionsTypes = {
  DELETE_SUCCESS: '[PROGRAM_DELETE] DELETE_SUCCESS',
};

export class DeleteSuccess implements Action {
  type = ProgramDeleteActionsTypes.DELETE_SUCCESS;

  constructor(public payload: {}) { }
}

export type ProgramDeleteActions = DeleteSuccess;
