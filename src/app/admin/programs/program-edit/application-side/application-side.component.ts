import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Key } from '../../../models/key';
import { ProgramCondition } from '../../../models/program';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-application-side',
  templateUrl: './application-side.component.html',
  styleUrls: ['./application-side.component.css']
})
export class ApplicationSideComponent implements OnInit, OnDestroy {
  @Output() saveCondition = new EventEmitter<ProgramCondition>();
  @Input() keys: Key[];
  destroy$ = new Subject<boolean>();
  condition$: Observable<ProgramCondition>;
  key$: Observable<Key>;
  // valid when 'select a key' is not the value
  keyControl = new FormControl('select a key', Validators.pattern('^((?!(select a key)).)*$'));
  numberOptions = [
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
  numberControl = new FormControl(this.numberOptions[0].value);
  booleanOptions = [
    {
      display: 'true', value: true
    },
    {
      display: 'false', value: false
    }
  ];
  boolControl = new FormControl(this.booleanOptions[0].value);

  inputControl = new FormControl(0, Validators.pattern('^\\d+$'));
  form = new FormGroup({
    input: this.inputControl,
    key: this.keyControl,
  });
  condition: ProgramCondition;

  constructor() { }

  ngOnInit() {
    this.condition$ = this.blankCondition();
    const subject$ = new Subject();
    this.key$ = this.keyControl.valueChanges
      .map(keyDisplay => this.keys.find(inputKey => keyDisplay === inputKey.name))
      .filter(key => key !== undefined)
      .do(() => this.inputControl.reset('0'))
      .multicast(subject$).refCount();

    Observable.combineLatest(
      this.condition$,
      this.key$.startWith({
        name: 'empty',
        type: 'empty'
      }),
      this.numberControl.valueChanges.startWith(this.numberOptions[0].value),
      this.boolControl.valueChanges.startWith(this.booleanOptions[0].value),
      this.inputControl.valueChanges.startWith('0'),
    )
    .map(([condition, key, qualifier, bool, value]) => {
       condition.key = key;
       if (condition.key.type === 'boolean') {
         condition.value = bool;
         condition.type = 'boolean';
         delete condition.qualifier;
       } else if (condition.key.type === 'number') {
         condition.qualifier = qualifier;
         condition.value = Number.parseInt(value, 10);
         condition.type = 'number';
       }
       return condition;
    })
    .takeUntil(this.destroy$)
    .subscribe((cond) => this.condition = cloneDeep(cond));

  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  blankCondition(): Observable<ProgramCondition> {
    const key: Key = {
      name: 'empty',
      type: 'empty'
    };
    return Observable.of({
      guid: 'empty',
      key: key,
      value: undefined,
      type: undefined,
      qualifier: undefined
    });
  }
}
