import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/observable/combineLatest';
import { multicast } from 'rxjs/operator/multicast';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import * as fromMasterScreener from './master-screener/master-screener.reducer';
import * as fromEditScreener from './master-screener/edit/edit.reducer';
import * as fromEditQuestion from './master-screener/edit-question/edit-question.reducer';
import * as fromKeys from './master-screener/keys/key.reducer';
import { Question } from '../shared/models';
import { Key } from './models/key';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import { cloneDeep } from 'lodash';

export interface State {
  masterScreener: fromMasterScreener.State;
  editScreener: fromEditScreener.State;
  editQuestion: fromEditQuestion.State;
  keys: fromKeys.State;
}

const reducers = {
  masterScreener: fromMasterScreener.reducer,
  editScreener: fromEditScreener.reducer,
  editQuestion: fromEditQuestion.reducer,
  keys: fromKeys.reducer
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

export function getEditQuestionState(state$: Observable<State>) {
  return state$.select(state => state.editQuestion);
}

export function getKeysState(state$: Observable<State>) {
  return state$.select(state => state.keys);
}

/* for master-screener overview */
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

/* for master-screener edit */
export const getPresentEditScreener =
  share(compose(fromEditScreener.getPresentScreener, getEditScreenerState));

// the following two questions have confusing names #REFACTOR
export const getPresentEditQuestions =
  share(compose(fromEditScreener.getPresentQuestions, getEditScreenerState));

export const unsavedEdits = share(compose(fromEditScreener.unsavedEdits, getEditScreenerState));

// this function returns the edit version for the current screener in state
export const getPresentEditScreenerVersion =
  share(compose(fromEditScreener.getPresentVersion, getEditScreenerState));
// this function returns the "WORKING VERSION" which is found from init version derived from route
export const getCurrentEditWorkingVersion =
  share(compose(fromEditScreener.getWorkingEditVersion, getEditScreenerState));
/*
  if the previous two versions dont match then we must load a new version from the 
  data service
*/
export const getEditScreenerSaving = share(compose(fromEditScreener.getSavingState, getEditScreenerState));



/* for question edit */
export const getPresentQuestionEdit =
  share(compose(fromEditQuestion.getPresentQuestion, getEditQuestionState));

export const getOriginalKeyQuestionEdit =
  share(compose(fromEditQuestion.getEditQuestionKey, getEditQuestionState));

export const getQuestionErrors =
  share(compose(fromEditQuestion.getQuestionErrors, getEditQuestionState));

export const unsavedQuestionEdits = share(compose(fromEditQuestion.unsavedEdits, getEditQuestionState));

export const questionSaved = share(compose(fromEditQuestion.savedQuestion, getEditQuestionState));

/* for keys */
export const getPresentKeys =
  share(compose(fromKeys.getPresentKeys, getKeysState));

export const findEditQuestion = function (state$: Observable<State>) {
  return Observable.combineLatest<string, Question[]>(
    state$.let(getOriginalKeyQuestionEdit),
    state$.let(getPresentEditQuestions)
  )
  .map<Question>(([key, questions]) => {
    const q: Question = questions.find((question: Question) => question.key === key);
    if (typeof q === 'undefined') {
      return {
        type: undefined,
        label: undefined,
        expandable: false,
        conditonalQuestions: [],
        options: [],
        key: 'empty',
        controlType: undefined
      };
    }
    return cloneDeep(q);
  });
};

export const findUnusedKeys = function (state$: Observable<State>) {
  return Observable.combineLatest<Question[], Key[]>(
    state$.let(getPresentEditQuestions),
    state$.let(getPresentKeys)
  )
  .map<Key[]>(([questions, keys]) => {
    const usedKeyNames: string[] = [];
    questions.forEach( question => {
      usedKeyNames.push(question.key);
      if (question.expandable) {
        question.conditonalQuestions.forEach(conditionalQuestion => {
          usedKeyNames.push(conditionalQuestion.key);
        });
      }
    });
    const unusedKeys: Key[] = keys.reduce( (acc: Key[], present: Key) => {
      const presentIndex = usedKeyNames.findIndex(keyName => keyName === present.name);
      if (presentIndex < 0) {
        acc = acc.concat(present);
      }
      return acc;
    }, []);
    return unusedKeys;
  });
};


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
