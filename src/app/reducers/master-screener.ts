import { ActionReducer, Action } from '@ngrx/store';
import { MasterScreener, Question, ConditionalQuestion } from '../models';
import { MasterScreenerActions } from '../actions';
import { FormGroup, FormControl } from '@angular/forms';

export interface MasterScreenerState{
  data: MasterScreener;
  currentQuestion: number; //Question.id
  loaded: boolean;
}

const initialState: MasterScreenerState = {
  data: undefined,
  currentQuestion: undefined,
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
      const form: FormGroup = new FormGroup({});
      
      action.payload.map( question => {
        controls[question.id] = new FormControl(question.value);
        if(<ConditionalQuestion>question.expandableGroup !== undefined){
          <ConditionalQuestion>question.expandableGroup.map( collapsibleQuestion => {
            controls[collapsibleQuestion.id] = new FormControl(collapsibleQuestion.value);
          })
        }
      })
      return {
        data: {
          questions: questions,
          form: form,
          controls: controls
        },
        currentQuestion: 0,
        loaded: true
      }
    }
    default: {
      return state;
    }
  }
}

