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
      const controls: {[key:string]:FormControl} = controlsFromQuestions(questions);
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
        return (<any>Object).assign({}, state, {
          currentIndex: state.currentIndex + 1,
          currentQuestion: state.data.questions[state.currentIndex + 1]
        })
      } 
      return state;
    }
    
    case MasterScreenerActions.PREVIOUS_QUESTION: {
      if(state.currentIndex - 1 >= 0){
        return (<any>Object).assign({}, state, {
          currentQuestion: state.data.questions[state.currentIndex - 1],
          currentIndex: state.currentIndex - 1, 
        })
      }
      return state;
    }
    
    case MasterScreenerActions.SUBMIT: {
      const questions: Question[] = state.data.questions;
      const controls: {[key:string]:FormControl} = controlsFromQuestions(questions);
      const form = new FormGroup(controls);
      return (<any>Object).assign({}, state, {
        data: {
          questions: state.data.questions,
          form: form,
          payload: JSON.stringify(form.value)
        }
      })
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
    
    case MasterScreenerActions.UPDATE_QUESTIONS: {
      return (<any>Object).assign({}, state, {
        loaded: false
      })
    }
    
    
    case MasterScreenerActions.UPDATE_QUESTIONS_SUCCESS: {
      const controls: {[key:string]:FormControl} = controlsFromQuestions(action.payload)
      return (<any>Object).assign({}, state, {
        data: {
          questions: action.payload,
          form: new FormGroup(controls),
          payload: ''
        }, 
        currentQuestion: action.payload[0],
        currentIndex: 0,
        loaded: true,
        results: []
      })    
   }
    
    default: {
      return state;
    }
  }
}


function controlsFromQuestions(questions:Question[]):{[key:string]:FormControl}{
  const controls: {[key:string]:FormControl} = {};
  questions.map((question:any) => {
    controls[question.key] = new FormControl(question.value);
    if(question.expandable.length !== 0){
      question.expandable.map( collapsibleQuestion => {
        controls[collapsibleQuestion.key] = new FormControl(collapsibleQuestion.value);
      })
    }
  })
  return controls;
}