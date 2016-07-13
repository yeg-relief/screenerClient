import { ActionReducer, Action } from '@ngrx/store';
import { MasterScreener, Question, NestedQuestion } from '../models';
import { MasterScreenerActions } from '../actions';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import '@ngrx/core/add/operator/select';

export interface MasterScreenerState{
  data: MasterScreener;
  currentQuestion: Question; 
  currentIndex: number;
  loaded: boolean;
}

const initialState: MasterScreenerState = {
  data: undefined,
  currentQuestion: undefined,
  currentIndex: undefined,
  loaded: false
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
          <NestedQuestion>question.expandable.map( collapsibleQuestion => {
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
        loaded: true
      }
    }
    
    case MasterScreenerActions.NEXT_QUESTION: {
      if(state.currentIndex + 1 < state.data.questions.length){
        return {
          data: state.data,
          currentQuestion: state.data.questions[state.currentIndex + 1],
          currentIndex: state.currentIndex + 1, 
          loaded: true
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
          loaded: true
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
          <NestedQuestion>question.expandable.map( collapsibleQuestion => {
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
        loaded: state.loaded
      }
    }
    
    default: {
      return state;
    }
  }
}


