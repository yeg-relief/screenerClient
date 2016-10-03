import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { EditQuestionActions, EditQuestionActionTypes } from './edit-question.actions';
import { MasterScreener } from '../../models/master-screener';
import { Question } from '../../../shared/models';
import { cloneDeep } from 'lodash';

export interface State {
  originalQuestionKey: string;
  past: Question[];
  present: Question;
  future: Question[];
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
  present: blankQuestion(),
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
        present: blankQuestion(),
        future: []
      };
      return newState;
    }

    case EditQuestionActionTypes.LOAD_QUESTION: {
      const questionToEdit = <Question>cloneDeep(action.payload);
      const newState: State = cloneDeep(state);
      newState.present = questionToEdit;
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
