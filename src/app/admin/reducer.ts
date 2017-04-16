import { Observable } from 'rxjs/Observable';
import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import * as fromKeyOverview from './keys/reducer';
import * as fromScreener from './screener/store/screener-reducer';
import * as fromProgramOverview from './programs/program-overview/reducer';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/find';
import { ApplicationFacingProgram } from './models/program';
import { createSelector } from 'reselect';

export interface State {
  keyOverview: fromKeyOverview.State;
  programOverview: fromProgramOverview.State;
  screener: fromScreener.State;
}

const reducers = {
  keyOverview: fromKeyOverview.reducer,
  programOverview: fromProgramOverview.reducer,
  screener: fromScreener.reducer
};

const productionReducer = combineReducers(reducers);


export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}

export function getScreenerState(state$: Observable<State>) {
  return state$.select(state => state.screener);
}

export function getProgramOverviewState(state$: Observable<State>) {
  return state$.select(state => state.programOverview);
}

export function getKeyOverview(state$: Observable<State>) {
  return state$.select(state => state.keyOverview);
}


/* for screener */
export const getForm = createSelector(getScreenerState, fromScreener.getForm, );

export const getScreenerError = createSelector(getScreenerState, fromScreener.getError, );

export const isScreenerLoading = createSelector(getScreenerState, fromScreener.isLoading, );

export const getConstantQuestions = createSelector(getScreenerState, fromScreener.getConstantQuestions, );

export const getConditionalQuestions = createSelector(fromScreener.getConditionalQuestionIDS, getScreenerState);

export const getSelectedConstantID = createSelector( getScreenerState, fromScreener.getSelectedConstantID);

export const getSelectedConditionalID = createSelector( getScreenerState, fromScreener.getSelectedConditionalID,);

export const getScreenerKeys = createSelector(getScreenerState, fromScreener.getKeys);

export const getUnusedScreenerKeys = createSelector( getScreenerState, fromScreener.getUnusedKeys,);

/* for programs */
export const getLoadedPrograms = createSelector(getProgramOverviewState, fromProgramOverview.getPrograms, );

export const areProgramsLoaded = createSelector( getProgramOverviewState, fromProgramOverview.programsLoaded,);

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
export const allLoadedKeys = createSelector(getKeyOverview, fromKeyOverview.getLoadedKeys);

