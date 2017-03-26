import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { Screener, ID, Question_2, Key } from '../../models';
import { ScreenerActions, ScreenerActionTypes } from './screener-actions';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { questionValidator } from '../validators';

interface Styles {
  selected: boolean;
  error: boolean;
};

type ScreenerStyles = { [key: string]: Styles };
type ControlMap = { [key: string]: AbstractControl };

export interface State {
  loading: boolean;
  styles: ScreenerStyles;
  form: FormGroup;
  error: string;
  selectedConstantQuestion: ID;
  selectedConditionalQuestion: ID;
  keys: Key[];
  created: number;
};

export const initialState: State = {
  loading: false,
  styles: {},
  form: new FormGroup({}),
  error: '',
  selectedConstantQuestion: undefined,
  selectedConditionalQuestion: undefined,
  keys: [],
  created: 0
};

export function reducer(state = initialState, action: ScreenerActions): State {
  switch (action.type) {


    case ScreenerActionTypes.ADD_QUESTION: {
      if (state.form === undefined) return state;

      const index = getConstantQuestionsLength(state);
      const question = blankQuestion(index);
      const control = question_to_control(question);
      const key_group = key_to_group({ name: question.key.name, type: question.key.type });
      const question_group = new FormGroup(control, questionValidator);
      question_group.addControl('key', key_group);
      state.form.addControl(question.id, question_group);
      
      return (<any>Object).assign({}, state, {
        selectedConstantQuestion: question.id,
        selectedConditionalQuestion: undefined
      });
    };


    case ScreenerActionTypes.ADD_CONDITIONAL_QUESTION: {
      if (state.form === undefined || action.payload === undefined || typeof action.payload !== 'string') return state;

      const hostID = <ID>action.payload;
      const hostForm = state.form.get(hostID);

      if( hostForm === null ) return state;

      const hostQuestion: Question_2 = hostForm.value
      const index = getConditionalQuestionsLength(hostID, state)
      
      if ( index < 0 ) return state;

      const question = blankQuestion(index);
      question.expandable = false;
      const control = question_to_control(question);
      const key_group = key_to_group({ name: question.key.name, type: question.key.type });
      const question_group = new FormGroup(control, questionValidator);
      question_group.addControl('key', key_group);
      state.form.addControl(question.id, question_group);
      state.form.get([hostID, 'conditionalQuestions']).setValue([...hostQuestion.conditionalQuestions, question.id]);
      state.styles[question.id] = freshStyle();

      return (<any>Object).assign({}, state, {
        selectedConstantQuestion: hostID,
        selectedConditionalQuestion: question.id
      });;
    }


    case ScreenerActionTypes.DELETE_QUESTION: {
      if (state.form === undefined || action.payload === undefined || typeof action.payload !== 'string') return state;

      const id = <ID>action.payload;
      const hostID = isConditionalQuestion(id, state);

      let selectedConstantQuestion = state.selectedConstantQuestion;
      let selectedConditionalQuestion = state.selectedConditionalQuestion;
      
      if (typeof hostID === 'string') {
        const hostQuestion: Question_2 = state.form.value[hostID];
        state.form.get([hostID, 'conditionalQuestions'])
                  .setValue(hostQuestion.conditionalQuestions.filter(c_id => c_id !== id));

        state.form.removeControl(id);
        const sortedConditionalQuestions = sortConditionals(state, hostID);
        selectedConditionalQuestion = sortedConditionalQuestions.length > 0 ? sortedConditionalQuestions[0] : undefined;

    } else if (hostID === false){
        const constantquestion: Question_2 = state.form.get(id).value;
        if (constantquestion.expandable && constantquestion.conditionalQuestions.length > 0 ){
          for (const condQuestion of constantquestion.conditionalQuestions) state.form.removeControl(condQuestion);
        }
        state.form.removeControl(id);
        const sortedConstants = sortConstants(state);
        selectedConstantQuestion = sortedConstants.length > 0 ? sortedConstants[0] : undefined;
      }
      
      
      if(state.styles[id] !== undefined) delete state.styles[id];

      return (<any>Object).assign({}, state, {
        selectedConstantQuestion,
        selectedConditionalQuestion
      });
    }

    case ScreenerActionTypes.DROP_QUESTION: {

      if (action.payload === undefined || 
        (<any>action.payload).containerType === undefined  || 
        (<any>action.payload).questionID === undefined) {
        return state;    
      }

      const questionID = (<ID>action.payload)['questionID'];
      const containerType = (<string>action.payload)['containerType'];
      const question: Question_2 = state.form.get([questionID]) === null ? undefined : state.form.get([questionID]).value;
      const hostID = isConditionalQuestion(questionID, state);
      const constantLength = getConstantQuestionsLength(state);
      const conditionalLength = typeof hostID === 'string' ? getConditionalQuestionsLength(hostID, state) : undefined;
      const constantQuestions: FormGroup[] = Object.keys(state.form.value)
                                              .filter(id => isConditionalQuestion(id, state) === false)
                                              .map(id => <FormGroup>state.form.get(id));
      
      // we're moving the target question to the bottom of the list... anything with higher index 
      // will need to be decremented.
      const adjustIndex = (questions: FormGroup[], targetIndex: number): FormGroup[] => {
        for(const q of questions) {
          const indexControl = q.get('index');
          if (indexControl === null) break;
          
          if(indexControl.value > targetIndex) indexControl.setValue(indexControl.value - 1); 
        }
        
        return questions;
      }


      if ( question === undefined ) return state;

      if (typeof hostID === 'string' && hostID !== state.selectedConstantQuestion) return state;


      // constant question to constant container
      if(containerType === 'constant_container' && hostID === false) {

        adjustIndex(constantQuestions, question.index)
        state.form.get([questionID, 'index']).setValue(constantLength - 1);
      }
      // move a conditional question to the constant container
      else if (containerType === 'constant_container' && typeof hostID === 'string'){
 
        const conditionalQuestions = state.form.get([hostID, 'conditionalQuestions']).value
                                      .map(id => state.form.get(id))
                                      .filter(val => val === null);          
        adjustIndex(conditionalQuestions, question.index) 
        state.form.get([questionID, 'index']).setValue(constantLength);
        const conditionals = state.form.get([hostID, 'conditionalQuestions']).value;
        const updatedConditionals = conditionals.filter( id => id !== question.id)
        state.form.get([hostID, 'conditionalQuestions']).setValue(updatedConditionals);
      }
      // conditional question to conditional container
      else if (containerType === 'conditional_container' && typeof hostID === 'string'){


        const conditionalQuestions = state.form.get([hostID, 'conditionalQuestions']).value
                                      .map(id => state.form.get(id))
                                      .filter(val => val === null);
        adjustIndex(conditionalQuestions, question.index)
        state.form.get([questionID, 'index']).setValue(conditionalLength - 1);   


      }
      // move a constant question to conditional container
      else if (containerType === 'conditional_container' && hostID === false){

        // there is no selected question, how can we drop a question into the conditional container?
        const host: FormGroup = <FormGroup>state.form.get(state.selectedConstantQuestion);
        if (host === null || host.get('expandable').value === false) return state;

        // only one layer of nesting allowed
        if (question.expandable === true) return state;

        const conditionalLength = host.get('conditionalQuestions').value.length;
        adjustIndex(constantQuestions, question.index);
        state.form.get([questionID, 'index']).setValue(conditionalLength);
        host.get('conditionalQuestions').setValue([...host.get('conditionalQuestions').value, question.id])
      }

      return state;
    }

    case ScreenerActionTypes.LOAD_DATA: return (<any>Object).assign({}, state, { loading: true} );


    case ScreenerActionTypes.LOAD_DATA_FAILURE: {
      return (<any>Object).assign( state, {
        loading: false,
        error: 'unable to load data from server'
      })
    }


    case ScreenerActionTypes.LOAD_DATA_SUCCESS: {
      if (action.payload === undefined) return state;

      const screener = <Screener>action.payload;

      if ( !Array.isArray(screener.conditionalQuestions) || !Array.isArray(screener.conditionalQuestions
            || !Array.isArray(screener.keys)) ){
        return (<any>Object).assign({}, state, {
          loading: false,
          error: 'loaded data is corrupt and unable to be displayed'
        })
      } 

      const allQuestions = [...screener.conditionalQuestions, ...screener.questions];

      let allQuestions_2: Question_2[] = [];
      for (const q of allQuestions) {
        const newQ = (<any>Object).assign({}, q);
        const key = screener.keys.find(key => key.name === newQ.key);
        newQ.key = key;
        allQuestions_2.push(newQ);
      }

      //const allQuestions_2 = allQuestions.map(q => q.key = screener.keys.find(key => key.name === q.key))

      const form: FormGroup = allQuestions_2
          .map(question => [question_to_control(question), key_to_group(question.key)])
          .map( ([question, key]) => {
            const questionControl = <{ [key: string]: AbstractControl; }>question;
            const keyGroup = <FormGroup>key;
            const questionGroup = new FormGroup(questionControl)
            questionGroup.addControl('key', keyGroup);
            return questionGroup;
          })
          .map(group => { group.setValidators([questionValidator]); return group })
          .reduce( (_form, control) => { 
            _form.addControl(control.value.id, control); 
            return _form 
          }, new FormGroup({}));

      const styles: ScreenerStyles = allQuestions.reduce( (_styles, question) => {
        _styles[question.id] = freshStyle();
        return _styles;
      }, {});

      const keys = screener.keys;

      return (<any>Object).assign({}, {
        loading: false,
        created: screener.created,
        error: '',
        styles,
        form,
        keys,
      })
    }


    case ScreenerActionTypes.SAVE_DATA: {
      let error = false

      for (const id in state.styles) {
        if (state.styles[id].error === false){
          error = true;
          break;
        }
      }

      const errorPresent = error === true || state.error !== '';

      return errorPresent ? 
        (<any>Object).assign({}, state, { error: 'errors detected, unable to save.' }) :
        (<any>Object).assign({}, state, { loading: true });
    }


    case ScreenerActionTypes.SAVE_DATA_FAILURE: {
      const error = action.payload !== undefined ? action.payload : 'save failed.'

      return (<any>Object).assign({}, state, { 
        loading: false,
        error
      })
    }


    case ScreenerActionTypes.SAVE_DATA_SUCCESS: {
      return (<any>Object).assign({}, state, { loading: false })
    }
    case ScreenerActionTypes.SELECT_QUESTION: {
      if(action.payload === undefined || typeof action.payload !== 'string') return state;

      const id = action.payload;
      const host_id = isConditionalQuestion(id, state);

      if(host_id === false) {
        return (<any>Object).assign({}, state, {
          selectedConstantQuestion: id,
          selectedConditionalQuestion: undefined
        })
      };

      return (<any>Object).assign({}, state,  {
        selectedConditionalQuestion: id
      });
    }

    case ScreenerActionTypes.SWAP_QUESTIONS: {
      if (action.payload === undefined) return state;

      const payload = <{[key: string]: ID}>action.payload,
            lifted    = payload['lifted'],
            target    = payload['target'];
      
      if (lifted === undefined || target === undefined) return state;

      // both questions are constant
      if (isConditionalQuestion(lifted, state) === false && isConditionalQuestion(target, state) === false) {

        const liftedIndex = state.form.get([lifted, 'index']).value
        state.form.get([lifted, 'index']).setValue(state.form.get([target, 'index']).value);
        state.form.get([target, 'index']).setValue(liftedIndex);
        // lifted is constant and target is conditional
      } else if( isConditionalQuestion(lifted, state) === false && typeof isConditionalQuestion(target, state) === 'string'){

        const hostID: ID = <ID>isConditionalQuestion(target, state);
        // throw sometype of error
        if (state.form.get([lifted, 'expandable']) === null || state.form.get([lifted, 'expandable']).value === true) return state;


        const presentConditionals = state.form.get([hostID, 'conditionalQuestions']).value;
        const liftedIndex = state.form.get([lifted, 'index']).value;
        state.form.get([lifted, 'index']).setValue(state.form.get([target, 'index']).value);
        state.form.get([hostID, 'conditionalQuestions']).setValue([...presentConditionals.filter(cid => cid !== target), lifted]);
        state.form.get([target, 'index']).setValue(liftedIndex);
        // both are conditional quesitons
      } else if( typeof isConditionalQuestion(lifted, state) === 'string' && typeof isConditionalQuestion(target, state) === 'string'){

        // undefined behavior two different host ids...
        if(isConditionalQuestion(lifted, state) !== isConditionalQuestion(target, state)) return state;

        const liftedIndex = state.form.get([lifted, 'index']).value;

        state.form.get([lifted, 'index']).setValue(state.form.get([target, 'index']).value);
        state.form.get([target, 'index']).setValue(liftedIndex);
      } else if( typeof isConditionalQuestion(lifted, state) === 'string' && isConditionalQuestion(target, state) === false){

        if (state.form.get([target, 'expandable']).value === true ) return state;
        
        const targetIndex = state.form.get([target, 'index']).value;
        const hostID: ID = <ID>isConditionalQuestion(lifted, state);

        const presentConditionals = state.form.get([hostID, 'conditionalQuestions']).value;
        state.form.get([target, 'index']).setValue(state.form.get([lifted, 'index']).value);
        state.form.get([lifted, 'index']).setValue(targetIndex)
        state.form.get([hostID, 'conditionalQuestions']).setValue([...presentConditionals.filter(cid => cid !== lifted), target]);
        
        if (state.selectedConditionalQuestion === lifted) {
          state.selectedConditionalQuestion = undefined;
          state.selectedConstantQuestion = undefined;
        }

      } else {
        console.warn('[SCREENER_REDUCER]: Strange behavior in swap questions')
        console.log(typeof isConditionalQuestion(lifted, state) )
        console.log(typeof isConditionalQuestion(target, state) )
      }


      return (<any>Object).assign({}, state, {
        form: state.form
      }); 
    }

    case ScreenerActionTypes.UNSELECT_QUESTION: {
      if (action.payload === undefined) return state;

      const host_id = isConditionalQuestion(<ID>action.payload, state);

      if (host_id === false) {

        return (<any>Object).assign({}, state, {
          selectedConstantQuestion: undefined,
          selectedConditionalQuestion: undefined
        })
      } 
      
      return(<any>Object).assign({}, state, {
         selectedConditionalQuestion: undefined,
         selectedConstantQuestion: host_id
      })
      
    }

    default: {
      return state;
    }

  }
}

