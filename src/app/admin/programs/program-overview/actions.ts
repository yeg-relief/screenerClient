import { Action } from '@ngrx/store';
import { ApplicationFacingProgram } from '../../models/program';

export const ProgramOverviewActionsTypes = {
  LOAD_PROGRAMS: '[PROGRAM_OVERVIEW] LOAD_PROGRAMS',
  LOAD_PROGRAMS_SUCCESS: '[PROGRAM_OVERVIEW] LOAD_PROGRAMS_SUCCESS',
  LOAD_PROGRAMS_FAILURE: '[PROGRAM_OVERVIEW] LOAD_PROGRAMS_FAILURE',
  UPDATE_PROGRAM: '[PROGRAM_OVERVIEW] UPDATE_PROGRAM',
  UPDATE_PROGRAM_SUCCESS: '[PROGRAM_OVERVIEW] UPDATE_PROGRAM_SUCCESS',
  CREATE_PROGRAM: '[PROGRAM_OVERVIEW] CREATE_PROGRAM',
  CREATE_PROGRAM_SUCCESS: '[PROGRAM_OVERVIEW] CREATE_PROGRAM_SUCCESS',
  DELETE_PROGRAM: '[PROGRAM_OVERVIEW] DELETE_PROGRAM',
  DELETE_PROGRAM_SUCCESS: '[PROGRAM_OVERVIEW] DELETE_PROGRAM_SUCCESS'
};

export class LoadPrograms implements Action {
  type = ProgramOverviewActionsTypes.LOAD_PROGRAMS;

  constructor(public payload: {}) { }
}

export class LoadProgramsSuccess implements Action {
  type = ProgramOverviewActionsTypes.LOAD_PROGRAMS_SUCCESS;

  constructor(public payload: ApplicationFacingProgram[]) { }
}

export class LoadProgramsFailure implements Action {
  type = ProgramOverviewActionsTypes.LOAD_PROGRAMS_FAILURE;

  constructor(public payload: {}) { }
}

export class UpdateProgram implements Action {
  type = ProgramOverviewActionsTypes.UPDATE_PROGRAM;

  constructor(public payload: ApplicationFacingProgram) { }
}

export class UpdateProgramSuccess implements Action {
  type = ProgramOverviewActionsTypes.UPDATE_PROGRAM_SUCCESS;

  constructor(public payload: ApplicationFacingProgram[]) { }
}

export class CreateProgram implements Action {
  type = ProgramOverviewActionsTypes.CREATE_PROGRAM;

  constructor(public payload: ApplicationFacingProgram) { }
}

export class CreateProgramSuccess implements Action {
  type = ProgramOverviewActionsTypes.CREATE_PROGRAM_SUCCESS;

  constructor(public payload: ApplicationFacingProgram[]) { }
}

export class DeleteProgram implements Action {
  type = ProgramOverviewActionsTypes.DELETE_PROGRAM;

  constructor(public payload: ApplicationFacingProgram) { }
}

export class DeleteProgramSuccess implements Action {
  type = ProgramOverviewActionsTypes.DELETE_PROGRAM_SUCCESS;

  constructor(public payload: ApplicationFacingProgram[]) { }
}

export type ProgramOverviewActions =
    LoadPrograms
  | LoadProgramsSuccess
  | LoadProgramsFailure
  | UpdateProgram
  | UpdateProgramSuccess
  | CreateProgram
  | CreateProgramSuccess
  | DeleteProgram
  | DeleteProgramSuccess;
