import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { EditQuestionActions, EditQuestionActionTypes } from './edit-question.actions';
import { Question } from '../../../shared/models';
import { Key } from '../../models/key';
import { cloneDeep } from 'lodash';
import { QuestionErrors, LABELS } from './question-errors';
import 'rxjs/add/operator/do';

// for question details



// I think we don't need to keep a history of unused keys
export type StateType = {
  question: Question;
  unusedKeys: Key[];
  errors: QuestionErrors;
};

export interface State {
  saved: boolean;
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
  saved: false,
  originalQuestionKey: '',
  past: [],
  present: {
    question: blankQuestion,
    unusedKeys: [],
    errors: []
  },
  future: []
};

export function reducer(state = initialState, action: EditQuestionActions): State {
  switch (action.type) {

    case EditQuestionActionTypes.INIT_EDIT: {
      const questionKey = <string>action.payload;
      // editing multiple questions sequentially means state has to be reset upon editing a new question
      // unsure if clone is needed
      const newState: State = cloneDeep(initialState);
      newState.originalQuestionKey = questionKey;
      return newState;
    }

    case EditQuestionActionTypes.LOAD_QUESTION: {
      const questionToEdit = <Question>cloneDeep(action.payload);
      const newState: State = cloneDeep(state);
      newState.present.question = questionToEdit;
      if (newState.present.question.key !== 'empty') {
        newState.present.errors = [];
      }
      return newState;
    }

    case EditQuestionActionTypes.LOAD_UNUSED_KEYS: {
      const unusedKeys = <Key[]>cloneDeep(action.payload);
      const newState: State = cloneDeep(state);
      newState.present.unusedKeys = unusedKeys;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_CONTROL_TYPE: {
      const newControlType = <'radio' | 'input'>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [ state.present, ...state.past];
      const nocontrolIndex =
        newPresent.errors.findIndex(detail => detail.label === LABELS.NO_CONTROL_PICKED);

      if ( nocontrolIndex >= 0) {
        newPresent.errors.splice(nocontrolIndex, 1);
      }

      newPresent.question.controlType = newControlType;
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_QUESTION_TYPE: {
      const newQuestionType = <'boolean' | 'number' | 'text'>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [state.present, ...state.past];
      const notypeIndex = newPresent.errors.findIndex(detail => detail.label === LABELS.NO_TYPE_PICKED);
      if ( notypeIndex >= 0) {
        newPresent.errors.splice(notypeIndex, 1);
      }

      newPresent.question.type = newQuestionType;
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_LABEL: {
      const newLabel = <string>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [state.present, ...state.past];
      newPresent.question.label = newLabel;
      const nolabelIndex = newPresent.errors.findIndex(detail => detail.label === LABELS.NO_LABEL_PICKED);
      if ( nolabelIndex >= 0) {
        newPresent.errors.splice(nolabelIndex, 1);
      }
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_KEY: {
      const newKeyName = <string>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [state.present, ...state.past];
      newPresent.question.key = newKeyName;
      const nokeyIndex = newPresent.errors.findIndex(detail => detail.label === LABELS.NO_KEY_PICKED);
      if ( nokeyIndex >= 0) {
        newPresent.errors.splice(nokeyIndex, 1);
      }
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_EXPANDABLE: {
      const newExpandable = <boolean>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [state.present, ...state.past];
      newPresent.question.expandable = newExpandable;
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CLEAR_QUESTION: {
      if (state.present.question === blankQuestion) {
        return state;
      }
      const question = blankQuestion;
      const newState = cloneDeep(state);
      const newPast = [state.present, ...state.past];
      newState.present.question = question;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.UNDO: {
      if (state.past.length <= 0) {
        return state;
      }
      const newState = cloneDeep(state);
      const previous = state.past.shift();
      const newFuture = [state.present, ...state.future];
      newState.past = cloneDeep(state.past);
      newState.future = cloneDeep(newFuture);
      newState.present = cloneDeep(previous);
      return newState;
    }

    case EditQuestionActionTypes.REDO: {
      if (state.future.length <= 0) {
        return state;
      }
      const newState = cloneDeep(state);
      const next = state.future.shift();
      const newPast = [state.present, ...state.past];
      newState.past = newPast;
      newState.future = cloneDeep(state.future);
      newState.present = cloneDeep(next);
      return newState;
    }

    case EditQuestionActionTypes.SAVE_QUESTION: {
      return state;
    }

    case EditQuestionActionTypes.SAVE_QUESTION_SUCCESS: {
      const newState = cloneDeep(state);
      newState.saved = true;
      return newState;
    }

    case EditQuestionActionTypes.SAVE_QUESTION_FAILURE: {
      const errors = <QuestionErrors>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [ state.present, ...state.past];
      newPresent.errors = [...errors];
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.UPDATE_QUESTION: {
      return state;
    }

    case EditQuestionActionTypes.UPDATE_QUESTION_SUCCESS: {
      const newState = cloneDeep(state);
      newState.saved = true;
      return newState;
    }

    case EditQuestionActionTypes.UPDATE_QUESTION_FAILURE: {
      const errors = <QuestionErrors>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = [ state.present, ...state.past];
      newPresent.errors = [...errors];
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    default: {
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

export function getQuestionErrors(state$: Observable<State>) {
  return getPresentQuestion(state$)
    .map(present => present.errors);
}

export function unsavedEdits(state$: Observable<State>) {
  return state$.select(s => s.past)
    .map(past => past.length > 0);
}


export function savedQuestion(state$: Observable<State>) {
  return state$.select(s => s.saved);
}
