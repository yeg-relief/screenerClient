import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { ProgramOverviewActionsTypes, ProgramOverviewActions} from './actions';
import { ApplicationFacingProgram } from '../../models/program';

export interface State {
  loading: boolean;
  programs: ApplicationFacingProgram[];
  error: string;
}

export const initialState: State = {
  loading: false,
  error: '',
  programs: []
};

export function reducer(state = initialState, action: ProgramOverviewActions): State {


  switch (action.type) {

    case ProgramOverviewActionsTypes.LOAD_PROGRAMS: {
      return (<any>Object).assign({}, state, {
        loading: true
      });
    }

    case ProgramOverviewActionsTypes.LOAD_PROGRAMS_FAILURE: {
      return (<any>Object).assign({}, state, {
        loading: false,
        error: 'unable to load programs'
      });
    }

    case ProgramOverviewActionsTypes.LOAD_PROGRAMS_SUCCESS: {
      return (<any>Object).assign({}, state, {
        loading: false,
        error: '',
        programs: [...<ApplicationFacingProgram[]>action.payload]
      });
    }

    case ProgramOverviewActionsTypes.UPDATE_PROGRAM: {
      return Object.assign({}, state, {loading: true});
    }

    case ProgramOverviewActionsTypes.UPDATE_PROGRAM_SUCCESS: {
      return Object.assign({}, state, {loading: false});
    }

    case ProgramOverviewActionsTypes.CREATE_PROGRAM: {
      return Object.assign({}, state, {loading: true});
    }

    case ProgramOverviewActionsTypes.CREATE_PROGRAM_SUCCESS: {
      return Object.assign({}, state, {loading: false});
    }

    case ProgramOverviewActionsTypes.DELETE_PROGRAM: {
      return Object.assign({}, state, {loading: true});
    }

    case ProgramOverviewActionsTypes.DELETE_PROGRAM_SUCCESS: {
      const programs = action.payload;
      return Object.assign({}, state, {
        loading: false,
        programs
      });
    }

    default: {
      return state;
    }
  }
}

export function getPrograms(state$: Observable<State>) {
  return state$.select(s => s.programs);
}

export function programsLoaded(state$: Observable<State>) {
  return state$.select(s => s.loading);
}
