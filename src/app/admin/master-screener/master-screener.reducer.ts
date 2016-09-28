import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { MasterScreenerActions, MasterScreenerActionsTypes } from './master-screener.actions';
import { MasterScreener, MasterScreenerMetaData } from '../models/master-screener';
import { Question } from '../../shared/models';

export interface State {
  loading: boolean;
  questions: Question[];
  workingVersion: number | string;
  questionCount: number | string;
  created: string;
  error: string;
  meta: MasterScreenerMetaData;
}

const ERROR_TYPES = {
  failedVersionLoad: () => {return `failed to load master screener`; },
  failedMetaDataLoad: () => {return 'unable to load meta data on available screeners'; }
};

export const initialState: State = {
  loading: false,
  questions: [],
  workingVersion: undefined,
  error: '',
  questionCount: undefined,
  created: '',
  meta: {
    versions: []
  }
};

const loadingString = '. . .';

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
        return Object.assign({}, state, {
          loading: false,
          errors: ERROR_TYPES.failedVersionLoad()
        });
      }
      const masterScreener: MasterScreener = action.payload;
      const questionCount = masterScreener.questions.reduce( (prev, curr) => {
        // if its not expandable add just 1
        if (!curr.expandable) {
          return prev + 1;
        }
        // if its expandable add 1 + the conditional questions 
        const combinedCount = curr.conditonalQuestions.reduce( (acc, next) => {

          return acc + 1;
        }, 1);
        return prev + combinedCount;
      }, 0);


      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        workingVersion: masterScreener.version,
        questions: [].concat(masterScreener.questions),
        created: masterScreener.created,
        questionCount: questionCount
      });
    }

    case MasterScreenerActionsTypes.LOAD_META_DATA: {
      return state;
    }

    case MasterScreenerActionsTypes.LOAD_META_DATA_SUCCESS: {
      const meta = action.payload;
      return Object.assign({}, state, {
        meta: meta
      });
    }

    case MasterScreenerActionsTypes.LOAD_META_DATA_FAILURE: {
      return Object.assign({}, state, {
        errors: ERROR_TYPES.failedMetaDataLoad()
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

export function getMeta(state$: Observable<State>) {
  return state$.select(s => s.meta);
}

export function getWorkingVersionNumber(state$: Observable<State>) {
  return state$.select(s => s.workingVersion);
}

export function getVersions(state$: Observable<State>) {
  return state$.select(s => s.meta).map(meta => meta.versions);
}

export function getQuestionCount(state$: Observable<State>) {
  return state$.select(s => s.questionCount);
}

export function getCreatedDate(state$: Observable<State>) {
  return state$.select(s => s.created);
}
