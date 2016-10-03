import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { MasterScreenerActions, MasterScreenerActionsTypes } from './master-screener.actions';
import { MasterScreener } from '../models/master-screener';
import { Key } from '../models/key';
import { Question } from '../../shared/models';
import { cloneDeep } from 'lodash';
// for debugging remove after
import 'rxjs/add/operator/do';


export interface State {
  loading: boolean;
  // i'm not sure if this is the right place for the versions of the master screener 
  // but i dont want to make a reducer solely for it
  versions: Array<number>;
  masterScreener: MasterScreener;
  error: string;
  workingVersion: number;
}

const ERROR_TYPES = {
  failedVersionLoad: () => {return `failed to load master screener`; },
  failedMetaDataLoad: () => {return 'unable to load meta data on available screeners'; }
};

export const initialState: State = {
  loading: false,
  error: '',
  versions: [],
  workingVersion: undefined,
  masterScreener: {
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
};



export function reducer(state = initialState, action: MasterScreenerActions): State {
  switch (action.type) {
    // load a version from the api server
    case MasterScreenerActionsTypes.LOAD_MASTER_SCREENER_VERSION: {
      const newState = cloneDeep(state);
      newState.loading = true;
      newState.error = '';
      return newState;
    }

    case MasterScreenerActionsTypes.CHANGE_MASTER_SCREENER_VERSION: {
      if (typeof action.payload === 'boolean') {
        const newState = cloneDeep(state);
        newState.error = ERROR_TYPES.failedVersionLoad();
        newState.loading = false;
        newState.workingVersion = 0;
        return newState;
      }
      const masterScreener = <MasterScreener>cloneDeep(action.payload);
      const newState = cloneDeep(state);
      newState.masterScreener = masterScreener;
      newState.loading = false;
      newState.error = '';
      newState.workingVersion = masterScreener.meta.screener.version;
      return newState;
    }

    case MasterScreenerActionsTypes.LOAD_VERSIONS_INFO: {
      return state;
    }

    case MasterScreenerActionsTypes.CHANGE_VERSIONS_INFO: {
      const versions: number[] = [].concat(action.payload);
      const newState = cloneDeep(state);
      newState.versions = versions;
      return newState;
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
  return state$.select(s => s.masterScreener.meta.questions.totalCount)
    .do(s => console.log(s));
}

export function getCreatedDate(state$: Observable<State>) {
  return state$.select(s => s.masterScreener.meta.screener.created);
}

export function getKeys(state$: Observable<State>) {
  return state$.select(s => s.masterScreener.questions)
    .switchMap<Key[]>( (questions: Question[]) => {
      const keys: Key[] = questions.reduce( (acc: Key[], curr: Question) => {
        // push the question key doesn't matter if expandable or not
        acc.push({name: curr.key, type: curr.type});
        if (!curr.expandable) {
          return acc;
        }
        curr.conditonalQuestions.forEach( question => acc.push({name: question.key, type: question.type}));
        return acc;
      }, []);
      return Observable.of(keys);
    });
}

export function getFlattenedQuestions(state$: Observable<State>) {
  return state$.select(s => s.masterScreener.questions)
    .switchMap<Question[]>( (questions: Question[]) => {
      const q: Question[] = questions.reduce( (acc: Question[], curr: Question) => {
        acc.push(curr);
        if (!curr.expandable) {
          return acc;
        }
        curr.conditonalQuestions.forEach( question => acc.push(question));
        return acc;
      }, []);
      return Observable.of(q);
    });
}
