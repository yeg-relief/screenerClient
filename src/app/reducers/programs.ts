import { ActionReducer, Action } from '@ngrx/store';
import { ProgramActions } from '../actions';
import { Program } from '../models';

export interface ProgramState{
  programs: Program[];
  editProgram: Program;
}

const initialState: ProgramState = {
  programs: new Array<Program>(),
  editProgram: null
}

export function ProgramReducer(state = initialState, action: Action): ProgramState{
  switch(action.type){
    
    case ProgramActions.LOAD_PROGRAMS: {
      return state;
    }
    
    case ProgramActions.LOAD_PROGRAMS_SUCCESS: {
      action.payload.map( (program) => {
        state.programs.push(program);
      })
      return state;
    }
    
    default: {
      return state;
    } 
  }
}