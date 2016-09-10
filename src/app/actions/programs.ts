import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Program } from '../models';

@Injectable()
export class ProgramActions{
  static LOAD_PROGRAMS = '[PROGRAMS] LOAD_PROGRAMS';
  loadPrograms():Action{
    return {
      type: ProgramActions.LOAD_PROGRAMS
    }
  }
  
  static LOAD_PROGRAMS_SUCCESS = '[PROGRAMS] LOAD_PROGRAMS_SUCCESS';
  loadProgramsSuccess(programs: Program[]): Action{
    return {
      type: ProgramActions.LOAD_PROGRAMS_SUCCESS,
      payload: programs
    };
  };
}