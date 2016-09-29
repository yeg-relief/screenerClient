import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { MasterScreenerActions, MasterScreenerActionsTypes } from './master-screener.actions';
import { MasterScreener } from '../models/master-screener';

export interface State {
  loading: boolean;
  masterScreener: MasterScreener;
  error: string;
}

const loadingString = '. . .';
const ERROR_TYPES = {
  failedVersionLoad: () => {return `failed to load master screener`; },
  failedMetaDataLoad: () => {return 'unable to load meta data on available screeners'; }
};

export const initialState: State = {
  loading: false,
  error: '',
  masterScreener: {
    questions: [],
    meta: {
      questions: {
        totalCount: undefined,
        collapsableCount: undefined,
        staticCount: undefined,
        dynamicCount: undefined
      },
      versions: [],
      screener: {
        version: undefined,
        created: undefined,
      }
    }
  }
};



export function reducer(state = initialState, action: MasterScreenerActions): State {
  switch (action.type) {
    // load a version from the api server
    case MasterScreenerActionsTypes.LOAD_VERSION: {
      return Object.assign({}, state, {
        loading: true,
        workingVersion: loadingString,
        created: loadingString,
        questionCount: loadingString
      });
    }

    case MasterScreenerActionsTypes.CHANGE_VERSION: {
      if (typeof action.payload === 'boolean') {
        const error = ERROR_TYPES.failedVersionLoad();
        return Object.assign({}, state, {
          loading: false,
          error: error
        });
      }
      const masterScreener: MasterScreener = <MasterScreener>action.payload;

      return Object.assign({}, state, {
        loading: false,
        errors: '',
        masterScreener: masterScreener
      });
    }

    default: {
      return state;
    }
  }
}

export function getLoading(state$: Observable<State>) {
  return state$.select(s => s.loading);
}

export function getErrors(state$: Observable<State>) {
  return state$.select(s => s.error);
}

export function getWorkingVersionNumber(state$: Observable<State>) {
  return state$.select(s => s.masterScreener.meta.screener.version);
}

export function getVersions(state$: Observable<State>) {
  return state$.select(s => s.masterScreener.meta.versions);
}

export function getQuestionCount(state$: Observable<State>) {
  return state$.select(s => s.masterScreener.meta.questions.totalCount);
}

export function getCreatedDate(state$: Observable<State>) {
  return state$.select(s => s.masterScreener.meta.screener.created);
}
