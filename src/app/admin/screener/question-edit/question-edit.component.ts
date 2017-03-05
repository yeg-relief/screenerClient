import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ID, Key, Question, ControlType } from '../../models';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as actions from '../store/screener-actions';

type QUESTION_KEY_TYPE = 'integer' | 'boolean' | 'invalid' | 'broken' | '';




@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})
export class QuestionEditComponent implements OnInit, OnDestroy {
  private readonly INVALID_TYPE: QUESTION_KEY_TYPE = 'invalid';
  private readonly BROKEN_TYPE: QUESTION_KEY_TYPE = 'broken';
  private readonly INTEGER_TYPE: QUESTION_KEY_TYPE = 'integer';
  private readonly BOOLEAN_TYPE: QUESTION_KEY_TYPE = 'boolean';
  private readonly CONTROL_TYPE_VALUES = [
    { value: 'NumberInput', display: 'type' },
    { value: 'NumberSelect', display: 'select' },
    { value: 'CheckBox', display: 'checkbox' },
  ];
  private readonly DEBOUNCE_TIME = 250;

  private VALID_CONTROL_TYPES: {[key: string]: string}[] = []


  private selectedQuestionID$: Observable<ID>;
  private form$: Observable<FormGroup>;
  private selectedKeyType$: Observable<QUESTION_KEY_TYPE>;
  private unusedKeys$: Observable<Key[]>;
  private optionForm: FormGroup;

  private controlType: ControlType = '';
  private options: number[] = [];

  private destroySubs$ = new Subject();

  constructor(private store: Store<fromRoot.State>, private fb: FormBuilder) { }

  ngOnInit() {

    // data sources
    this.selectedQuestionID$ = Observable.combineLatest(
      this.store.let(fromRoot.getSelectedConstantID),
      this.store.let(fromRoot.getSelectedConditionalID)
    )
      .map( ([constant, conditional]) => {
        if (constant === undefined) {
          return 'unselect all the questions';
        }

        if (conditional === undefined && constant !== undefined) {
          return constant;
        }

        if (conditional !== undefined && constant !== undefined) {
          return conditional;
        }

      })
      .filter(id => id !== undefined)
      .multicast( new ReplaySubject(1)).refCount()

    this.form$ = this.selectedQuestionID$
      .withLatestFrom(this.store.let(fromRoot.getForm))
      .map( ([questionID, form]) => form.get(questionID))
      .startWith(this.fb.group({
        label: [''], key: [''], controlType: [''], expandable: [false],  
      }))
      .multicast( new ReplaySubject(1)).refCount()

    this.unusedKeys$ = this.store.let(fromRoot.getForm)
      .map(form => form.value)
      .let(this.findUnusedKeys.bind(this))
      .startWith([])

    // local form(s)

    const digit_pattern = '^\\d+$'

    this.optionForm = this.fb.group({
      optionValue: ['', Validators.pattern(digit_pattern) ]
    });

    // effects 
    const key_change_effects = this.form$
      .filter( form => form !== null)
      .map( form => form.get(['key', 'name']))
      .filter( keyName => keyName !== null)
      .switchMap( keyName => keyName.valueChanges.startWith(keyName.value))
      .let(this.setKeyType.bind(this))
      .takeUntil(this.destroySubs$)
      .subscribe();
  }


  findUnusedKeys(input: Observable<{ [key: string]: Question }>): Observable<Key[]> {
    return input.map(changes => [Object.keys(changes), changes])
      .map(([keys, value]) => (<string[]>keys).map(key => value[key].key))
      .withLatestFrom(this.store.let(fromRoot.getScreenerKeys))
      .map(([questionKeyNames, allKeys]) => {
        return allKeys.filter(key => questionKeyNames.find(name => name === key.name) === undefined)
      })
  }

  addOption() {
    const optionValue = Number.parseInt(this.optionForm.get('optionValue').value, 10);
    this.options = [...this.options, optionValue];
    this.form$.take(1)
      .subscribe(group => {
        const optionControl = group.get('options');
        if (optionControl === null) group.addControl('options', new FormControl([]));
        
        group.get('options').setValue([...group.get('options').value, optionValue]);
        this.optionForm.get('optionValue').setValue('');
      })
  }

  setKeyType(key$: Observable<string>): Observable<string> {
    let capturedKey: string;
    return key$
      .do( keyUpdate => capturedKey = keyUpdate )
      .withLatestFrom(this.store.let(fromRoot.getScreenerKeys))
      .map( ([keyUpdate, allKeys]) => allKeys.find(k => k.name === keyUpdate))
      .filter(k => k !== undefined)
      .withLatestFrom(this.form$)
      .do( ([key, form]) =>  form.get(['key', 'type']).setValue(key.type))
      .map( _ => capturedKey);
  }

  optionFormEffects(optionFormInfo$: Observable<Array<ControlType | number[]>>): Observable<Array<ControlType | number[]>> {
    return optionFormInfo$
      .do( ([questionControlType, questionOptions]) => {
        const controlType = <ControlType>questionControlType;
        const options = <number[]>questionOptions;
        this.controlType = controlType;
        this.options = [...options];
      });
  }

  ngOnDestroy() {
    this.destroySubs$.next();
    //for (const sub of this.subscriptions) !sub.closed ? sub.unsubscribe() : undefined;
  }

}
