import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../core/services/auth.service'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/merge';

type Screener = any;
interface Model {
  errors: boolean;
  questions: any[];
  conditionalQuestions: any[];
  created: number;
  keys: any[];
  unusedKeys: any[];
  controls: FormGroup;
}


@Injectable()
export class ScreenerModel {
  private model: Model
  private controls: FormGroup;
  public questions$ = new ReplaySubject(1);
  public created$ = new ReplaySubject(1);
  public count$ = new ReplaySubject(1);
  public keys$ = new ReplaySubject(1);
  public unusedKeys$ = new ReplaySubject(1);
  public onSave$ = new Subject<boolean>();


  public filter$ = new ReplaySubject<boolean>(1);
  public keyFilter$ = new ReplaySubject<string>(1);


  constructor(private http: Http, private authService: AuthService) {
    this.model = {
      errors: false,
      questions: [],
      conditionalQuestions: [],
      controls: new FormGroup({}),
      created: 0,
      keys: [],
      unusedKeys: []
    }

  }

  load() {
    return this.serverLoad().do(data => this.setModel(data))
  }


  private createControlGroup(questions: any[]) {
    const questionToFormGroup = (question): any => {
      // this seems to break if written as a one-liner... try again some other time?
      return Object.keys(question)
        .reduce((accum, key) => {
          accum[key] = new FormControl(question[key], Validators.required);
          return accum;
        }, <FormGroup>{})
    }

    return questions.map(q => {
      return {
        group: new FormGroup(questionToFormGroup(q)),
        id: q.id
      }
    });
  }


  setModel(data) {
    this.model = (<any>Object).assign({}, data)
    this.model.questions = this.model.questions.sort((a, b) => a.index - b.index)
    this.model.unusedKeys = data.keys.filter(key => data.questions.find(question => key.name === question.key) === undefined)
    this.model.keys = [...data.keys]
    this.model.controls = new FormGroup({});
    this.model.conditionalQuestions = data.conditionalQuestions || [];


    for (const question of this.createControlGroup([...this.model.questions, ...this.model.conditionalQuestions])) {
      this.model.controls.addControl(question.id, question.group);
    }

    // load data into subjects
    this.questions$.next(this.model.questions);
    this.created$.next(this.model.created);
    this.count$.next(this.model.questions.length);
    this.keys$.next(this.model.keys);
    this.unusedKeys$.next(this.model.unusedKeys);
    this.filter$.next(false);
    this.keyFilter$.next('');
  }

  private swap(sourceQuestion, destinationIndex) {
    const currentIndex = sourceQuestion.index;
    const swapQuestion = this.model.questions.find(q => q.index === destinationIndex);
    let swapped;

    try {
      swapped = this.model.questions.map((q, index) => {
        if (index === destinationIndex) {
          sourceQuestion.index = index;
          this.model.controls.get(sourceQuestion.id).get('index').setValue(index);
          return sourceQuestion;
        } else if (index === currentIndex) {
          swapQuestion.index = index;
          this.model.controls.get(swapQuestion.id).get('index').setValue(index);
          return swapQuestion;
        }
        return q;
      })
      // swapQuestion maybe undefined
    } catch (e) {
      console.error(e);
      swapped = this.model.questions;
    } finally {
      return swapped;
    }
  }

  increaseIndex(question) {
    if (question.index === this.model.questions.length - 1) {
      return;
    }
    const nextIndex = question.index + 1;
    this.questions$.next(this.swap(question, nextIndex));
  }

  decreaseIndex(question) {
    if (question.index === 0) {
      return;
    }
    const previousIndex = question.index - 1;
    this.questions$.next(this.swap(question, previousIndex));
  }

  addQuestion() {
    const id = randomString();

    const blank = {
      controlType: 'invalid',
      key: 'invalid',
      label: '',
      expandable: false,
      index: 0,
      id: id
    };

    let mutatingQuestions = [...this.model.questions];
    for (let question of mutatingQuestions) {
      const incr = question.index + 1;
      this.model.controls.get(question.id).get('index').setValue(incr)
      question.index = incr;
    }

    const newGroup = Object.keys(blank).reduce((group, key) => {
      group[key] = new FormControl(blank[key], Validators.required);
      return group;
    }, {})
    const g = new FormGroup(newGroup)
    this.model.controls.addControl(blank.id, g);
    const swap = [blank, ...this.model.questions]
    this.questions$.next(swap);
    this.model.questions = swap;
    this.count$.next(this.model.questions.length);
  }

