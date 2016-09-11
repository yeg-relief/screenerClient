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
      const programs: Program[] = new Array<Program>();
      action.payload.map( (program) => {
        programs.push(program);
      })
      return (<any>Object).assign({}, state, {
        programs: programs  
      })
    }
    
    default: {
      return state;
    } 
  }
}