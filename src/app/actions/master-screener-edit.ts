import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { MasterScreener, Question } from '../models';

@Injectable()
export class MasterScreenerEditActions{
  static LOAD_QUESTIONS = '[MASTER_SCREENER_EDIT] LOAD_QUESTIONS';
  loadQuestions(): Action{
    return {
      type: MasterScreenerEditActions.LOAD_QUESTIONS
    };
  };
  
  static LOAD_QUESTIONS_SUCCESS = '[MASTER_SCREENER_EDIT] LOAD_QUESTIONS_SUCCESS';
  loadQuestionsSuccess(questions: Question[]): Action{
    return {
      type: MasterScreenerEditActions.LOAD_QUESTIONS_SUCCESS,
      payload: questions
    };
  };
  
  static MAKE_EXPANDABLE_QUESTION = '[MASTER_SCREENER_EDIT] MAKE_EXPANDABLE_QUESTION';
  addExpandableQuestion(): Action{
    return {
      type: MasterScreenerEditActions.MAKE_EXPANDABLE_QUESTION
    }
  };
  
  static UNMAKE_EXPANDABLE_QUESTION = '[MASTER_SCREENER_EDIT] UNMAKE_EXPANDABLE_QUESTION';
  removeExpandableQuestion(): Action{
    return {
      type: MasterScreenerEditActions.UNMAKE_EXPANDABLE_QUESTION
    }
  }
  
  static EDIT_QUESTION_LABEL = '[MASTER_SCREENER_EDIT] EDIT_QUESTION_LABEL';
  editQuestionLabel(label: string): Action{
    return {
      type: MasterScreenerEditActions.EDIT_QUESTION_LABEL,
      payload: label
    }
  }
  
  static SET_CONTROL_TYPE = '[MASTER_SCREENER_EDIT] SET_CONTROL_TYPE';
  setControlType(controlType: string): Action{
    return {
      type: MasterScreenerEditActions.SET_CONTROL_TYPE,
      payload: controlType
    }
  }
  
  static ADD_OPTION = '[MASTER_SCREENER_EDIT] ADD_OPTION';
  addOption(optionName: string): Action{
    return{
      type: MasterScreenerEditActions.ADD_OPTION,
      payload: optionName
    }
  }
  
  static REMOVE_OPTION = '[MASTER_SCREENER_EDIT] REMOVE OPTION';
  removeOption(index: number): Action{
    return{
      type: MasterScreenerEditActions.REMOVE_OPTION,
      payload: index
    }
  }
  
  static EDIT_EXPANDABLE_QUESTION_LABEL = '[MASTER_SCREENER_EDIT] EDIT_EXPANDABLE_QUESTION_LABEL';
  editExpandableLabel(label: string): Action{
    return {
      type: MasterScreenerEditActions.EDIT_EXPANDABLE_QUESTION_LABEL,
      payload: label
    }
  }
  
  static SET_EXPANDABLE_CONTROL_TYPE = '[MASTER_SCREENER_EDIT] SET_EXPANDABLE_CONTROL_TYPE';
  setExpandableControlType(type: string): Action{
    return {
      type: MasterScreenerEditActions.SET_EXPANDABLE_CONTROL_TYPE,
      payload: type
    }
  }
  
  static ADD_EXPANDABLE_OPTION = '[MASTER_SCREENER_EDIT] ADD_EXPANDABLE_OPTION';
  addExpandableOption(optionName:string): Action{
    return{
      type: MasterScreenerEditActions.ADD_EXPANDABLE_OPTION,
      payload: optionName
    }
  }
  
  static REMOVE_EXPANDABLE_OPTION = '[MASTER_SCREENER_EDIT] REMOVE_EXPANDABLE_OPTION';
  removeExpandableOption(index: number): Action{
    return{
      type: MasterScreenerEditActions.REMOVE_EXPANDABLE_OPTION,
      payload: index
    }
  }
  
  static PUSH_EXPANDABLE_QUESTION = '[MASTER_SCREENER_EDIT] PUSH_EXPANDABLE_QUESTION';
  pushExpandableQuestion(): Action{
    return{
      type: MasterScreenerEditActions.PUSH_EXPANDABLE_QUESTION
    }
  }
}