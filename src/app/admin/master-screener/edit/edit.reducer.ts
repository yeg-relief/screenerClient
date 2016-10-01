import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import {EditScreenerActions, EditScreenerActionsTypes} from './edit.actions';
import { MasterScreener } from '../../models/master-screener';
import { Question } from '../../../shared/models';

export interface State {
  past: MasterScreener[];
  present: MasterScreener;
  future: MasterScreener[];
}

export const initialState: State = {
  past: new Array<MasterScreener>(),
  present: undefined,
  future: new Array<MasterScreener>()
};

export function reducer(state = initialState, action: EditScreenerActions): State {
  switch (action.type) {

    case EditScreenerActionsTypes.INIT_EDIT: {
      return state;
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
      return state;
    };

    case EditScreenerActionsTypes.ADD_QUESTION: {
      const addedQuestion = <Question>action.payload;
      const updatedQuestions = state.present.questions.concat(addedQuestion);
      const newScreener = state.present;
      newScreener.questions = updatedQuestions;
      return Object.assign({}, state, {
        past: state.past.concat(state.present),
        present: newScreener
      });
    };

    case EditScreenerActionsTypes.REMOVE_QUESTION: {
      const removedQuestion = <Question>action.payload;
      const index = state.present.questions.findIndex(stateQuestion => {
        return stateQuestion.key === removedQuestion.key;
      });
      if (typeof index === 'undefined') {
        return state;
      }
      const present: MasterScreener = Object.assign({}, state.present);
      state.present.questions.splice(index, 1);
      const newScreener: MasterScreener = Object.assign({}, state.present);
      return Object.assign({}, state, {
        past: state.past.concat(present),
        present: newScreener
      });
    }

    case EditScreenerActionsTypes.EDIT_QUESTION: {
      const originalQuestion = <Question>action.payload[0];
      const editedQuestion = <Question>action.payload[1];
      const index = state.present.questions.findIndex(stateQuestion => {
        return stateQuestion.key === originalQuestion.key;
      });
      if (typeof index === 'undefined') {
        return state;
      }
      const present: MasterScreener = Object.assign({}, state.present);
      state.present.questions.splice(index, 1, editedQuestion);
      const newScreener: MasterScreener = Object.assign({}, state.present);
      return Object.assign({}, state, {
        past: state.past.concat(present),
        present: newScreener
      });
    }

    case EditScreenerActionsTypes.CLEAR_QUESTIONS: {
      const present = Object.assign({}, state.present);
      state.present.questions = [];
      const newScreener: MasterScreener = Object.assign({}, state.present);
      return Object.assign({}, state, {
        past: state.past.concat(present),
        present: newScreener
      });
    }

    case EditScreenerActionsTypes.SWAP_QUESTIONS: {
      const questionA = action.payload[0];
      const questionB = action.payload[1];

      const indexA = state.present.questions.findIndex(stateQuestion => {
        return stateQuestion.key === questionA.key;
      });

      const indexB = state.present.questions.findIndex(stateQuestion => {
        return stateQuestion.key === questionB.key;
      });

      if (typeof indexA === 'undefined' || typeof indexB === 'undefined') {
        return state;
      }
      const present = state.present;
      state.present.questions.splice(indexA, 1, questionB);
      state.present.questions.splice(indexB, 1, questionA);
      const newScreener: MasterScreener = Object.assign({}, state.present);
      return Object.assign({}, state, {
        past: state.past.concat(present),
        present: newScreener
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
