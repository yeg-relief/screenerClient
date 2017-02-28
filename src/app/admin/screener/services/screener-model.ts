import { Injectable } from '@angular/core';
import { Key } from '../../models/key';
import { Question, Id, Model } from './index';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class ScreenerModel {
  private questionControls: FormGroup;
  private keyControls: FormGroup;
  created: number;

  constructor() { }

  pull() {
    const questions = []
    for(const key in this.questionControls.value) {
      if (!this.isConditionalQuestion(key)) questions.push(this.findQuestionById(key))
    }

    let unusedKeys = []
    const uk = this.keyControls.get('unusedKeys');
    if (uk !== null) unusedKeys = uk.value.sort(this.keyComparator).map(key => key.name); 

    let keys = []
    const k = this.keyControls.get('keys');
    if (k !== null) keys = k.value.sort(this.keyComparator).map(key => key.name);

    return {
      created: this.created,
      questions: questions.sort(this.questionComparator).map(question => question.id),
      unusedKeys: unusedKeys,
      keys: keys
    }
  }


  questionValues(): Question[] {
    const value = this.questionControls.value;
    return Object.keys(value).map(key => value[key]).sort(this.questionComparator);
  }

  findKey(name: string): Key {
    const value: Key[] = this.keyControls.value.keys;
    if (value === undefined || value === null) throw new Error('[ScreenerModel].findKey this.keyControls.value.keys is undefined or null'); 
    return value.find(key => key.name === name);
  }

  findQuestionById(id: Id): Question {
    if (typeof id !== 'string') { 
      console.warn('[ScreenerModel].findQuestionById: id is not a string');
      console.warn(id)
      return;
    }

    const value: {[key: string]: Question} = this.questionControls.value;
    for (const key in value) {
      if (value[key].id === id) {
        return value[key];
      }
    }
  }

  findQuestionByKey(keyName: string): Question {
    const value: {[key: string]: Question} = this.questionControls.value;

    for (const valueKey in value) {
      if (value[valueKey].key === keyName) {
        return value[valueKey];
      }
    }
  }

  releaseKey(name: string) {
    if(typeof name !== 'string' || this.findKey(name) === undefined) {
      console.warn(name);
      console.warn(this.findKey(name));
      console.warn(`[ScreenerModel].releaseKey unable to find key or function arguement is not a string`);
      return;
    }

    const update = [...this.keyControls.value.unusedKeys, this.findKey(name)].sort(this.keyComparator);
    this.keyControls.get('unusedKeys').setValue(update);
  }

  useKey(name: string) {
    if(typeof name !== 'string' || this.findKey(name) === undefined) {
      console.warn(name);
      console.warn(this.findKey(name));
      console.warn(`[ScreenerModel].useKey unable to find key or function arguement is not a string`);
      return;
    }

    const update = this.keyControls.value.unusedKeys.filter(key => key.name !== name);
    this.keyControls.get('unusedKeys').setValue(update);
  }

  makeExpandable(id: Id) { this.getQuestionControl(id).get('expandable').setValue(true) }

  private createFormGroup(question): {[key: string]: AbstractControl } {
    const assignControl = (accum: FormGroup, key: string) => {
      accum[key] = key !== 'conditionalQuestions' || key !== 'options' ? 
                   new FormControl(question[key], Validators.required) : 
                   new FormControl(question[key]);

      return accum;
    }

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
        .reduce(assignControl, {})
  }

  keyComparator(a: Key, b: Key): number {
    const titleA = a.name.toUpperCase();
    const titleB = b.name.toUpperCase();

    if (titleA === undefined || titleB === undefined) return -1;

    if (titleA < titleB) return -1;

    if (titleB < titleA) return 1;

    return 0;
  }

  questionComparator(a: Question, b: Question): number { return b.index - a.index  }

  getQuestionControl(id: string): FormGroup { return <FormGroup>this.questionControls.get(id) }

  clearConditionals(hostID: string) {
    if (hostID === undefined){
      throw new Error('[ScreenerModel].clearConditionals: attempting to clear conditionals ' 
                      + 'of question with undefined id')
    } 
    

    const hostControls = this.questionControls.get([hostID, 'conditionalQuestions']);
    if (hostControls === null) throw new Error('[ScreenerModel].clearConditionals: hostControls is null.');

    const ids: Id[] = hostControls.value;

    for(const id of ids) {
      this.deleteQuestion(id);
    }
    hostControls.setValue([]);

  }

  swapQuestions(questionA_id: Id, questionB_id: Id) {
 
    const a_controls = this.questionControls.get([questionA_id, 'index']);
    const b_controls = this.questionControls.get([questionB_id, 'index']);

    if (a_controls === null || b_controls === null) {
      console.error(a_controls);
      console.error(b_controls);
      console.error(this.questionControls.value);
      throw new Error('[ScreenerModel].swapQuestions: unable to find both controls');
    }

    a_controls.setValue(b_controls.value);
    b_controls.setValue(a_controls.value);
  }

  addConditionalQuestion(hostId: Id) {
    const hostControls: FormGroup = <FormGroup>this.questionControls.get(hostId);
    const id = randomString();
    const key = 'invalid'.concat(randomString())
    
    const errorPreamble = () => {
      console.error(hostId);
      console.error(this.questionControls.value);
      console.error(hostControls);
      if (present) {
        console.error(present);
      }
    }

    if (hostControls === null){
      errorPreamble();
      throw new Error('[ScreenerModel].addConditionalQuestion: unable to find hostControls');
    }

    const index = Object.keys(hostControls.get('conditionalQuestions').value).length;
    const blank: Question = {
      controlType: 'invalid',
      key: key,
      label: '',
      expandable: false,
      index: index,
      id: id,
      conditionalQuestions: [],
      options: []
    };

    const present: Question = hostControls.value;
    if (present.expandable === false) {
      errorPreamble();
      throw new Error('[ScreenerModel].addConditionalQuestion: attempting to add a' + 
                       'conditional question to a non-expandable question')
    }

    if (present.conditionalQuestions === undefined) {
      hostControls.addControl('conditionalQuestions', new FormControl([], Validators.required));
    }

    if (Array.isArray(present.conditionalQuestions)) {
      hostControls.get('conditionalQuestions').setValue([...present.conditionalQuestions, blank.id]); 
    } else {
      errorPreamble();
      throw new Error('[ScreenerModel].addConditionalQuestion: unable to find "conditionalQuestions" control on hostControl');
    }
  }

  addQuestion() {
    const id = randomString();
    const key = 'invalid'.concat(randomString())
    const index = Object.keys(this.questionControls.value).length;
    const blank: Question = {
      controlType: 'invalid',
      key: key,
      label: '',
      expandable: false,
      index: index,
      id: id,
      conditionalQuestions: [],
      options: []
    };

    const control  = this.createFormGroup(blank);
    this.questionControls.addControl(id, new FormGroup(control) );
  }

  setModel(data: any) {
    
    const model: Model = {
      created: data.created || 0,
      questions: data.questions.sort(this.questionComparator) || [],
      conditionalQuestions: data.conditionalQuestions || [],
      keys: data.keys.sort(this.keyComparator) || [],
      unusedKeys: []
    };
    this.created = model.created;
    this.questionControls = new FormGroup({});

    const allQuestions = [ ...model.questions, ...model.conditionalQuestions ];
    
    const unusedKeys = model.keys
      .filter(key => allQuestions.find(q => q.key === key.name) === undefined)
      .sort(this.keyComparator);
    
    for (const q of allQuestions) {
      const control = this.createFormGroup(q);
      this.questionControls.addControl(q.id, new FormGroup(control) );
    }
    
    this.keyControls = new FormGroup({});
    this.keyControls.addControl('keys', new FormControl(model.keys, Validators.required));
    this.keyControls.addControl('unusedKeys', new FormControl(unusedKeys, Validators.required));
    
  }

  deleteQuestion(id: Id) {
    if(id === undefined) {
      throw new Error('[ScreenerModel].deleteQuestion target question id is undefined');
    }

    const values = this.questionControls.value;
    let questionValue: Question;
    
    for(const key in values){
      if (values[key].id === id) {
        questionValue = values[key];
        break;
      }
    }

    if(questionValue === undefined) {
      console.error(id);
      console.error(values);
      throw new Error('[ScreenerModel].deleteQuestion target question not found in FormGroup value');
    }

    const hostID = this.isConditionalQuestion(id);

    // adjust indices for constant questions
    if (hostID === false) {
      for(const key in values){
        try {
          const indexControl = this.questionControls.get([key, 'index']);
          if (values[key].index > questionValue.index && indexControl !== null && this.isConditionalQuestion(key) === false) {
            indexControl.setValue( values[key].index - 1 );
          }
        } catch (e) {
          console.error('[ScreenerModel].deleteQuestion: re-ordering constant question indices');
          console.error(e);
          throw new Error(e);
        }
        
      }
    }
    // conditionalQuestion => remove the id in host 
    else if(typeof hostID === 'string') {
      try {
        const update = this.questionControls.value[hostID].conditionalQuestions.filter(cq_id => cq_id !== id);
        this.questionControls.get([hostID, 'conditionalQuestions']).setValue(update);  
      } catch (e) {
        console.error("[ScreenerModel].deleteQuestion: removing conditionalQuestion id from host's conditional questions");
        console.error(e);
        throw new Error(e);
      }
    }
    
    
    this.releaseKey(questionValue.key)
    this.questionControls.removeControl(id);
  }

  addOption(hostID, optionValue){
    const control = this.questionControls.get([hostID, 'options']);
    const value = control.value;
    control.setValue([optionValue, ...value].sort( (a, b) => a - b));
  }

  removeOption(hostID, optionValue) {
    const control = this.questionControls.get([hostID, 'options']);
    const value = control.value;
    control.setValue([...value].filter(option => option !== optionValue).sort( (a, b) => a - b));
  }

  clearOptions(hostID) { this.questionControls.get([hostID, 'options']).setValue([]) }

  isConditionalQuestion(id: Id): Id | false {
    const questionValues = this.questionControls.value;

    for(const key in questionValues) {
      const q: Question = questionValues[key];
      if (Array.isArray(q.conditionalQuestions) && q.conditionalQuestions.find(cq_id => cq_id === id) !== undefined) {
        return q.id;
      }
    }

    return false;
  }
}

function randomString() {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < 20; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}
