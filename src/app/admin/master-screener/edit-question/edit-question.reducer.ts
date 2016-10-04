import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { EditQuestionActions, EditQuestionActionTypes } from './edit-question.actions';
import { Question } from '../../../shared/models';
import { Key } from '../../models/key';
import { cloneDeep } from 'lodash';

import 'rxjs/add/operator/do';
// I think we don't need to keep a history of unused keys
export type StateType = {
  question: Question;
  unusedKeys: Key[];
  details: QuestionDetails;
};

export type QuestionDetail = {
  msg: string;
  open: string[];
  label: string;
}

// this will be hints and or errors
export type QuestionDetails = QuestionDetail[];


export interface State {
  originalQuestionKey: string;
  past: StateType[];
  present: StateType;
  future: StateType[];
};

const blankQuestion: Question = {
  type: undefined,
  label: undefined,
  expandable: undefined,
  conditonalQuestions: undefined,
  options: undefined,
  key: 'empty',
  controlType: undefined
};

export const initialState: State = {
  originalQuestionKey: '',
  past: [],
  present: {
    question: blankQuestion,
    unusedKeys: [],
    details: [
      {
        msg: 'Pick a key',
        open: ['key'],
        label: 'no key picked'
      },
    ]
  },
  future: []
};

export function reducer(state = initialState, action: EditQuestionActions): State {
  switch (action.type) {

    case EditQuestionActionTypes.INIT_EDIT: {
      console.log('[EDIT_QUESTION] INIT_EDIT');
      const questionKey = <string>cloneDeep(action.payload);
      // editing multiple questions sequentially means state has to be reset upon editing a new question
      const newState: State = {
        originalQuestionKey: questionKey,
        past: [],
        present: {
          question: blankQuestion,
          unusedKeys: [],
          details: [
            {
              msg: 'Pick a key',
              open: ['key'],
              label: 'no key picked'
            },
          ]
        },
        future: []
      };
      return newState;
    }

    case EditQuestionActionTypes.LOAD_QUESTION: {
      console.log('[EDIT_QUESTION] LOAD_QUESTION');
      const questionToEdit = <Question>cloneDeep(action.payload);
      const newState: State = cloneDeep(state);
      newState.present.question = questionToEdit;
      return newState;
    }

    case EditQuestionActionTypes.LOAD_UNUSED_KEYS: {
      console.log('[EDIT_QUESTION] LOAD_UNUSED_KEYS');
      const unusedKeys = <Key[]>cloneDeep(action.payload);
      const newState: State = cloneDeep(state);
      newState.present.unusedKeys = unusedKeys;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_CONTROL_TYPE: {
      console.log('[EDIT_QUESTION] CHANGE_CONTROL_TYPE');
      const newControlType = <'radio' | 'input'>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [...state.past, state.present];
      newPresent.question.controlType = newControlType;
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_QUESTION_TYPE: {
      console.log('[EDIT_QUESTION] CHANGE_QUESTION_TYPE');
      const newQuestionType = <'boolean' | 'number' | 'text'>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [...state.past, state.present];
      newPresent.question.type = newQuestionType;
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_LABEL: {
      console.log('[EDIT_QUESTION] CHANGE_LABEL');
      const newLabel = <string>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [...state.past, state.present];
      newPresent.question.label = newLabel;
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_KEY: {
      console.log('[EDIT_QUESTION] CHANGE_KEY');
      const newKeyName = <string>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [state.present, ...state.past];
      newPresent.question.key = newKeyName;
      const noKeyPicked = newPresent.details.findIndex(detail => detail.label === 'no key picked');
      if ( typeof noKeyPicked !== 'undefined') {
        newPresent.details.splice(noKeyPicked, 1);
      }
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_EXPANDABLE: {
      console.log('[EDIT_QUESTION] CHANGE_EXPANDABLE');
      const newExpandable = <boolean>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [...state.past, state.present];
      newPresent.question.expandable = newExpandable;
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }
    // TODO
    case EditQuestionActionTypes.CLEAR_QUESTION: {
      console.log('[EDIT_QUESTION] CLEAR_QUESTION');
      if (state.present.question === blankQuestion) {
        return state;
      }
      const question = blankQuestion;
      const newState = cloneDeep(state);
      const newPast = [...state.past, state.present];
      newState.present.question = question;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.UNDO: {
      if (state.past.length <= 0) {
        return state;
      }
      console.log('UNDO');
      console.log(state);
      const newState = cloneDeep(state);
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      let newFuture;
      newFuture = [state.present, ...state.future];
      newState.past = cloneDeep(newPast);
      newState.future = newFuture;
      newState.present = cloneDeep(previous);
      return Object.assign({}, state, {
        past: newPast,
        future: newFuture,
        present: previous
      });
    }

    case EditQuestionActionTypes.REDO: {
      if (state.future.length <= 0) {
        return state;
      }
      console.log('REDO');
      console.log(state);
      const newState = cloneDeep(state);
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      let newPast;
      newPast = [...state.past, state.present];
      newState.past = newPast;
      newState.future = cloneDeep(newFuture);
      newState.present = cloneDeep(next);

      return Object.assign({}, state, {
        past: newPast,
        present: next,
        future: newFuture
      });
    }

    default: {
      console.log('[EDIT_QUESTION] DEFAULT');
      return state;
    }
  }
}

export function getPresentQuestion(state$: Observable<State>) {
  return state$.select((s: State) => s.present);
}

export function getEditQuestionKey(state$: Observable<State>) {
  return state$.select((s: State) => s.originalQuestionKey);
}

export function getQuestionDetails(state$: Observable<State>) {
  return getPresentQuestion(state$)
    .map(present => present.details);
}
