import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import { Observable } from 'rxjs/Observable';
import {EditScreenerActions, EditScreenerActionsTypes} from './edit.actions';
import { MasterScreener } from '../../models/master-screener';
import { Question } from '../../../shared/models';
import { cloneDeep } from 'lodash';

export interface State {
  workingVersion: number;
  saving: boolean;
  past: MasterScreener[];
  present: MasterScreener;
  future: MasterScreener[];
}

export const initialState: State = {
  workingVersion: undefined,
  saving: false,
  past: new Array<MasterScreener>(),
  present: {
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
  },
  future: new Array<MasterScreener>()
};

export function reducer(state = initialState, action: EditScreenerActions): State {
  switch (action.type) {

    case EditScreenerActionsTypes.INIT_EDIT: {
      const workingVersion = <number>action.payload;
      return Object.assign({}, state, {
        workingVersion: workingVersion
      });
    }

    case EditScreenerActionsTypes.LOAD_SCREENER: {
      const newScreener = <MasterScreener>action.payload;
      return Object.assign({}, state, {
        past: [],
        present: newScreener,
        future: []
      });
    };

    case EditScreenerActionsTypes.SAVE_SCREENER: {
      console.log('save screener called');
      return Object.assign({}, state, {
        saving: true
      });
    };

    case EditScreenerActionsTypes.SAVE_SUCCESS: {
      console.log('save screener success called');
      return Object.assign({}, state, {
        saving: false
      });
    }

    case EditScreenerActionsTypes.ADD_QUESTION: {
      console.log('ADD_QUESTION CALLED');
      const addedQuestion = <Question>action.payload;
      const present = <MasterScreener>cloneDeep(state.present);
      present.questions = present.questions.concat(addedQuestion);
      present.meta.questions.totalCount = present.meta.questions.totalCount + 1;

      return Object.assign({}, state, {
        past: state.past.concat(state.present),
        present: present
      });
    };

    case EditScreenerActionsTypes.REMOVE_QUESTION: {
      const removedQuestion = <Question>action.payload;
      const present = <MasterScreener>cloneDeep(state.present);
      const index = present.questions.findIndex(stateQuestion => {
        return stateQuestion.key === removedQuestion.key;
      });
      if (typeof index === 'undefined') {
        return state;
      }
      present.questions.splice(index, 1);
      present.meta.questions.totalCount = present.meta.questions.totalCount - 1;

      return Object.assign({}, state, {
        past: state.past.concat(state.present),
        present: present
      });
    }

    case EditScreenerActionsTypes.EDIT_QUESTION: {
      const originalKey = <string>action.payload.originalKey;
      const editedQuestion = <Question>action.payload.editedVersion;
      const present: MasterScreener = cloneDeep(state.present);
      const index = present.questions.findIndex(stateQuestion => {
        return stateQuestion.key === originalKey;
      });
      if (typeof index === 'undefined') {
        return state;
      }
      present.questions.splice(index, 1, editedQuestion);
      return Object.assign({}, state, {
        past: state.past.concat(state.present),
        present: present
      });
    }

    case EditScreenerActionsTypes.CLEAR_QUESTIONS: {
      const present: MasterScreener = cloneDeep(state.present);
      present.questions = [];
      present.meta.questions.totalCount = 0;
      return Object.assign({}, state, {
        past: state.past.concat(state.present),
        present: present
      });
    }

    case EditScreenerActionsTypes.SWAP_QUESTIONS: {
      const questionA = action.payload[0];
      const questionB = action.payload[1];
      const present: MasterScreener = cloneDeep(state.present);
      const indexA = present.questions.findIndex(stateQuestion => {
        return stateQuestion.key === questionA.key;
      });

      const indexB = present.questions.findIndex(stateQuestion => {
        return stateQuestion.key === questionB.key;
      });

      if (typeof indexA === 'undefined' || typeof indexB === 'undefined') {
        return state;
      }
      present.questions.splice(indexA, 1, questionB);
      present.questions.splice(indexB, 1, questionA);

      return Object.assign({}, state, {
        past: state.past.concat(state.present),
        present: present
      });
    }

    /*
      higher index = more recent             lower index = more recent
      
      [past0, past1, past2]    : present  : [future0, future1, future3]
      =========================>   TIME   ===============================>
    */
    case EditScreenerActionsTypes.UNDO: {
      if (state.past.length <= 0) {
        return state;
      }
      const recentPast: MasterScreener = state.past.splice(state.past.length - 1, 1)[0];
      // spliced off the most recent past
      const newPast = cloneDeep(state.past);
      const newFuture = new Array<MasterScreener>(state.present).concat(state.future);
      const newPresent = recentPast;
      return Object.assign({}, state, {
        past: newPast,
        future: newFuture,
        present: newPresent
      });
    }

    case EditScreenerActionsTypes.REDO: {
      if (state.future.length <= 0) {
        return state;
      }
      const recentFuture: MasterScreener = state.future.splice(0, 1)[0];
      const newFuture = cloneDeep(state.future);
      const newPast = state.past.concat(state.present);
      const newPresent = recentFuture;
      return Object.assign({}, state, {
        past: newPast,
        present: newPresent,
        future: newFuture
      });
    }

    default: {
      return state;
    }
  }
}


export function getPresentScreener(state$: Observable<State>) {
  return state$.select(s => s.present);
}


export function getPresentQuestions(state$: Observable<State>) {
  return getPresentScreener(state$)
    .map(screener => screener.questions);
}

export function getPresentVersion(state$: Observable<State>) {
  return getPresentScreener(state$).map(s => s.meta.screener.version);
}

export function getWorkingEditVersion(state$: Observable<State>) {
  return state$.select(s => s.workingVersion);
}

export function unsavedEdits(state$: Observable<State>) {
  return state$.select(s => s.past)
    .map(past => past.length > 0);
}

export function getSavingState(state$: Observable<State>) {
  return state$.select(s => s.saving);
}
