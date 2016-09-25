import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { MasterScreenerActions, MasterScreenerActionsTypes } from '../actions/master-screener.actions';
import { MasterScreener, MasterScreenerMetaData } from '../models';

export interface State {
  loaded: boolean;
  loading: boolean;
  masterScreeners: MasterScreener[];
  workingVersion: number;
  error: string;
  meta: MasterScreenerMetaData;
}

const ERROR_TYPES = {
  failedVersionLoad: (version: number) => {return `failed to load version:${version} of master screener`; },
  failedToChangeVersion: (version: number) => {
    return `failed to change to version:${version} of master screener`;
  },
  failedMetaDataLoad: () => {return 'unable to load meta data on available screeners'; }
};

export const initialState: State = {
  loaded: false,
  loading: false,
  masterScreeners: [],
  workingVersion: undefined,
  error: '',
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
        masterScreeners: state.masterScreeners.concat(action.payload)
      });
    }

    // change current working version to a loaded version
    case MasterScreenerActionsTypes.CHANGE_VERSION: {
      return state;
    }

    case MasterScreenerActionsTypes.CHANGE_VERSION_SUCCESS: {
      return Object.assign({}, state, {
        workingVersion: action.payload
      });
    }

    case MasterScreenerActionsTypes.CHANGE_VERSION_FAILURE: {
      return Object.assign({}, state, {
        error: ERROR_TYPES.failedToChangeVersion(action.payload)
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

export function getVersions(state$: Observable<State>) {
  return state$.select(s => s.meta).map(meta => meta.versions);
}
