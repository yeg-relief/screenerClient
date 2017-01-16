import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { MasterScreenerActions, MasterScreenerActionsTypes } from './master-screener.actions';
import { MasterScreener } from '../models/master-screener';
import { Key } from '../models/key';
import { Question } from '../../shared/models';
import { cloneDeep } from 'lodash';

export interface State {
  loading: boolean;
  versions: Array<number>;
  masterScreener: MasterScreener;
  error: string;
  workingVersion: number;
  cachedVersions: Array<MasterScreener>;
}

const ERROR_TYPES = {
  failedVersionLoad: () => { return `failed to load master screener`; },
  failedMetaDataLoad: () => { return 'unable to load meta data on available screeners'; }
};

export const initialState: State = {
  loading: false,
  error: '',
  versions: [],
  workingVersion: undefined,
  masterScreener: emptyScreener(),
  cachedVersions: []
};

function emptyScreener(): MasterScreener{
  return {
    version: 0,
    questions: [],
    meta: {
      questions: {
        totalCount: undefined,
      },
      screener: {
        version: undefined,
        created: undefined,
      }
    }
  }
}



export function reducer(state = initialState, action: MasterScreenerActions): State {
  switch (action.type) {

    case MasterScreenerActionsTypes.CHANGE_TO_LATEST_SCREENER_VERSION: {      
      const latest = state.cachedVersions.reduce( (accum, screener) => {
        if(screener.version > accum.version) {
          accum = cloneDeep(screener);
        }
        return accum;
      }, emptyScreener());
      state.masterScreener = latest;
      state.workingVersion = latest.version;
      return state;
    }
    // load a version from the api server
    case MasterScreenerActionsTypes.LOAD_MASTER_SCREENER_VERSION: {
      const newState = cloneDeep(state);
      newState.loading = true;
      newState.error = '';
      return newState;
    }

    /* used to load a screener, or array of screeners, into cachedVersions */
    case MasterScreenerActionsTypes.LOAD_SCREENERS: {
      const newScreener = <MasterScreener>cloneDeep(action.payload);
      const newState = cloneDeep(state);
      if (Array.isArray(newScreener)) {
        newState.loading = false;
        newState.error = '';
        newScreener.forEach(screener => {
          if (state.versions.find(stateVersions => stateVersions === screener.version) === undefined) {
            newState.versions.push(screener.version);
          }
          if (state.cachedVersions.find(stateScreener => stateScreener.version === screener.version) === undefined) {
            newState.cachedVersions.push(screener);
          }
        })
      } else {
        return state;
      }
      return newState;
    }

    case MasterScreenerActionsTypes.CHANGE_MASTER_SCREENER_VERSION: {

      switch (typeof action.payload) {
        case 'boolean': {
          const newState = cloneDeep(state);
          newState.error = ERROR_TYPES.failedVersionLoad();
          newState.loading = false;
          newState.workingVersion = 0;
          return newState;
        }

        case 'number': {
          const cachedVersionNumber = <number>action.payload;
          const newState = cloneDeep(state);
          const screener = state.cachedVersions.find((cachedScreener: MasterScreener) => cachedScreener.version === cachedVersionNumber);
          if (screener !== undefined) {
            newState.masterScreener = cloneDeep(screener);
            newState.loading = false;
            newState.error = '';
            newState.workingVersion = screener.version;
          }
          return newState;
        }

        case 'object': {
          const masterScreener = <MasterScreener>cloneDeep(action.payload);
          const newState = cloneDeep(state);
          newState.masterScreener = masterScreener;
          newState.loading = false;
          newState.error = '';
          newState.workingVersion = masterScreener.version;
          return newState;
        }

        default: {
          return state;
        }
      }
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
  return state$.select(s => s.workingVersion);
}

export function getVersions(state$: Observable<State>) {
  return state$.select(s => s.versions);
}

export function getQuestionCount(state$: Observable<State>) {
  return state$.select(s => s.masterScreener.meta.questions.totalCount);
}

export function getCreatedDate(state$: Observable<State>) {
  return state$.select(s => s.masterScreener.meta.screener.created);
}

export function getKeys(state$: Observable<State>) {
  return state$.select(s => s.masterScreener.questions)
    .switchMap((questions: Question[]) => {
      const keys: Key[] = questions.reduce((acc: Key[], curr: Question) => {
        // push the question key doesn't matter if expandable or not
        acc.push({ name: curr.key, type: curr.type });
        if (!curr.expandable) {
          return acc;
        }
        curr.conditonalQuestions.forEach(question => acc.push({ name: question.key, type: question.type }));
        return acc;
      }, []);
      return Observable.of(keys);
    });
}

export function getFlattenedQuestions(state$: Observable<State>) {
  return state$.select(s => s.masterScreener.questions)
    .switchMap((questions: Question[]) => {
      const q: Question[] = questions.reduce((acc: Question[], curr: Question) => {
        acc.push(curr);
        if (!curr.expandable) {
          return acc;
        }
        curr.conditonalQuestions.forEach(question => acc.push(question));
        return acc;
      }, []);
      return Observable.of(q);
    });
}
