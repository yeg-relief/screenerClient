import { Action } from '@ngrx/store';
import { Key } from '../../models/key';
import { Question } from '../../../shared/models/question';

export const EditQuestionActionTypes = {
  INIT_EDIT: '[EDIT QUESTION] INIT_EDIT',
  LOAD_QUESTION: '[EDIT_QUESTION] LOAD_QUESTION',
  LOAD_UNUSED_KEYS: '[EDIT_QUESTION] LOAD_UNUSED_KEYS'
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

export type EditQuestionActions =
    EditQuestionInit
  | EditQuestionLoad
  | EditQuestionLoadUnusedKeys;
