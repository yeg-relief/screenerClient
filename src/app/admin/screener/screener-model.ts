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
        controls: new FormGroup({}),
        created: 0,
        keys: [],
        unusedKeys: []
      }
      
  }

  load() {
    return this.serverLoad().do( data => this.setModel(data) )
  }

  setModel(data) {
    this.model = (<any>Object).assign({}, data)
    this.model.unusedKeys = data.keys.filter(key => data.questions.find(question => key.name === question.key) === undefined)
    this.model.keys = [...data.keys]
    this.model.controls = new FormGroup({});

    const modelGroup: any = this.model.questions
                                .forEach( question => {
                                  const controls: any = Object.keys(question).reduce( (accum, key) => {
                                    accum[key] = new FormControl(question[key], Validators.required);
                                    return accum;
                                  }, <FormGroup>{})
                                  const c = new FormGroup(controls)
                                  this.model.controls.addControl(question.id, c);
                                })

    // load data into subjects
    this.questions$.next(this.model.questions);
    this.created$.next(this.model.created);
    this.count$.next(this.model.questions.length);
    this.keys$.next(this.model.keys);
    this.unusedKeys$.next(this.model.unusedKeys);
    this.filter$.next(false);
    this.keyFilter$.next('');
  }

  addQuestion() {
    console.log('\n~~~~~~~~~~~~~~~~\n')
    console.log('ADD QUESTION CALLED')
    const id = 'temp'.concat(randomString())
    
    const blank = {
      controlType: 'invalid',
      key: 'invalid',
      label: '',
      expandable: false,
      index: 0,
      id: id
    };

    let mutatingQuestions = [...this.model.questions];
    for(let question of mutatingQuestions) {
      const incr = question.index + 1;
      this.model.controls.get(question.id).get('index').setValue(incr)
      question.index = incr;
    }

    const newGroup = Object.keys(blank).reduce( (group, key) => {
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

  getControls(id: string) {
    return this.model.controls.get(id);
  }

  getModelControls() {
    return this.model.controls;
  }


  handleKeyChange(new_key: string, old_key: string) {
    const droppedNewlyChosenKey = this.model.unusedKeys.filter( key => key.name !== new_key)
    if( old_key !== undefined && old_key !== '' && old_key !== 'invalid' ){
       
      const oldKey = this.model.keys.find( k => k.name === old_key)
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



  save() {

    if ( Object.keys(this.model.controls.controls).length === 0 ) {
      return Observable.throw<string>('there are no questions to save')
    }

    const untrackedQuestions = this.model.questions.filter( q => this.model.controls.contains(q.id) );

    if ( untrackedQuestions.length === 0 ) {
      return Observable.throw<string>(' this has too many questions tracked? ');
    }

    const presentBoolean = (question) => (key) => question[key] !== undefined && question[key] !== 'invalid' && question[key] !== '';

    const newQuestions = [];
    for ( const v in this.model.controls.value ) {
      const checker = presentBoolean(this.model.controls.value[v]);
      const failedChecking = ['label', 'index', 'controlType', 'key'].filter(checker);

      if ( failedChecking.length !== 4 ) {
        console.error(failedChecking)
        const question = this.model.controls.value[v];
        return Observable.throw<string>(`question at index: ${ question.index } has invalid properties`)
      }

      newQuestions.push(this.model.controls.value[v]);
    }

    const findKeyType = key => this.model.keys.find( k => k.name === key).type;
 
    const conflictA = newQuestions.filter( q => q.controlType !== 'CheckBox' && findKeyType(q.key) === 'boolean')
    const conflictB = newQuestions.filter( q => findKeyType(q.key) === 'integer' && q.controlType === 'CheckBox')
    const conflicts = [...conflictA, ...conflictB];

    if (conflicts.length !== 0) {
      return Observable.throw<any>(conflicts);
    }

    return Observable.of({
      questions: newQuestions,
      created: -1,
    })
  }





  pushToNetwork( data ) {
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
    this.model.controls.removeControl(question.id)
    
    if ( question.key !== undefined && question.key !== 'invalid'){
      this.model.unusedKeys.push( this.model.keys.find(k => k.name === question.key) )
    }

    let mutatingQuestions = [...this.model.questions];
    for(let question of mutatingQuestions) {
      // iterating through the questions in model, if it's higher than the question we're 
      // deleting then we need to decrement those in higher indices 
      if (question.index > index){
        const decr = question.index - 1;
        this.model.controls.get(question.id).get('index').setValue(decr)
        question.index = decr;
      }
    }

    // update the model and push changes
    this.model.questions = mutatingQuestions;
    this.questions$.next( this.model.questions );
    this.count$.next ( this.model.questions.length )
  }



  private serverLoad() {
    const headers = this.getCredentials()
    const options = new RequestOptions({ headers: headers });

    const mockLoad = {
      version: 1,
      created: 0,
      questions: [
        {
          controlType: 'NumberInput',
          key: 'income',
          label: 'income?',
          expandable: false,
          index: 0,
          id: "djfoisajfoifjosjdofj"
        },
        {
          controlType: 'CheckBox',
          key: 'married',
          label: 'married?',
          expandable: false,
          index: 1,
          id: 'gonghokjprj'
        },
        {
          controlType: 'NumberSelect',
          key: 'incomesss',
          label: 'income v2??',
          expandable: false,
          options: [10, 1000, 1000],
          index: 2,
          id: 'iosdjfiopsjgpdsijg'
        }
      ],
      keys: [
        { name: 'key_integer', type: 'integer' },
        { name: 'key_boolean', type: 'boolean' },
        { name: 'married', type: 'boolean' },
        { name: 'income', type: 'integer' },
        { name: 'incomesss', type: 'integer' }
      ]
    }



    return this.http.get('/protected/screener', options)
      .map(res => res.json().response)
      .do( networkResponse => console.log(networkResponse) )
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
}

function randomString() {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < 10; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}