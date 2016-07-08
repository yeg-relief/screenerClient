// not sure if needed yet
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
    return <Action>{
      type: MasterScreenerActions.LOAD_QUESTIONS_SUCCESS,
      payload: questions
    };
  };
}