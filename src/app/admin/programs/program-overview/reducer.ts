import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { ProgramOverviewActionsTypes, ProgramOverviewActions} from './actions';
import { ApplicationFacingProgram } from '../../models/program';
import * as _ from 'lodash';

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
      const newState = _.cloneDeep(state);
      newState.loading = true;
      return newState;
    }

    case ProgramOverviewActionsTypes.LOAD_PROGRAMS_FAILURE: {
      const newState = _.cloneDeep(state);
      newState.loading = false;
      newState.error = 'unable to load programs';
      return newState;
    }

    case ProgramOverviewActionsTypes.LOAD_PROGRAMS_SUCCESS: {
      const newState = _.cloneDeep(state);
      newState.loading = false;
      newState.error = '';
      newState.programs = [...<ApplicationFacingProgram[]>action.payload];
      return newState;
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