  addConditionalQuestion(question) {
    console.log(`addConditionalQuestion called on question with ${question.key}`);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    const questionKey = this.model.keys.find(k => k.name === question.key);

    if (questionKey === undefined || question.controlType !== 'CheckBox'
      || questionKey.type !== 'boolean' || question.expandable !== true) {
      throw new Error('adding a conditional question to an invalid target');
    }

    question.conditionalQuestions = question.conditionalQuestions || [];

    const newID = randomString();

    const blank = {
      controlType: 'invalid',
      key: 'invalid',
      label: '',
      expandable: false,
      index: 0,
      id: newID
    };

    const newGroup = Object.keys(blank).reduce((group, key) => {
      group[key] = new FormControl(blank[key], Validators.required);
      return group;
    }, {})
    const g = new FormGroup(newGroup)

    this.model.controls.addControl(newID, g);


    this.model.conditionalQuestions.push(blank);
    if (this.getControls(question.id).get('conditionalQuestions') === null) {
      const questionForm = <FormGroup>this.getControls(question.id);
      questionForm.addControl('conditionalQuestions', new FormControl(question.conditionalQuestions, Validators.required));
    }

    question.conditionalQuestions.push(newID)
    this.questions$.next(this.model.questions);

    console.log('exiting add conditional');
    console.log(question)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  }

  findConditionals(question) {
    const ids = question.conditionalQuestions;

    return ids.map(id => this.model.conditionalQuestions.find(q => q.id === id))
      .filter(question => question !== undefined)
      .sort((a, b) => a.index - b.index);
  }

  clearCondtionals(question) {

    for (const id of question.conditionalQuestions) {
      if (this.model.controls.contains(id)) {
        this.model.controls.removeControl(id);
      }

    }
    const removed = this.model.conditionalQuestions.filter(q => question.conditionalQuestions.find(id => q.id === id) === undefined)
    this.model.conditionalQuestions = removed;

    const q = this.model.questions.find(modelQuestion => modelQuestion.id === question.id);
    q.conditionalQuestions = [];
    this.questions$.next( this.model.questions );
  }


  getControls(id: string) {
    return this.model.controls.get(id);
  }

  getModelControls() {
    return this.model.controls;
  }


  handleKeyChange(new_key: string, old_key: string) {
    const droppedNewlyChosenKey = this.model.unusedKeys.filter(key => key.name !== new_key)
    if (old_key !== undefined && old_key !== '' && old_key !== 'invalid') {

      const oldKey = this.model.keys.find(k => k.name === old_key)
      this.model.unusedKeys = [oldKey, ...droppedNewlyChosenKey]

    } else {
      this.model.unusedKeys = [...droppedNewlyChosenKey]
    }
    this.unusedKeys$.next(this.model.unusedKeys);
  }

  private getCredentials(): Headers {
    if (this.authService.credentials === undefined) {
      throw new Error('undefined credentials in data service');
    }
    const headers = new Headers();
    headers.append("Authorization", "Basic " + this.authService.credentials);
    return headers;
  }