// following functions are used in main reducer

export function getForm(state$: Observable<State>){
  return state$.select(s => s.form);
}

export function getStyles(state$: Observable<State>){
  return state$.select(s => s.styles);
}

export function getError(state$: Observable<State>){
  return state$.select(s => s.error);
}

export function isLoading(state$: Observable<State>){
  return state$.select(s => s.loading);
}

export function getKeys(state$: Observable<State>) {
  return state$.select(s => s.keys)
          .filter(keys => keys !== undefined && keys.findIndex(k => k === undefined) < 0)
}

export function getUnusedKeys(state$: Observable<State>) {
  return state$.select(s => [s.keys, s.form.value])
    .map( ([allKeys, formValue]) => {
      let unusedKeys = allKeys;
      for (const id in formValue){
        unusedKeys =  formValue[id].key !== undefined ?  
                      unusedKeys.filter(key => key.name !== formValue[id].key.name) :
                      [...unusedKeys];
      }
      return unusedKeys;
    })           
}

export function getConstantQuestions(state$: Observable<State>){
  return state$.select(s => [ s.form, s ])
    .map( ([form, state]) => {
      const f = <FormGroup>form;
      const s = <State>state;
      const keys = Object.keys(f.value);

      return keys.map(k => f.value[k])
        .filter( q => isConditionalQuestion(q.id, s) === false )
        .sort( (a, b) => a.index - b.index);
    })

}

