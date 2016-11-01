import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { ProgramOverviewActionsTypes, ProgramOverviewActions} from './actions';
import { UserFacingProgram } from '../../../shared/models';
import { cloneDeep } from 'lodash';

export interface State {
  loading: boolean;
  programs: UserFacingProgram[];
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
      const newState = cloneDeep(state);
      newState.loading = true;
      return newState;
    }

    case ProgramOverviewActionsTypes.LOAD_PROGRAMS_FAILURE: {
      const newState = cloneDeep(state);
      newState.loading = false;
      newState.error = 'unable to load programs';
      return newState;
    }

    case ProgramOverviewActionsTypes.LOAD_PROGRAMS_SUCCESS: {
      const newState = cloneDeep(state);
      newState.loading = false;
      newState.error = '';
      newState.programs = [...<UserFacingProgram[]>action.payload];
      return newState;
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
