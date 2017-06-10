import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ProgramCondition } from '../../../models/program';
import { conditionValidator } from './condition-edit.validator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Key } from '../../../models/key';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/multicast';

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
  timeout;
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


  constructor(
    private store: Store<fromRoot.State>
    ) { }

  ngOnInit() {

    this.keys = this.store.let(fromRoot.allLoadedKeys)
                    .withLatestFrom(this.form.valueChanges.map(f => f.key).startWith(this.form.value))
                    .map( ([keys, selected]) => keys.filter(k => k.name !== selected.name))
                    .multicast(new ReplaySubject(1)).refCount();

    this.isBooleanKey = this.form.valueChanges
      .map(f => f.key.type === 'boolean')
      .startWith(this.form.value.key.type === 'boolean');
    
    this.isNumberKey = this.form.valueChanges
      .map(f => f.key.type === 'integer' || f.key.type === 'number')
      .startWith(this.form.value.key.type === 'integer' || this.form.value.key.type === 'number');;
    

    this.subscription = this.form.valueChanges
      .debounceTime(500)
      .subscribe(update => this.update.emit(update));
  }

  ngOnDestroy(){
    if (this.subscription && !this.subscription.closed) this.subscription.unsubscribe();
  }

  changeKey($event) {
    const newKey: Key = JSON.parse($event.target.value);

    if (newKey.type === 'boolean') {
      this.handleBooleanChange(newKey);
      
    } else if (newKey.type === 'integer' || newKey.type === 'number') {
      this.handleNumberChange(newKey);
    }
  }

  stringifyKey(key) {
    return typeof key === 'object' ? JSON.stringify(key) : null;
  }

  handleBooleanChange(key: Key) {
    if (this.form.get('qualifier') !== null) 
      this.form.removeControl('qualifier')
    
    this.form.setValue({
      key: key,
      value: true,
      type: 'boolean'
    });

    this.form.get('value').setValidators([Validators.required])
  }

  handleNumberChange(key: Key) {
    if (this.form.get('qualifier') === null) 
      this.form.addControl('qualifier', new FormControl(this.qualifiers[2].value))
    
    this.form.setValue({
      key: key,
      value: 0,
      qualifier: this.qualifiers[2].value,
      type: 'number'
    });

    this.form.get('value').setValidators([Validators.required, Validators.pattern('^\\d+$')])

  }
}
