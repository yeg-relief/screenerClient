import { ActionReducer, Action } from '@ngrx/store';
import { MasterScreener, Question, NestedQuestion } from '../models';
import { MasterScreenerActions } from '../actions';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import '@ngrx/core/add/operator/select';

export interface MasterScreenerState{
  data: MasterScreener;
  currentQuestion: Question; 
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
        if(<NestedQuestion>question.expandableGroup !== undefined){
          <NestedQuestion>question.expandableGroup.map( collapsibleQuestion => {
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
        currentQuestion: questions[0],
        loaded: true
      }
    }
    default: {
      return state;
    }
  }
}


