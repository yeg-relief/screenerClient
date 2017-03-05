import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ID, Key, Question, ControlType } from '../../models';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as actions from '../store/screener-actions';
import 'rxjs/add/operator/pairwise';
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

    const unusedKeys = this.store.let(fromRoot.getForm)
      .map(form => form.value)
      .let(this.findUnusedKeys.bind(this))
      .startWith([]);

    this.unusedKeys$ = this.form$
      .filter( form => form !== null)
      .filter(form => form.get('key') !== null)
      .switchMap( form => form.get('key').valueChanges )
      .withLatestFrom(unusedKeys)
      .map( ([releasedKey, keys]) => (<Key[]>keys).filter(key => key.name !== releasedKey.name) )
      .startWith(this.seedUnusedKeys())
      .multicast( new ReplaySubject(1)).refCount()

    // local form(s)

    const digit_pattern = '^\\d+$'

    this.optionForm = this.fb.group({
      optionValue: ['', Validators.compose([Validators.pattern(digit_pattern), Validators.required]) ]
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

    const control_type_change_effects = this.form$
      .filter(form => form !== null)
      .switchMap( form => form.get('controlType').valueChanges )
      .let(this.updateInternalControlType.bind(this))
      .withLatestFrom(this.form$)
      .let(this.updateOptions.bind(this))
      .takeUntil(this.destroySubs$)
      .subscribe();

    const question_change_effect = this.form$
      .filter( form => form !== null)
      .map( form => form.get('controlType').value)
      .let(this.updateInternalControlType.bind(this))
      .withLatestFrom(this.form$)
      .let(this.updateOptions.bind(this))
      .subscribe();
  }

  seedUnusedKeys() {
    let unusedKeys: Key[] = [];
    this.store.let(fromRoot.getForm)
      .map(form => form.value)
      .let(this.findUnusedKeys.bind(this))
      .startWith([])
      .takeUntil(this.destroySubs$)
      .subscribe( (keys: Key[]) => unusedKeys = [...keys])
    
    return unusedKeys;
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

  updateInternalControlType(controlType$: Observable<ControlType>): Observable<ControlType> {
    return controlType$.do( controlUpdate => this.controlType = controlUpdate)
      .do( _ => { 
          if(this.controlType !== 'NumberSelect'){
            this.options = [];
            this.optionForm.get('optionValue').setValue('');
          }  
      })
  }

  updateOptions(input$: Observable<Array<ControlType | FormGroup>>): Observable<Array<ControlType | FormGroup>> {
    
    return input$.do( ([controlType, form]) => {
      const f = <FormGroup>form;
      const ct = <ControlType>controlType;
      
      if (f.get('options') === null) f.addControl('options', new FormControl([]));

      if (ct === 'NumberSelect') {
        this.options = f.get('options').value;
      } 
    })
  }

  ngOnDestroy() { this.destroySubs$.next(); }

}