export function getSelectedConstantID(state$: Observable<State>){
  return state$.select(s => s.selectedConstantQuestion);
}

export function getSelectedConditionalID(state$: Observable<State>){
  return state$.select(s => s.selectedConditionalQuestion);
}

export function getConditionalQuestionIDS(state$: Observable<State>){
  let selectedConstantID: ID;

  return state$.select(s => { selectedConstantID = s.selectedConstantQuestion; return  s } )
    .filter(s => s.selectedConstantQuestion !== undefined)
    .map( state => {
      const conditionalQuestions = state.form.value[selectedConstantID].conditionalQuestions;
      return conditionalQuestions;
    });
}


// these following functions are used internally

export function blankQuestion(index: number): Question_2 {
  const id = randomString();
  const keyName = 'invalid'.concat(randomString())
  return {
    controlType: 'invalid',
    label: '',
    expandable: false,
    index: index,
    id: id,
    conditionalQuestions: [],
    options: [],
    key: {
      name: keyName,
      type: ''
    }
  };
}

export function question_to_control(question: Question_2): ControlMap {
  
  const approvedProperties = [
    'conditionalQuestions',
    'controlType',
    'expandable',
    'id',
    'index',
    'key',
    'label',
    'options'
  ]

  return Object.keys(question)
    .filter(key => approvedProperties.find(p => p === key) !== undefined)
    .filter(key => key !== 'key')
    .reduce( (accum, key) => {
        accum[key] = new FormControl(question[key]); 
        return accum; 
    }, {});
}

