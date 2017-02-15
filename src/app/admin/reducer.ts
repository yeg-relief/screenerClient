import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/observable/combineLatest';
import { multicast } from 'rxjs/operator/multicast';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import * as fromKeyOverview from './keys/reducer';

import * as fromProgramOverview from './programs/program-overview/reducer';

import { Question } from '../shared/models';
import { Key } from './models/key';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/find';
import { cloneDeep } from 'lodash';
import { ApplicationFacingProgram } from './models/program';

export interface State {
  keyOverview: fromKeyOverview.State;
  programOverview: fromProgramOverview.State;
}

const reducers = {
  keyOverview: fromKeyOverview.reducer,
  programOverview: fromProgramOverview.reducer
};

const productionReducer = combineReducers(reducers);

export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}


export function getProgramOverviewState(state$: Observable<State>) {
  return state$.select(state => state.programOverview);
}

export function getKeyOverview(state$: Observable<State>) {
  return state$.select(state => state.keyOverview);
}


/* for programs */
export const getLoadedPrograms = share(compose(fromProgramOverview.getPrograms, getProgramOverviewState));

export const areProgramsLoaded = share(compose(fromProgramOverview.programsLoaded, getProgramOverviewState));

export const findProgram = function (state$: Observable<State>, guid: string){
  const searchProgram = state$.select(state => state.programOverview)
    .map(state => state.programs)
    .concatMap(vals => vals)
    .find(program => guid === program.guid);

  const emptyProgram: ApplicationFacingProgram = {
    guid: 'new',
    user: {
      guid: 'new',
      title: '',
      details: '',
      externalLink: '',
      created: 0,
      tags: []
    },
    application: []
  };

  if ( guid === 'new' ) {
    return Observable.of(emptyProgram);
  }
  return searchProgram;
};


/* for keys **key/overview etc** */
export const allLoadedKeys = share(compose(fromKeyOverview.getLoadedKeys, getKeyOverview));

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
