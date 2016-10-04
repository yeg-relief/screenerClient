import { Action } from '@ngrx/store';
import { Key } from '../../models/key';
import { Question } from '../../../shared/models/question';

export const EditQuestionActionTypes = {
  INIT_EDIT: '[EDIT QUESTION] INIT_EDIT',
  LOAD_QUESTION: '[EDIT_QUESTION] LOAD_QUESTION',
  LOAD_UNUSED_KEYS: '[EDIT_QUESTION] LOAD_UNUSED_KEYS',
  CHANGE_CONTROL_TYPE: '[EDIT_QUESTION] CHANGE_CONTROL_TYPE',
  CHANGE_QUESTION_TYPE: '[EDIT_QUESTION] CHANGE_QUESTION_TYPE',
  CHANGE_LABEL: '[EDIT_QUESTION] CHANGE_LABEL',
  CHANGE_KEY: '[EDIT_QUESTION] CHANGE_KEY',
  CHANGE_EXPANDABLE: '[EDIT_QUESTION] CHANGE_EXPANDABLE'
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


export type EditQuestionActions =
    EditQuestionInit
  | EditQuestionLoad
  | EditQuestionLoadUnusedKeys
  | EditQuestionChangeControl
  | EditQuestionChangeQuestionType
  | EditQuestionChangeLabel
  | EditQuestionChangeKey
  | EditQuestionChangeExpand;
