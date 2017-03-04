import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ID, Key, Question, ControlType } from '../../models';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as actions from '../store/screener-actions';

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
  private readonly BOOLEAN_TYPE: QUESTION_KEY_TYPE = 'boolean';
  private readonly CONTROL_TYPES = [
    { value: 'NumberInput', display: 'type' },
    { value: 'NumberSelect', display: 'select' },
    { value: 'CheckBox', display: 'checkbox' },
  ];
  private readonly DEBOUNCE_TIME = 250;



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
    this.selectedQuestionID$ = Observable.merge(
      this.store.let(fromRoot.getSelectedConstantID),
      this.store.let(fromRoot.getSelectedConditionalID)
    )
      .filter(id => id !== undefined)
      .multicast( new ReplaySubject(1)).refCount()

    this.form$ = this.selectedQuestionID$
      .withLatestFrom(this.store.let(fromRoot.getForm))
      .map( ([questionID, form]) => form.get(questionID))
      .filter(questionGroup => questionGroup !== null)
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
    this.form$
      .switchMap( form => form.get('key').valueChanges.startWith(form.get('key').value))
      .let(this.keyChangeEffect.bind(this))
      .takeUntil(this.destroySubs$)
      .subscribe();
    
    this.form$
      .switchMap( form => {
        if (form.get('options') === null) form.addControl('options', new FormControl([]));

        return Observable.combineLatest(
          form.get('controlType').valueChanges.startWith(form.get('controlType').value),
          form.get('options').valueChanges.startWith(form.get('options').value)
        );
      })
      .let(this.optionFormEffects.bind(this))
      .takeUntil(this.destroySubs$)
      .subscribe();


    /*

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
    
    /*
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
    */
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

  // enables or disables the expandable checkbox 
  // depending on the on whether the selected qustion's key is 'interger' or 'boolean'
  keyChangeEffect(keyName$: Observable<string>): Observable<string> {
    return keyName$.withLatestFrom(this.store.let(fromRoot.getScreenerKeys))
      .map( ([updateKeyName, allKeys]) => {
        const key = allKeys.find(key => key.name === updateKeyName)
        return key !== undefined && key.type === this.BOOLEAN_TYPE ? 'enable' : 'disable';
      })
      .combineLatest(
        this.store.let(fromRoot.getForm),
        this.selectedQuestionID$
      )
      // carry the value, because enabling/disabling seems to remove value
      .map( ([command, form, selectedID]) => {
        const control = form.get([selectedID, 'expandable']);
        return [command, control, control.value]
      })
      .do( ([command, control, value]) => {
        const c = <FormControl>control;
        command === 'enable' ? c.enable() : c.disable();
      })
      .do(([command, control, value]) => (<FormControl>control).setValue(value))
      .map( ([command, _]) => command)
  }

  optionFormEffects(optionFormInfo$: Observable<Array<ControlType | number[]>>): Observable<any> {
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
