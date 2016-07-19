import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { MasterScreener, Question } from '../models';



@Injectable()
export class MasterScreenerActions{
  static LOAD_QUESTIONS = '[MASTER_SCREENER] LOAD_QUESTIONS';
  loadQuestions(): Action{
    return {
      type: MasterScreenerActions.LOAD_QUESTIONS
    };
  };
  
  static LOAD_QUESTIONS_SUCCESS = '[MASTER_SCREENER] LOAD_QUESTIONS_SUCCESS';
  loadQuestionsSuccess(questions: Question[]): Action{
    return {
      type: MasterScreenerActions.LOAD_QUESTIONS_SUCCESS,
      payload: questions
    };
  };
  
  static NEXT_QUESTION = '[MASTER_SCREENER] NEXT_QUESTION';
  nextQuestion(): Action{
    return {
      type: MasterScreenerActions.NEXT_QUESTION
    }
  };
  
  static PREVIOUS_QUESTION = '[MASTER_SCREENER] PREVIOUS_QUESTION';
  previousQuestion(): Action{
    return {
      type: MasterScreenerActions.PREVIOUS_QUESTION
    }
  }
  
  static SUBMIT = '[MASTER_SCREENER] SUBMIT';
  submit(): Action{
    return {
      type: MasterScreenerActions.SUBMIT
    }
  }
  
  static SUBMIT_SUCCESS = '[MASTER_SCREENER] SUBMIT_SUCCESS';
  submitSuccess(responses: any[]): Action{
    return {
      type: MasterScreenerActions.SUBMIT_SUCCESS,
      payload: responses
    }
  }
}

