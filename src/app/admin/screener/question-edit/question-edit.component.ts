import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ID, Key, Question, ControlType } from '../../models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as actions  from '../store/screener-actions';

type QUESTION_KEY_TYPE = 'integer' | 'boolean' | 'invalid' | 'broken';




@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})
export class QuestionEditComponent implements OnInit, OnDestroy {
  private readonly INVALID_TYPE: QUESTION_KEY_TYPE = 'invalid';
  private readonly BROKEN_TYPE: QUESTION_KEY_TYPE = 'broken';
  private readonly INTEGER_TYPE: QUESTION_KEY_TYPE = 'integer';
  private readonly CONTROL_TYPES = [
    { value: 'NumberInput', display: 'type' },
    { value: 'NumberSelect', display: 'select'},
    { value: 'CheckBox', display: 'checkbox' },
  ];
  private readonly DEBOUNCE_TIME = 250;

  @Input() form: FormGroup;
  @Input() questionID: ID;

  private selectedKeyType: Observable<QUESTION_KEY_TYPE>;
  private unusedKeys: Observable<Key[]>;
  private subscriptions: Subscription[] = [];
  private numberOptionForm: FormGroup;
  private numberOption$: Observable<number[]>;
  private controlType$: Observable<ControlType>;
  private options$: Observable<number[]>;

  

  constructor(private store: Store<fromRoot.State>, private fb: FormBuilder) { }

  ngOnInit() {

    // TODO: create all questions with an options array...
    if(this.form.get([this.questionID, 'options']) === null){
      (<FormGroup>this.form.get([this.questionID])).addControl('options', new FormControl([]));
      console.log(this.form.get([this.questionID, 'options']).value)
    }


    if(this.form.get([this.questionID, 'key']) === null) {
      this.selectedKeyType = Observable.of(this.BROKEN_TYPE);
    } else {
      this.selectedKeyType = this.form.get([this.questionID, 'key']).valueChanges
        .withLatestFrom(this.store.let(fromRoot.getScreenerKeys))
        .map( ([selectedKeyName, allKeys]) => {
          const key = allKeys.find(key => key.name === selectedKeyName);
          return key === undefined ? this.INVALID_TYPE : key.type;
        })
    }

    let seed: Key[] = []; 
    
    Observable.of(this.form.value)
      .let(this.findUnusedKeys.bind(this))
      .subscribe( (keys: Key[]) => seed = [...keys])


    this.unusedKeys = this.form.valueChanges
      .debounceTime(this.DEBOUNCE_TIME)
      .let(this.findUnusedKeys.bind(this))
      .startWith(seed);

    const digit_pattern = '^\\d+$'

    this.numberOptionForm = this.fb.group({
      optionValue: ['', Validators.pattern(digit_pattern) ]
    })
    
    this.controlType$ = this.store.let(fromRoot.getSelectedConstantID)  
      .mergeMap( id => this.form.get([id, 'controlType']).valueChanges)
      .startWith(this.form.get([this.questionID, 'controlType']).value)
      .do( _ => console.log('this.controlType$'))
      .catch( _ => Observable.of(''))

    this.options$ = this.store.let(fromRoot.getSelectedConstantID)
      .mergeMap( id => this.form.get([id, 'options']).valueChanges )
      .startWith(this.form.get([this.questionID, 'options']).value)
      .do( _ => console.log('this.options$'))
      .catch( _ => Observable.of([]))

    this.subscriptions = [  ]
  }

  findUnusedKeys(input: Observable<{[key: string]: Question}>): Observable<Key[]> {
    return input.map( changes => [Object.keys(changes), changes] )
      .map( ([keys, value]) => (<string[]>keys).map( key => value[key].key))
      .withLatestFrom(this.store.let(fromRoot.getScreenerKeys))
      .map( ([questionKeyNames, allKeys]) => {
        return allKeys.filter( key => questionKeyNames.find(name => name === key.name) === undefined)
      })
  }

  addOption() {
    const optionValue = Number.parseInt(this.numberOptionForm.get('optionValue').value, 10);
    const presentOptions = this.form.get([this.questionID, 'options']).value;
    this.form.get([this.questionID, 'options']).setValue([...presentOptions, optionValue]);
    this.numberOptionForm.get('optionValue').setValue('');
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) !sub.closed ? sub.unsubscribe() : undefined;
  }

}
