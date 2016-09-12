import { ActionReducer, Action } from '@ngrx/store';
import { MasterScreenerEdit, Question, Key } from '../models';
import { MasterScreenerEditActions } from '../actions';


export interface MasterScreenerEditState{
  data: MasterScreenerEdit;
  editQuestion: Question;
  originalQuestion: Question;
  expandableQuestion: Question;
  keys: {key:string, type:string}[];
  previewQuestions: Question[];
  previewQuestionKeyID: Key;
}

const initialState: MasterScreenerEditState = {
  data: undefined,
  editQuestion: undefined,
  originalQuestion: undefined,
  expandableQuestion: undefined,
  keys: undefined,
  previewQuestions: undefined,
  previewQuestionKeyID: undefined
}

export function MasterScreenerEditReducer(state = initialState, action: Action): MasterScreenerEditState{
  switch(action.type){
    case MasterScreenerEditActions.LOAD_QUESTIONS: {
      return state;
    };
    
    case MasterScreenerEditActions.LOAD_QUESTIONS_SUCCESS: {
      const questions: Question[] = action.payload;
      const keys = [
        {
          key: 'children',
          type: 'boolean'
        },
        {
          key: 'number_of_children',
          type: 'number'
        },
        {
          key: 'yearly_personal_income',
          type: 'number'
        },
        {
          key: 'married',
          type: 'boolean'
        }
      ]
      
      
      return {
        data: {
          questions: questions
        },
        editQuestion: {
          value: '',
          key: '',
          label: '',
          controlType: '',
          type: '',
          control: null,
          expandable: [],
          options: []
        },
        originalQuestion: {
          value: '',
          key: '',
          label: '',
          controlType: '',
          type: '',
          control: null,
          expandable: [],
          options: []
        },
        expandableQuestion: {
          value: '',
          key: '',
          label: '',
          controlType: '',
          type: '',
          control: null,
          expandable: null,
          options: []
        },
        keys: keys,
        previewQuestions: new Array<Question>(),
        previewQuestionKeyID: undefined
      }
    };
    
    case MasterScreenerEditActions.MAKE_EXPANDABLE_QUESTION: {
      const editQuestion = state.editQuestion;
      editQuestion.type = 'expandable';
      editQuestion.controlType = 'checkbox';
      editQuestion.options = [];
      return {
        data: state.data,
        editQuestion: editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: state.expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.UNMAKE_EXPANDABLE_QUESTION: {
      const editQuestion = state.editQuestion;
      editQuestion.type = '';
      editQuestion.controlType = '';
      return {
        data: state.data,
        editQuestion: editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: state.expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.EDIT_QUESTION_LABEL: {
      const editQuestion = state.editQuestion;
      editQuestion.label = action.payload;
      return {
        data: state.data,
        editQuestion: editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: state.expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.SET_CONTROL_TYPE: {
      const editQuestion = state.editQuestion;
      editQuestion.controlType = action.payload;
      return {
        data: state.data,
        editQuestion: editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: state.expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.ADD_OPTION: {
      const editQuestion = state.editQuestion;
      editQuestion.options.push(action.payload);
      return {
        data: state.data,
        editQuestion: editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: state.expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.REMOVE_OPTION: {
      const editQuestion = state.editQuestion;
      editQuestion.options.splice(action.payload, 1);
      return {
        data: state.data,
        editQuestion: editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: state.expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.EDIT_EXPANDABLE_QUESTION_LABEL: {
      const expandableQuestion = state.expandableQuestion;
      expandableQuestion.label = action.payload;
      return {
        data: state.data,
        editQuestion: state.editQuestion, 
        originalQuestion: state.originalQuestion,
        expandableQuestion: expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.SET_EXPANDABLE_CONTROL_TYPE: {
      const expandableQuestion = state.expandableQuestion;
      expandableQuestion.controlType = action.payload;
      return {
        data: state.data,
        editQuestion: state.editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.ADD_EXPANDABLE_OPTION: {
      const expandableQuestion = state.expandableQuestion;
      expandableQuestion.options.push(action.payload)
      return {
        data: state.data,
        editQuestion: state.editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      } 
    }
    
    case MasterScreenerEditActions.REMOVE_EXPANDABLE_OPTION: {
      const expandableQuestion = state.expandableQuestion;
      expandableQuestion.options.splice(action.payload, 1);
      return {
        data: state.data,
        editQuestion: state.editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      } 
    }    
    
    case MasterScreenerEditActions.PUSH_EXPANDABLE_QUESTION: {
      const editQuestion = state.editQuestion;
      editQuestion.expandable.push(state.expandableQuestion);
      const clearExpandableQuestion = {
        value: '',
        key: '',
        label: '',
        controlType: '',
        type: '',
        control: null,
        expandable: null,
        options: []
      }
      return {
        data: state.data,
        editQuestion: editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: clearExpandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.DELETE_EXPANDABLE_QUESTION: {
      const editQuestion = state.editQuestion;
      editQuestion.expandable.splice(action.payload, 1);
      return {
        data: state.data,
        editQuestion: editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: state.expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.SET_EDIT_EXPANDABLE: {
      const expandableQuestion = state.editQuestion.expandable[action.payload];
      return {
        data: state.data,
        editQuestion: state.editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.CLEAR_EXPANDABLE_QUESTION: {
      const clearExpandableQuestion = {
        value: '',
        key: '',
        label: '',
        controlType: '',
        type: '',
        control: null,
        expandable: null,
        options: []
      }
      return {
        data: state.data,
        editQuestion: state.editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: clearExpandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    case MasterScreenerEditActions.DELETE_QUESTION: {
      // this case is not entirely "pure" because of some type of binding to state.data.questions 
      // in components/editor/master-screener
      const index = state.data.questions.indexOf(action.payload);
      state.data.questions.splice(index, 1);
      return {
        data: state.data,
        editQuestion: state.editQuestion,
        originalQuestion: state.originalQuestion,
        expandableQuestion: state.expandableQuestion,
        keys: state.keys,
        previewQuestions: state.previewQuestions,
        previewQuestionKeyID: undefined
      }
    }
    
    // impure swap function incoming Dan Abramov would probably cry :(
    case MasterScreenerEditActions.SWAP_QUESTIONS: {
      const a = action.payload.questionA;
      const b = action.payload.questionB;
      const aIndex = state.data.questions.indexOf(a);
      const bIndex = state.data.questions.indexOf(b);
      if(!(aIndex < 0 || bIndex < 0)){
        state.data.questions[aIndex] = b;
        state.data.questions[bIndex] = a;
      }
      return state;
    }
    
    case MasterScreenerEditActions.SET_EDIT_QUESTION: {
      state.originalQuestion = (<any>Object).assign({}, action.payload);
      state.editQuestion = (<any>Object).assign({}, action.payload);
      return state;
    }
    
    case MasterScreenerEditActions.ADD_QUESTION_TO_SCREENER: {
      const blankQuestion = {
        value: '',
        key: '',
        label: '',
        controlType: '',
        type: '',
        control: null,
        expandable: [],
        options: []
      }
      
      if(deepEqual(blankQuestion, action.payload)){
        return state;
      }
      
      const replaceIndex = find(state.originalQuestion);
      if(replaceIndex < 0){
        state.data.questions.push(action.payload)
        state.editQuestion = {
          value: '',
          key: '',
          label: '',
          controlType: '',
          type: '',
          control: null,
          expandable: [],
          options: []
        }
      } else {
        state.data.questions[replaceIndex] = action.payload;
        state.editQuestion = {
          value: '',
          key: '',
          label: '',
          controlType: '',
          type: '',
          control: null,
          expandable: [],
          options: []
        }
        state.originalQuestion = {
          value: '',
          key: '',
          label: '',
          controlType: '',
          type: '',
          control: null,
          expandable: [],
          options: []
        }
      }
      return state;
    }
    
    case MasterScreenerEditActions.CLEAR_EDIT_QUESTION: {
      state.editQuestion = {
        value: '',
        key: '',
        label: '',
        controlType: '',
        type: '',
        control: null,
        expandable: [],
        options: []
      }
      
      state.originalQuestion = {
        value: '',
        key: '',
        label: '',
        controlType: '',
        type: '',
        control: null,
        expandable: [],
        options: []
      }
      
      return state;
    }
    
    case MasterScreenerEditActions.SET_INSPECT_QUESTION: {
      const questions = state.data.questions;
      const previewQuestions = new Array<Question>();
      let index = -2;
      while(index !== -1){
        index = findById(action.payload,questions);
        if(index > -1){
          previewQuestions.push(questions[index]);
          questions.splice(index, 1);
        }
      }
      return (<any>Object).assign({}, state, {
        previewQuestions: previewQuestions,
        previewQuestionKeyID: action.payload
      });
    }
    
    default: {
      return state;
    }
  }
  
  // helper functions
  function find(question): number{
    let index = -1;
    state.data.questions.forEach( (stateQuestion, stateQuestionsIndex) => {
      if(deepEqual(stateQuestion, question)){
        index = stateQuestionsIndex;
      }
    })
    return index;
  }
  
  function deepEqual(questionA, questionB): boolean{
    if(JSON.stringify(questionA) === JSON.stringify(questionB)){
      return true;
    }
    return false;
  }
  
  function findById(questionID:string, questions:Question[]): number{
    let index = -1;

    questions.forEach( (stateQuestion, stateQuestionsIndex) => {
      if(stateQuestion.key === questionID){
        index = stateQuestionsIndex
      } else if(stateQuestion.expandable.length > 0) {
        stateQuestion.expandable.forEach( (expandableQuestion, expandableIndex) => {
          if(expandableQuestion.key === questionID){
            index = stateQuestionsIndex;
          }
        })
      }
    })
    return index;
    
  }
}

