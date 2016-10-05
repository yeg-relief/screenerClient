import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { EditQuestionActions, EditQuestionActionTypes } from './edit-question.actions';
import { Question } from '../../../shared/models';
import { Key } from '../../models/key';
import { cloneDeep } from 'lodash';

import 'rxjs/add/operator/do';

// for question details
const LABELS = {
  NO_KEY_PICKED: 'no key picked',
  NO_LABEL_PICKED: 'no label picked',
  NO_CONTROL_PICKED: 'no control picked',
  NO_TYPE_PICKED: 'no type picked'
};

const MESSAGES = {
  NO_KEY_PICKED: 'Pick a key',
  NO_LABEL_PICKED: 'Write a label',
  NO_CONTROL_PICKED: 'Select a control type',
  NO_TYPE_PICKED: 'Select the type of answer you expect'
};

const OPEN_CONTROLS = {
  NO_KEY_PICKED: ['key'],
  NO_LABEL_PICKED: ['label'],
  NO_CONTROL_PICKED: ['control'],
  NO_TYPE_PICKED: ['type']
};


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
  expandable: false,
  conditonalQuestions: [],
  options: [],
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
        msg: MESSAGES.NO_KEY_PICKED,
        open: OPEN_CONTROLS.NO_KEY_PICKED,
        label: LABELS.NO_KEY_PICKED
      },
      {
        msg: MESSAGES.NO_LABEL_PICKED,
        open: OPEN_CONTROLS.NO_LABEL_PICKED,
        label: LABELS.NO_LABEL_PICKED
      },
      {
        msg: MESSAGES.NO_CONTROL_PICKED,
        open: OPEN_CONTROLS.NO_CONTROL_PICKED,
        label: LABELS.NO_CONTROL_PICKED
      },
      {
        msg: MESSAGES.NO_TYPE_PICKED,
        open: OPEN_CONTROLS.NO_TYPE_PICKED,
        label: LABELS.NO_TYPE_PICKED
      }
    ]
  },
  future: []
};

export function reducer(state = initialState, action: EditQuestionActions): State {
  switch (action.type) {

    case EditQuestionActionTypes.INIT_EDIT: {
      console.log('[EDIT_QUESTION] INIT_EDIT');
      const questionKey = <string>action.payload;
      // editing multiple questions sequentially means state has to be reset upon editing a new question
      // unsure if clone is needed
      const newState: State = cloneDeep(initialState);
      newState.originalQuestionKey = questionKey;
      return newState;
    }

    case EditQuestionActionTypes.LOAD_QUESTION: {
      console.log('[EDIT_QUESTION] LOAD_QUESTION');
      const questionToEdit = <Question>cloneDeep(action.payload);
      const newState: State = cloneDeep(state);
      newState.present.question = questionToEdit;
      if (newState.present.question.key !== 'empty') {
        newState.present.details = [];
      }
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
      const nocontrolIndex = newPresent.details.findIndex(detail => detail.label === LABELS.NO_CONTROL_PICKED);
      if ( typeof nocontrolIndex !== 'undefined') {
        newPresent.details.splice(nocontrolIndex, 1);
      }
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
      const notypeIndex = newPresent.details.findIndex(detail => detail.label === LABELS.NO_TYPE_PICKED);
      if ( typeof notypeIndex !== 'undefined') {
        newPresent.details.splice(notypeIndex, 1);
      }
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
      const nolabelIndex = newPresent.details.findIndex(detail => detail.label === LABELS.NO_LABEL_PICKED);
      if ( typeof nolabelIndex !== 'undefined') {
        newPresent.details.splice(nolabelIndex, 1);
      }
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
      const nokeyIndex = newPresent.details.findIndex(detail => detail.label === LABELS.NO_KEY_PICKED);
      if ( typeof nokeyIndex !== 'undefined') {
        newPresent.details.splice(nokeyIndex, 1);
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
