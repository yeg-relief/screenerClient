import { Action } from '@ngrx/store';
import { UserFacingProgram } from '../../../shared/models';

export const ProgramOverviewActionsTypes = {
  LOAD_PROGRAMS: '[PROGRAM_OVERVIEW] LOAD_PROGRAMS',
  LOAD_PROGRAMS_SUCCESS: '[PROGRAM_OVERVIEW] LOAD_PROGRAMS_SUCCESS',
  LOAD_PROGRAMS_FAILURE: '[PROGRAM_OVERVIEW] LOAD_PROGRAMS_FAILURE'
};

export class LoadPrograms implements Action {
  type = ProgramOverviewActionsTypes.LOAD_PROGRAMS;

  constructor(public payload: {}) { }
}

export class LoadProgramsSuccess implements Action {
  type = ProgramOverviewActionsTypes.LOAD_PROGRAMS_SUCCESS;

  constructor(public payload: UserFacingProgram[]) { }
}

export class LoadProgramsFailure implements Action {
  type = ProgramOverviewActionsTypes.LOAD_PROGRAMS_FAILURE;

  constructor(public payload: {}) { }
}

export type ProgramOverviewActions =
    LoadPrograms
  | LoadProgramsSuccess
  | LoadProgramsFailure;
