import 'rxjs/add/operator/publishReplay';
import { multicast } from 'rxjs/operator/multicast';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import * as fromMasterScreener from './master-screener/master-screener.reducer';
import * as fromEditScreener from './master-screener/edit/edit.reducer';

export interface State {
  masterScreener: fromMasterScreener.State;
  editScreener: fromEditScreener.State;
}

const reducers = {
  masterScreener: fromMasterScreener.reducer,
  editScreener: fromEditScreener.reducer
};

const productionReducer = combineReducers(reducers);

export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}

export function getMasterScreenerState(state$: Observable<State>) {
  return state$.select(state => state.masterScreener);
}

export function getEditScreenerState(state$: Observable<State>) {
  return state$.select(state => state.editScreener);
}

export const getVersions = share(compose(fromMasterScreener.getVersions, getMasterScreenerState));

export const getWorkingQuestionCount =
  share(compose(fromMasterScreener.getQuestionCount, getMasterScreenerState));

export const getWorkingCreationDate =
  share(compose(fromMasterScreener.getCreatedDate, getMasterScreenerState));

export const getWorkingNumber =
  share(compose(fromMasterScreener.getWorkingVersionNumber, getMasterScreenerState));

export const getLoading =
  share(compose(fromMasterScreener.getLoading, getMasterScreenerState));

export const getErrors = share(compose(fromMasterScreener.getErrors, getMasterScreenerState));

export const getKeys = share(compose(fromMasterScreener.getKeys, getMasterScreenerState));

export const flattenedQuestions =
  share(compose(fromMasterScreener.getFlattenedQuestions, getMasterScreenerState));

export const getPresentEditScreener =
  share(compose(fromEditScreener.getPresentScreener, getEditScreenerState));


/* https://github.com/ngrx/example-app/blob/final/src/util.ts */
interface SelectorFn<T, V> {
  (input$: Observable<T>): Observable<V>;
}

interface Selector<T, V> extends SelectorFn<T, V> {
  readonly cachedResult?: null | Observable<V>;
  reset(): void;
  override(source$: Observable<V>): void;
}

function share<T, V>(selectFn: SelectorFn<T, V>): Selector<T, V> {
  let cachedResult: null | Observable<V>;


  const override = function (source$: Observable<V>) {
    cachedResult = source$;
  };

  const reset = function () {
    cachedResult = null;
  };

  const multicastFactory = function () {
    return new ReplaySubject<V>(1);
  };

  const selector: any = function (input$: Observable<T>) {
    if (Boolean(cachedResult)) {
      return cachedResult;
    }

    return cachedResult = multicast.call(selectFn(input$), multicastFactory).refCount();
  };

  selector.override = override;
  selector.reset = reset;
  Object.defineProperty(selector, 'cachedResult', {
    configurable: true,
    enumerable: true,
    get() {
      return cachedResult;
    }
  });

  return selector;
}