export function key_to_group(key: Key): FormGroup {
  return key !== undefined && key.name !== undefined && key.type !== undefined ?
         new FormGroup({
           name: new FormControl(key.name),
           type: new FormControl(key.type)
         }) :
         new FormGroup({
           name: new FormControl(''),
           type: new FormControl('')
         });
}


export function getConstantQuestionsLength(state: State): number {
  const value: { [key: string]: Question_2 } = state.form.value;

  return Object.keys(value).reduce( (length: number, key) => {
    const id = value[key].id;
    return isConditionalQuestion(id, state) !== false ? length : length + 1;
  }, 0);
}

export function getConditionalQuestionsLength(hostID: ID, state: State): number {
  if (state === undefined || state.form === undefined) return -1;
  const questionValues: { [key: string]: Question_2 } = state.form.value;
  
  const question = questionValues[hostID]
  if ( question === undefined ) return -1;

  if (question.expandable === false 
      || !Array.isArray(question.conditionalQuestions) || isConditionalQuestion(hostID, state) !== false) 
    return -1;

  return question.conditionalQuestions.length;
}


export function isConditionalQuestion(id: ID, state: State): ID | false {
  if (state === undefined || state.form === undefined) return false;
  const questionValues: { [key: string]: Question_2 } = state.form.value;

  for (const key in questionValues) {
    const q: Question_2 = questionValues[key];
    if (Array.isArray(q.conditionalQuestions) && q.conditionalQuestions.find(cq_id => cq_id === id) !== undefined) {
      return q.id;
    }
  }

  return false;
}

function randomString() {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < 20; i++) {
    let randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

function freshStyle(): Styles {
  return {
    selected: false,
    error: false
  }
}

function sortConstants(state): ID[] {
  return Object.keys(state.form.value)
          .filter(id => isConditionalQuestion(id, state) === false)
          .sort( (a, b) => state.form.get([a, 'index']).value - state.form.get([b, 'index']).value)
}

function sortConditionals(state, host_id): ID[] {
  return Object.keys(state.form.value)
          .filter(id => isConditionalQuestion(id, state) === host_id)
          .sort( (a, b) => state.form.get([a, 'index']).value - state.form.get([b, 'index']).value)
}