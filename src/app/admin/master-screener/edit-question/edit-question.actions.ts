import { Action } from '@ngrx/store';
import { Key } from '../../models/key';
import { Question, QuestionOption } from '../../../shared/models';
import { QuestionErrors } from './question-errors';

export const EditQuestionActionTypes = {
  INIT_EDIT: '[EDIT QUESTION] INIT_EDIT',
  LOAD_QUESTION: '[EDIT_QUESTION] LOAD_QUESTION',
  LOAD_UNUSED_KEYS: '[EDIT_QUESTION] LOAD_UNUSED_KEYS',
  CHANGE_CONTROL_TYPE: '[EDIT_QUESTION] CHANGE_CONTROL_TYPE',
  CHANGE_QUESTION_TYPE: '[EDIT_QUESTION] CHANGE_QUESTION_TYPE',
  CHANGE_LABEL: '[EDIT_QUESTION] CHANGE_LABEL',
  CHANGE_KEY: '[EDIT_QUESTION] CHANGE_KEY',
  CHANGE_EXPANDABLE: '[EDIT_QUESTION] CHANGE_EXPANDABLE',
  CLEAR_QUESTION: '[EDIT_QUESTION] CLEAR_QUESTION',
  UNDO: '[EDIT_QUESTION] UNDO',
  REDO: '[EDIT_QUESTION] REDO',
  SAVE_QUESTION: '[EDIT_QUESTION] SAVE_QUESTION',
  SAVE_QUESTION_SUCCESS: '[EDIT_QUESTION] SAVE_QUESTION_SUCCESS',
  SAVE_QUESTION_FAILURE: '[EDIT_QUESTION] SAVE_QUESTION_FAILURE',
  UPDATE_QUESTION: '[EDIT_QUESTION] UPDATE_QUESTION',
  UPDATE_QUESTION_SUCCESS: '[EDIT_QUESTION] UPDATE_QUESTION_SUCCESS',
  UPDATE_QUESTION_FAILURE: '[EDIT_QUESTION] UPDATE_QUESTION_FAILURE',
  ADD_OPTION: '[EDIT_QUESTION] ADD_OPTION',
  REMOVE_OPTION: '[EDIT_QUESTION] REMOVE_OPTION'
};

export class EditQuestionInit implements Action {
  type = EditQuestionActionTypes.INIT_EDIT;
  constructor(public payload: string) { }
}

export class EditQuestionLoad implements Action {
  type = EditQuestionActionTypes.LOAD_QUESTION;
  constructor(public payload: Question) { }
}

export class EditQuestionLoadUnusedKeys implements Action {
  type = EditQuestionActionTypes.LOAD_UNUSED_KEYS;
  constructor(public payload: Key[]) { }
}

export class EditQuestionChangeControl implements Action {
  type = EditQuestionActionTypes.CHANGE_CONTROL_TYPE;
  constructor(public payload: string) {}
}

export class EditQuestionChangeQuestionType implements Action {
  type = EditQuestionActionTypes.CHANGE_QUESTION_TYPE;
  constructor(public payload: string) {}
}

export class EditQuestionChangeLabel implements Action {
  type = EditQuestionActionTypes.CHANGE_LABEL;
  constructor(public payload: string) {}
}

export class EditQuestionChangeKey implements Action {
  type = EditQuestionActionTypes.CHANGE_KEY;
  constructor(public payload: string) {}
}

export class EditQuestionChangeExpand implements Action {
  type = EditQuestionActionTypes.CHANGE_EXPANDABLE;
  constructor(public payload: boolean) {}
}

export class EditQuestionClearQuestion implements Action {
  type = EditQuestionActionTypes.CLEAR_QUESTION;
  constructor(public payload: {}) {}
}

export class UndoEdit implements Action {
  type = EditQuestionActionTypes.UNDO;
  constructor(public payload: any) {}
}

export class RedoEdit implements Action {
  type = EditQuestionActionTypes.REDO;
  constructor(public payload: any) {}
}

export class SaveQuestion implements Action {
  type = EditQuestionActionTypes.SAVE_QUESTION;
  constructor(public payload: Question) { }
}

export class SaveQuestionSuccess implements Action {
  type = EditQuestionActionTypes.SAVE_QUESTION_SUCCESS;
  constructor(public payload: Question) { }
}

export class SaveQuestionFailure implements Action {
  type = EditQuestionActionTypes.SAVE_QUESTION_FAILURE;
  constructor(public payload: QuestionErrors) { }
}

export class UpdateQuestion implements Action {
  type = EditQuestionActionTypes.UPDATE_QUESTION;
  constructor(public payload: any) { }
}

export class UpdateQuestionSuccess implements Action {
  type = EditQuestionActionTypes.UPDATE_QUESTION_SUCCESS;
  constructor(public payload: any) { }
}

export class UpdateQuestionFailure implements Action {
  type = EditQuestionActionTypes.UPDATE_QUESTION_FAILURE;
  constructor(public payload: QuestionErrors) { }
}

export class AddOption implements Action {
  type = EditQuestionActionTypes.ADD_OPTION;
  constructor(public payload: QuestionOption) { }
}

export class RemoveOption implements Action {
  type = EditQuestionActionTypes.REMOVE_OPTION;
  constructor(public payload: QuestionOption) { }
}

export type EditQuestionActions =
    EditQuestionInit
  | EditQuestionLoad
  | EditQuestionLoadUnusedKeys
  | EditQuestionChangeControl
  | EditQuestionChangeQuestionType
  | EditQuestionChangeLabel
  | EditQuestionChangeKey
  | EditQuestionChangeExpand
  | EditQuestionClearQuestion
  | RedoEdit
  | UndoEdit
  | SaveQuestion
  | SaveQuestionSuccess
  | SaveQuestionFailure
  | UpdateQuestion
  | UpdateQuestionFailure
  | UpdateQuestionSuccess
  | AddOption
  | RemoveOption;
