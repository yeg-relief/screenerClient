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

@Injectable()
export class ScreenerModel implements OnDestroy, OnInit {
  state$: Observable<Screener>;
  dispatch: Subject<Screener>;

  unusedKeys$: ReplaySubject<any>;
  questions$: ReplaySubject<any>;

  filterErrors$: ReplaySubject<boolean>;
  filterKey$: ReplaySubject<string>;
  publicform$: ReplaySubject<any>;

  init = false;

  private form$: Observable<FormGroup>;


  private subscription: Subscription;

  constructor(private http: Http, private authService: AuthService) { }


  ngOnInit() {

  }

  ngOnDestroy() {
    if (!this.subscription.closed) {
      this.subscription.unsubscribe()
    }
  }

  private getCredentials(): Headers {
    if (this.authService.credentials === undefined) {
      throw new Error('undefined credentials in data service');
    }
    const headers = new Headers();
    headers.append("Authorization", "Basic " + this.authService.credentials);
    return headers;
  }


  save(inputObservable: Observable<Screener>) {
    const headers = this.getCredentials()
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return inputObservable
      .map(screener => JSON.stringify({ screener: screener }))
      .switchMap(body => this.http.post('/protected/screener', body, options))
      .do(response => console.log(response.json()))
      .map(response => response.json().response)
      .do(screener => console.log(screener))
      .catch(this.loadError)
      .retry(2)
      .timeout(50000)

  }

  load() {
    const cachedLoad = this.serverLoad().multicast(new ReplaySubject<any>(1)).refCount();

    const form$ = cachedLoad
      .map(screener => screener.questions)
      .switchMap(x => x)

      // turn each question into a FormGroup using a random key to avoid name collisions in form as a whole
      .reduce<any>((rawAdminGroup, question) => {
        const keyGroup = {};
        keyGroup['label'] = new FormControl(question.label, [Validators.required, Validators.minLength(5)]);
        keyGroup['controlType'] = new FormControl(question.controlType, Validators.required);
        keyGroup['key'] = new FormControl(question.key, Validators.required);
        keyGroup['expandable'] = new FormControl(question.expandable, Validators.required);
        if (question.controlType === 'NumberSelect') {
          keyGroup['options'] = new FormControl(question.options, Validators.required);
        }
        keyGroup['index'] = new FormControl(question.index, Validators.required)
        const key = Math.random().toString()
        rawAdminGroup[key] = new FormGroup(keyGroup);


        return rawAdminGroup;
      }, {})
      // map the object of formgroups into a formgroup (connect the pieces)
      .map(group => new FormGroup(group))

    this.state$ = Observable.zip(form$, cachedLoad)
      .scan((state, zip) => {
        const form = zip[0];
        const screener = zip[1];

        console.log(form);
        console.log(screener);

        return {
          form: form,
          screener: screener,
          keys: [
            { name: 'key_integer', type: 'integer' },
            { name: 'key_boolean', type: 'boolean' },
            { name: 'married', type: 'boolean' },
            { name: 'income', type: 'integer' },
            { name: 'incomesss', type: 'integer' }
          ]
        }
      }, {})

      // determine keys not in use 
      .map((state: any) => {
        const usedKeys = Object.keys(state.form.value).map(k => state.form.value[k].key)
        const keyInUse = key => usedKeys.findIndex(usedName => usedName === key.name) < 0;

        const unusedKeys = state.keys.filter(keyInUse)

        state['unusedKeys'] = [...unusedKeys]
        return state;
      })
      .multicast(new ReplaySubject<any>(1)).refCount();

    this.unusedKeys$ = new ReplaySubject<any>(1);
    this.filterErrors$ = new ReplaySubject<any>(1);
    this.state$.take(1).map(s => s.unusedKeys).subscribe(keys => this.unusedKeys$.next(keys))

    this.filterKey$ = new ReplaySubject<any>(1);
    this.publicform$ = new ReplaySubject<any>(1);
    this.questions$ = new ReplaySubject<any>(1);
    this.state$.take(1)
      .map(s => s.screener.questions)
      .subscribe(questions => this.questions$.next(questions) )
    this.state$.take(1)
      .map(s => s.form)
      .subscribe(form => this.publicform$.next(form));
    
    //this.unusedKeys$.next([]);
    return this.state$;
  }

  updateUnusedKeys(keyAdd, keyRemove) {
    Observable.zip(
      this.unusedKeys$,
      this.state$
    )
      .take(1)
      .subscribe(([currentUnusedKeys, state]) => {
        let update;
        if (keyAdd === '' && keyRemove !== undefined){
          const unusedKeys = currentUnusedKeys.filter(k => k.name !== keyRemove);
          update = unusedKeys
        } else {
          const unusedKeys = currentUnusedKeys.filter(k => k.name !== keyRemove);
          const usedKey = state.keys.find(k => k.name === keyAdd);
          update = [usedKey, ...unusedKeys]
        }
        this.unusedKeys$.next(update);
      })
  }

  addQuestion(blankQuestion){
    if (blankQuestion === undefined){
      return;
    }

    Observable.zip(
      this.questions$,
      this.state$.map(s => s.form)
    )
    .take(1)
    .subscribe( ([questions, form]) => {
      for(let q of questions) {
        (<any>q).index++;
      }
      blankQuestion.index = 0;

      const hashKey = Math.random().toString();
      const formGroup = <FormGroup>form;
      const keyGroup: any  = {};
      keyGroup['label'] = new FormControl('', [Validators.required, Validators.minLength(5)]);
      keyGroup['controlType'] = new FormControl('', Validators.required);
      keyGroup['key'] = new FormControl('', Validators.required);
      keyGroup['expandable'] = new FormControl(false, Validators.required);
      const rawAdminGroup = new FormGroup(keyGroup);
      form.controls[hashKey] = rawAdminGroup;
      questions.push(blankQuestion)
      this.questions$.next(questions);
      this.publicform$.next(form);
      
    })
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
      ]
    }



    return Observable.of(mockLoad)
      /*
      this.http.get('/protected/screener', options)
      .map(res => res.json().response)
      */
      .catch(this.loadError)
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
