import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ProgramCondition } from '../../../models/program';
import { conditionValidator } from './condition-edit.validator';
import { FormControl, Validators, FormGroup, FormBuilder, Validator } from '@angular/forms';
import { Key } from '../../../models/key';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/zip';
@Component({
  selector: 'app-condition-edit-v2',
  templateUrl: './condition-edit-v2.component.html',
  styleUrls: ['./condition-edit-v2.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionEditV2Component implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() condition: ProgramCondition;
  @Output() update = new EventEmitter<ProgramCondition>();
  keys: Observable<Key[]>;
  selectedKeyName: Observable<string>;
  selectedKey: Observable<Key>;
  subscription: Subscription;
  isBooleanKey;
  isNumberKey;
  keyTypes = {
    container: true,
    boolean: false,
    number: false,
    integer: false
  };
  readonly qualifiers = [
    {
      display: '>', value: 'greaterThan'
    },
    {
      display: '>=', value: 'greaterThanOrEqual'
    },
    {
      display: '=', value: 'equal'
    },
    {
      display: '<=', value: 'lessThanOrEqual'
    },
    {
      display: '<', value: 'lessThan'
    }
  ];


  constructor(private fb: FormBuilder, private store: Store<fromRoot.State>) { }

  ngOnInit() {

    this.keys = this.store.let(fromRoot.allLoadedKeys).multicast(new ReplaySubject(1)).refCount();

    this.selectedKeyName = this.form.valueChanges.debounceTime(100)
      .map(val => val.key.name)
      .filter(x => x)
      .startWith(this.condition.key.name)
      .multicast(new ReplaySubject(1)).refCount()

    this.selectedKey = Observable.combineLatest(
        this.keys,
        this.selectedKeyName
    )
      .throttleTime(60)
      .map( ([keys, name]) => keys.find(k => k.name === name))
      .filter(x => x !== undefined)
      .multicast(new ReplaySubject(1)).refCount()
      .startWith(this.condition.key);

    this.subscription = this.selectedKey
      .pairwise()
      .filter( ([a, b]) => a.type && b.type && a.type !== b.type)
      .map( ([_, update]) => update)
      .subscribe(newKey => {
        
      })


    this.isBooleanKey = this.selectedKey.map(key => key.type === 'boolean');
    this.isNumberKey = this.selectedKey.map(key => key.type === 'integer' || key.type === 'number');
    
  }

  ngOnDestroy(){
    if (this.subscription && !this.subscription.closed) this.subscription.unsubscribe();
  }
}
