import { Action } from '@ngrx/store';
import { MasterScreener } from '../../models/master-screener';
import { Question } from '../../../shared/models/question';

export const EditQuestionActionTypes = {
  INIT_EDIT: '[EDIT QUESTION] INIT_EDIT',
  LOAD_QUESTION: '[EDIT_QUESTION] LOAD_QUESTION'
};

export class EditQuestionInit implements Action {
  type = EditQuestionActionTypes.INIT_EDIT;
  constructor(public payload: string) { }
}

export class EditQuestionLoad implements Action {
  type = EditQuestionActionTypes.LOAD_QUESTION;
  constructor(public payload: Question) { }
}

export type EditQuestionActions =
    EditQuestionInit
  | EditQuestionLoad;
