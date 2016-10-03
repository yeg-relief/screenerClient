import '@ngrx/core/add/operator/select';
import { KeyActions, KeyActionsTypes } from './key.actions';
import { Key } from '../../models/key';
import { Observable } from 'rxjs/Observable';
import { cloneDeep } from 'lodash';

export interface State {
  past: Array<Key[]>;
  present: Key[];
  future: Array<Key[]>;
}

export const initialState: State = {
  past: new Array<Key[]>(),
  present: [],
  future: Array<Key[]>()
};

export function reducer(state = initialState, action: KeyActions): State {
  switch (action.type) {
    case KeyActionsTypes.LOAD_KEYS: {
      return initialState;
    }

    case KeyActionsTypes.LOAD_KEYS_SUCCESS: {
      const keys = <Key[]>cloneDeep(action.payload);
      const newState = cloneDeep(state);
      newState.present = keys;
      return newState;
    }

    default: {
      return state;
    }
  }
}

export function getPresentKeys(state$: Observable<State>) {
  return state$.select(s => s.present);
}
