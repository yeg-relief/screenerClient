import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { MasterScreenerActions, MasterScreenerActionsTypes } from './master-screener.actions';
import { MasterScreener, MasterScreenerMetaData } from './master-screener.model';

export interface State {
  loaded: boolean;
  loading: boolean;
  masterScreeners: Map<number, MasterScreener>;
  workingVersion: number;
  questionCount: number;
  created: string;
  error: string;
  meta: MasterScreenerMetaData;
}

const ERROR_TYPES = {
  failedVersionLoad: (version: number) => {return `failed to load version:${version} of master screener`; },
  failedMetaDataLoad: () => {return 'unable to load meta data on available screeners'; }
};

export const initialState: State = {
  loaded: false,
  loading: false,
  masterScreeners: new Map<number, MasterScreener>(),
  workingVersion: undefined,
  error: '',
  questionCount: undefined,
  created: '',
  meta: {
    versions: []
  }
};



export function reducer(state = initialState, action: MasterScreenerActions): State {
  switch (action.type) {
    // load a version from the api server
    case MasterScreenerActionsTypes.LOAD_VERSION: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case MasterScreenerActionsTypes.LOAD_VERSION_FAILURE: {
      return Object.assign({}, state, {
        loading: false,
        error: ERROR_TYPES.failedVersionLoad(action.payload)
      });
    }

    case MasterScreenerActionsTypes.LOAD_VERSION_SUCCESS: {
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        masterScreeners: state.masterScreeners.set(action.payload.version, action.payload)
      });
    }


    case MasterScreenerActionsTypes.CHANGE_VERSION: {
      const masterScreener: MasterScreener = action.payload;
      const newMap = new Map<number, MasterScreener>();
      // stupid way to clone?
      state.masterScreeners.forEach( (masterScreener: MasterScreener) => {
        newMap.set(masterScreener.version, masterScreener);
      });
      newMap.set(masterScreener.version, masterScreener);
      const questionCount = [].concat.apply([], masterScreener.questions).length;


      return Object.assign({}, state, {
        workingVersion: masterScreener.version,
        masterScreeners: newMap,
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

export function getLoaded(state$: Observable<State>) {
  return state$.select(s => s.loaded);
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

export function getWorkingVersion(state$: Observable<State>) {
  return state$.select(s => s.masterScreeners.get(s.workingVersion));
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