  // this function should be broken into minimum two smaller functions
  save() {

    if (Object.keys(this.model.controls.controls).length === 0) {
      return Observable.throw<string>('there are no questions to save')
    }

    const untrackedQuestions = this.model.questions.filter(q => this.model.controls.contains(q.id));

    if (untrackedQuestions.length === 0) {
      return Observable.throw<string>(' this has too many questions tracked? ');
    }


    /* this should be a function => partitioning values into questions or conditionalQuestions */
    const questions = [];
    const conditionalQuestions = [];

    for (const v in this.model.controls.value) {
      const value = this.model.controls.value[v];
      const conditionalQuestion = this.model.conditionalQuestions.find(q => q.id === value.id);
      const question = this.model.questions.find(q => q.id === value.id);

      if (conditionalQuestion === undefined && question !== undefined) {
        questions.push(value);
      } else if (conditionalQuestion !== undefined && question === undefined) {
        conditionalQuestions.push(value);
      } else {
        throw new Error(`unable to associate form value with a question. id: ${value.id}`)
      }

    }
    /* end partition function */

    /* this should be a function => ensure some degree of data integrity/conformity then assign to return value object*/
    const presentBoolean = (question) => (key) => question[key] !== undefined && question[key] !== 'invalid' && question[key] !== '';

    for (const q of [...questions, ...conditionalQuestions]) {
      const checker = presentBoolean(q);
      const failedChecking = ['label', 'index', 'controlType', 'key'].filter(checker);

      if (failedChecking.length !== 4) {
        return Observable.throw<string>(`question at index: ${q.index} has invalid properties`)
      }
    }

    const findKeyType = key => this.model.keys.find(k => k.name === key).type;

    const key_type_checker = (questions: any[]) => {
      const conflictA = questions.filter(q => q.controlType !== 'CheckBox' && findKeyType(q.key) === 'boolean')
      const conflictB = questions.filter(q => findKeyType(q.key) === 'integer' && q.controlType === 'CheckBox')
      const conflicts = [...conflictA, ...conflictB];


      if (conflicts.length !== 0) {
        throw new Error('conflicts detected');
      }
    }


    let dummy;

    try {
      key_type_checker(questions);
      key_type_checker(conditionalQuestions);
      return Observable.of({
        questions: questions,
        conditionalQuestions: conditionalQuestions,
        created: -1
      })
    } catch (e) {
      console.error(e);
      return Observable.throw<string>('conflicts detected')
    }
  }





  pushToNetwork(data) {
    const headers = this.getCredentials()
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return Observable.of(data)
      .do(_ => console.log('\n ~~~~~~~~~~~~~~~~~~~~~~~~~ \n saving to network'))
      .do(screener => console.log(screener))
      .map(screener => JSON.stringify({ screener: screener }))
      .switchMap(body => this.http.post('/protected/screener', body, options))
      .map(response => response.json().response)
      .timeout(60000)
  }

  delete(question: any) {
    const index = question.index;
    this.model.questions = this.model.questions.filter(q => q.id !== question.id);
    if (this.model.controls.contains(question.id)) {
      this.model.controls.removeControl(question.id);
    }

    if (question.key !== undefined && question.key !== 'invalid') {
      this.model.unusedKeys.push(this.model.keys.find(k => k.name === question.key))
    }

    let mutatingQuestions = [...this.model.questions];
    for (let question of mutatingQuestions) {
      // iterating through the questions in model, if it's higher than the question we're 
      // deleting then we need to decrement those in higher indices 
      if (question.index > index) {
        const decr = question.index - 1;
        this.model.controls.get(question.id).get('index').setValue(decr)
        question.index = decr;
      }
    }

    if (question.expandable === true) {
      for (const id of question.conditionalQuestions) {
        if (this.model.controls.contains(id)) {
          this.model.controls.removeControl(id);
        }
      }
      const removed = this.model.conditionalQuestions.filter(q => question.conditionalQuestions.find(id => q.id === id) === undefined)
      this.model.conditionalQuestions = removed;
    }

    // update the model and push changes
    this.model.questions = mutatingQuestions;
    this.questions$.next(this.model.questions);
    this.count$.next(this.model.questions.length)

  }



  private serverLoad() {
    const headers = this.getCredentials()
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/protected/screener', options)
      .map(res => res.json().response)
      .do(networkResponse => console.log(networkResponse))
      .retry(2)
      .timeout(50000)
  }

  loadError(error: Response | any) {

    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.message || JSON.stringify(body);
      errMsg = err;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  pushQuestions() {
    this.questions$.next(this.model.questions);
  }

  deleteConditional(hostQuestion, hiddenQuestion) {
    hostQuestion.conditionalQuestions = hostQuestion.conditionalQuestions.filter(q => q !== hiddenQuestion.id);
    this.model.controls.removeControl(hiddenQuestion.id);
    this.model.controls.get(hostQuestion.id).get('conditionalQuestions').setValue(hostQuestion.conditionalQuestions);
    this.model.conditionalQuestions = this.model.conditionalQuestions.filter(q => q.id !== hiddenQuestion.id)
  }

  setConditionalIndices(questions) {
    for (const q of questions) {
      this.model.controls.get(q.id).get('index').setValue(q.index);
    }
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