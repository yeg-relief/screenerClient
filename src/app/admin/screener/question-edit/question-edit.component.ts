import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ID, Key, Question, ControlType } from '../../models';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as actions from '../store/screener-actions';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/combineLatest';
type QUESTION_KEY_TYPE = 'integer' | 'boolean' | 'invalid' | 'broken' | '';




@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})
export class QuestionEditComponent implements OnInit, OnDestroy {
  readonly INVALID_TYPE: QUESTION_KEY_TYPE = 'invalid';
  readonly BROKEN_TYPE: QUESTION_KEY_TYPE = 'broken';
  readonly INTEGER_TYPE: QUESTION_KEY_TYPE = 'integer';
  readonly BOOLEAN_TYPE: QUESTION_KEY_TYPE = 'boolean';
  readonly CONTROL_TYPE_VALUES = [
    { value: 'NumberInput', display: 'type' },
    { value: 'NumberSelect', display: 'select' },
    { value: 'CheckBox', display: 'checkbox' },
  ];

  selectedQuestionID$: Observable<ID>;
  form$: Observable<FormGroup>;
  selectedKeyType$: Observable<QUESTION_KEY_TYPE>;
  unusedKeys: Key[] = [];
  optionForm: FormGroup;

  controlType: ControlType = '';
  options: number[] = [];

  destroySubs$ = new Subject();
  @Output() delete = new EventEmitter<ID>();
  @Output() makeExpandable = new EventEmitter<ID>();

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
      .filter( ([questionID, form]) => form.get(questionID) !== null)
      .map( ([questionID, form]) => form.get(questionID))
      .startWith(this.fb.group({
        label: [''], key: [''], controlType: [''], expandable: [false],  
      }))
      .multicast( new ReplaySubject(1)).refCount()
    
    this.store.let(fromRoot.getUnusedScreenerKeys)
        .takeUntil(this.destroySubs$)
        .subscribe( keys => this.unusedKeys = [...keys])
          

    // local form(s)

    const digit_pattern = '^\\d+$'

    this.optionForm = this.fb.group({
      optionValue: ['', Validators.compose([Validators.pattern(digit_pattern), Validators.required]) ]
    });

    // effects 
    const key_change_effects = this.form$
      .filter( form => form !== null)
      .map( form => form.get('key'))
      .filter( key => key !== null)
      .switchMap( key => key.valueChanges.startWith(key.value).pairwise() )
      .debounceTime(100)
      .takeUntil(this.destroySubs$)
      .withLatestFrom(this.form$)
      .subscribe( ([[prevKey, currKey], form]) => {
        const type = this.unusedKeys.find(k => k.name === currKey.name).type;
        form.get(['key', 'type']).setValue(type);
        if (prevKey.name.substr(0, 7) !== 'invalid'){
          this.unusedKeys = this.unusedKeys.filter(k => k.name !== currKey.name)
            .concat(prevKey)
            .sort( (a, b) => a.name.localeCompare(b.name));
        } else {
          this.unusedKeys = this.unusedKeys.filter(k => k.name !== currKey.name)
            .sort( (a, b) => a.name.localeCompare(b.name));
        }
        
      });

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

    const expandable_change_effect = this.form$ 
      .filter( form => form !== null)
      .switchMap( form => form.get('expandable').valueChanges )
      
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

  deleteQuestion() { this.selectedQuestionID$.take(1).subscribe(id => this.delete.emit(id)); }

  dispatchMakeExpandable() { this.makeExpandable.next(''); }

  ngOnDestroy() { this.destroySubs$.next(); }

  spliceOption(option){
    this.options = this.options.filter(opt => opt !== option);
  }

}
