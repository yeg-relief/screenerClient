import { Action } from '@ngrx/store';
import { MasterScreener } from '../../models/master-screener';
import { Question } from '../../../shared/models/question';

export const EditScreenerActionsTypes = {
  LOAD_SCREENER: '[EDIT_SCREENER] LOAD_SCREENER',
  SAVE_SCREENER: '[EDIT_SCREENER] SAVE_SCREENER',
  ADD_QUESTION: '[EDIT_SCREENER] ADD_QUESTION',
  REMOVE_QUESTION: '[EDIT_SCREENER] REMOVE_QUESTION',
  EDIT_QUESTION: '[EDIT_SCREENER] EDIT_QUESTION',
  SWAP_QUESTIONS: '[EDIT_SCREENER] SWAP_QUESTIONS',
  CLEAR_QUESTIONS: '[EDIT_SCREENER] CLEAR_QUESTIONS',
};

/* push a loaded masterscreener into the edit screener */
export class LoadScreener implements Action {
  type = EditScreenerActionsTypes.LOAD_SCREENER;

  constructor(public payload: MasterScreener) { }
}

/* save this screener to localstorage or to server? */
export class SaveScreener implements Action {
  type = EditScreenerActionsTypes.LOAD_SCREENER;

  constructor(public payload: MasterScreener) { }
}

export class AddQuestion implements Action {
  type = EditScreenerActionsTypes.ADD_QUESTION;

  constructor(public payload: Question) { }
}

export class RemoveQuestion implements Action {
  type = EditScreenerActionsTypes.REMOVE_QUESTION;

  constructor(public payload: Question) { }
}

export class EditQuestion implements Action {
  type = EditScreenerActionsTypes.EDIT_QUESTION;

  constructor(public payload: Question) { }
}

export class SwapQuestions implements Action {
  type = EditScreenerActionsTypes.SWAP_QUESTIONS;

  // an array of only two questions... maybe make a more specific type?
  constructor(public payload: Question[]) { }
}

export class ClearQuestions implements Action {
  type = EditScreenerActionsTypes.CLEAR_QUESTIONS;

  constructor(public payload: {}) { }
}

export type EditScreenerActions =
    LoadScreener
  | SaveScreener
  | AddQuestion
  | RemoveQuestion
  | EditQuestion
  | SwapQuestions
  | ClearQuestions
