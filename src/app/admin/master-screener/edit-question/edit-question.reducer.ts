import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { EditQuestionActions, EditQuestionActionTypes } from './edit-question.actions';
import { Question } from '../../../shared/models';
import { Key } from '../../models/key';
import { cloneDeep } from 'lodash';

// I think we don't need to keep a history of unused keys
export type StateType = {
  question: Question;
  unusedKeys: Key[]
}


export interface State {
  originalQuestionKey: string;
  past: StateType[];
  present: StateType;
  future: StateType[];
}

function blankQuestion(): Question {
  return {
    type: undefined,
    label: undefined,
    expandable: undefined,
    conditonalQuestions: undefined,
    options: undefined,
    key: undefined,
    controlType: undefined
  };
}

export const initialState: State = {
  originalQuestionKey: '',
  past: [],
  present: {
    question: blankQuestion(),
    unusedKeys: []
  },
  future: []
};

export function reducer(state = initialState, action: EditQuestionActions): State {
  switch (action.type) {

    case EditQuestionActionTypes.INIT_EDIT: {
      const questionKey = <string>cloneDeep(action.payload);
      // editing multiple questions sequentially means state has to be reset upon editing a new question
      const newState: State = {
        originalQuestionKey: questionKey,
        past: [],
        present: {
          question: blankQuestion(),
          unusedKeys: []
        },
        future: []
      };
      return newState;
    }

    case EditQuestionActionTypes.LOAD_QUESTION: {
      const questionToEdit = <Question>cloneDeep(action.payload);
      const newState: State = cloneDeep(state);
      newState.present.question = questionToEdit;
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
      const newPast = state.past.concat(state.present);
      newPresent.question.controlType = newControlType;
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_QUESTION_TYPE: {
      const newQuestionType = <'boolean' | 'number' | 'text'>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = state.past.concat(state.present);
      newPresent.question.type = newQuestionType;
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_LABEL: {
      const newLabel = <string>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = state.past.concat(state.present);
      newPresent.question.label = newLabel;
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_KEY: {
      const newKeyName = <string>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = state.past.concat(state.present);
      newPresent.question.key = newKeyName;
      newState.present = newPresent;
      newState.past = newPast;
      return newState;
    }

    case EditQuestionActionTypes.CHANGE_EXPANDABLE: {
      const newExpandable = <boolean>action.payload;
      const newPresent = cloneDeep(state.present);
      const newState = cloneDeep(state);
      const newPast = state.past.concat(state.present);
      newPresent.question.expandable = newExpandable;
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
  return state$.select(s => s.present);
}

export function getEditQuestionKey(state$: Observable<State>) {
  return state$.select(s => s.originalQuestionKey);
}
