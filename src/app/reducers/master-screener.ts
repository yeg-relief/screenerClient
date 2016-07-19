import { ActionReducer, Action } from '@ngrx/store';
import { MasterScreener, Question } from '../models';
import { MasterScreenerActions } from '../actions';
import { FormGroup, FormControl } from '@angular/forms';

export interface MasterScreenerState{
  data: MasterScreener;
  currentQuestion: Question; 
  currentIndex: number;
  loaded: boolean;
  results: any[];
}

const initialState: MasterScreenerState = {
  data: undefined,
  currentQuestion: undefined,
  currentIndex: undefined,
  loaded: false,
  results: []
}

export function masterScreenerReducer(state = initialState, action: Action): MasterScreenerState{
  switch(action.type){
    case MasterScreenerActions.LOAD_QUESTIONS: {
      return state;
    }
    
    case MasterScreenerActions.LOAD_QUESTIONS_SUCCESS: {
      const questions: Question[] = action.payload;
      const controls: {[key:string]:FormControl} = {};
      
      action.payload.map( question => {
        controls[question.key] = new FormControl(question.value);
        if(question.expandable.length !== 0){
          question.expandable.map( collapsibleQuestion => {
            controls[collapsibleQuestion.key] = new FormControl(collapsibleQuestion.value);
          })
        }
      })
      return {
        data: {
          questions: questions,
          form: new FormGroup(controls),
          payload: ''
        },
        currentQuestion: questions[0],
        currentIndex: 0,
        loaded: true,
        results: []
      }
    }
    
    case MasterScreenerActions.NEXT_QUESTION: {
      if(state.currentIndex + 1 < state.data.questions.length){
        return {
          data: state.data,
          currentQuestion: state.data.questions[state.currentIndex + 1],
          currentIndex: state.currentIndex + 1, 
          loaded: true,
          results: state.results
        }
      } 
      return state;
    }
    
    case MasterScreenerActions.PREVIOUS_QUESTION: {
      if(state.currentIndex - 1 >= 0){
        return {
          data: state.data,
          currentQuestion: state.data.questions[state.currentIndex - 1],
          currentIndex: state.currentIndex - 1, 
          loaded: true,
          results: state.results
        }
      }
      return state;
    }
    
    case MasterScreenerActions.SUBMIT: {
      const questions: Question[] = state.data.questions;
      const controls: {[key:string]:FormControl} = {};
      
      questions.map( (question:any) => {
        controls[question.key] = new FormControl(question.value);
        if(question.expandable.length !== 0){
          question.expandable.map( collapsibleQuestion => {
            controls[collapsibleQuestion.key] = new FormControl(collapsibleQuestion.value);
          })
        }
      })
      const form = new FormGroup(controls);
      
      
      return {
        data: {
          questions: state.data.questions,
          form: form,
          payload: JSON.stringify(form.value)
        }, 
        currentQuestion: state.currentQuestion,
        currentIndex: state.currentIndex,
        loaded: state.loaded,
        results: state.results
      }
    }
    
    case MasterScreenerActions.SUBMIT_SUCCESS: {
      const results = action.payload;
      
      return {
        data: state.data,
        currentQuestion: state.currentQuestion,
        currentIndex: state.currentIndex,
        loaded: state.loaded,
        results: results
      }
    }
    
    default: {
      return state;
    }
  }
}


