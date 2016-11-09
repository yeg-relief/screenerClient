import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Key } from '../../../models/key';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import { ProgramCondition } from '../../../models/program';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/let';

@Component({
  selector: 'app-condition-edit',
  templateUrl: './condition-edit.component.html',
  styleUrls: ['./condition-edit.component.css']
})
export class ConditionEditComponent implements OnInit, OnDestroy {
  @Input() condition: ProgramCondition;
  @Output() cancel = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<ProgramCondition>();
  save$ = new Subject();
  destroy$ = new Subject();
  keys$: Observable<Key[]>;
  keySelect = new FormControl('select a key', Validators.pattern('^((?!(select a key)).)*$'));
  clear$ = new Subject();
  qualifierOptions = [
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
  qualifierInput = new FormControl(this.qualifierOptions[0].display);

  booleanValueOptions = [
    {
      display: 'true', value: true
    },
    {
      display: 'false', value: false
    }
  ];
  booleanValueSelect = new FormControl(this.booleanValueOptions[0].display);
  inputNumberValue = new FormControl(0, Validators.pattern('^\\d+$'));

  state$: Observable<ProgramCondition>;

  form: FormGroup;

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.form = new FormGroup({
      key: this.keySelect
    });

    this.keys$ = this.store.let(fromRoot.getPresentKeys).take(1)
      .map(keys => {
        const sentKey = {
          name: 'select a key',
          type: undefined
        };
        return [sentKey, ...keys];
      })
      .multicast(new ReplaySubject(1)).refCount();

    this.state$ = this.dispatch$()
      .do(action => console.log(`action.type = ${action.type}, action.payload = ${action.payload}`))
      .let(reducer)
      .do(state => console.log(state))
      .takeUntil(this.destroy$)
      .multicast(new ReplaySubject(1)).refCount();

    this.save$.withLatestFrom(this.state$)
      .map(([_, state]) => state)
      .filter(state => state.key !== undefined)
      .do(state => this.save.emit(state))
      .takeUntil(this.destroy$)
      .do(() => this.clear$.next())
      .do(() => this.keySelect.setValue('select a key'))
      .subscribe();
  }

  runEffects$(drivers) {
    // booleanKey -> numberKey
    const addNumberControl$ = drivers.key
      .filter(action => action.payload !== undefined)
      .filter(action => action.payload.type === 'number')
      .filter(() => !this.form.contains('inputNumberValue'))
      .do(() => this.form.addControl('inputNumberValue', this.inputNumberValue))
      .do(() => this.qualifierInput.setValue(this.qualifierOptions[0].display))
      .do(() => this.inputNumberValue.setValue(0));

    // numberKey -> numberKey
    const changeNumberKey$ = drivers.key
      .filter(action => action.payload !== undefined)
      .filter(action => action.payload.type === 'number')
      .filter(() => this.form.contains('inputNumberValue'))
      .do(() => this.inputNumberValue.setValue(0))
      // this is not working... use html encoding or whatever it's called? &<number>;
      .do(() => this.qualifierInput.setValue('>'));

    // numberKey -> booleanKey
    const removeNumberControl$ = drivers.key
      .filter(action => action.payload !== undefined)
      .filter(action => action.payload.type === 'boolean')
      .filter(() => this.form.contains('inputNumberValue'))
      .do(() => this.form.removeControl('inputNumberValue'));

    // booleanKey -> booleanKey
    const changeBooleanControl$ = drivers.key
      .filter(action => action.payload !== undefined)
      .filter(action => action.payload.type === 'boolean')
      .filter(() => !this.form.contains('inputNumberValue'))
      .do(() => this.booleanValueSelect.setValue(this.booleanValueOptions[0].display));


    Observable.merge(
      addNumberControl$,
      removeNumberControl$,
      changeNumberKey$,
      changeBooleanControl$,
    )
    .takeUntil(this.destroy$)
    .subscribe();
  }

  dispatch$() {
    const initState$ = Observable.of(cloneDeep(this.condition))
      .map(condition => {
        return {
          type: 'INIT_STATE',
          payload: condition
        };
      });

    const keySelect$ = this.keySelect.valueChanges.withLatestFrom(this.keys$)
      .map(([newKeyName, keys]) => keys.find(applicationKey => newKeyName === applicationKey.name))
      .filter(key => key !== undefined && key.name !== undefined && key.type !== undefined)
      .map(key => {
        return {
          type: 'SELECT_KEY',
          payload: key
        };
      }).multicast(new ReplaySubject(1)).refCount();

   const qualifierInput$ = this.qualifierInput.valueChanges
    .map(qualifier => {
      return {
        type: 'INPUT_QUALIFIER',
        payload: qualifier
      };
    });

    const booleanSelect$ = this.booleanValueSelect.valueChanges
      .map(boolValue => {
        return {
          type: 'BOOLEAN_SELECT',
          payload: boolValue
        };
      });

    const numberInput$ = this.inputNumberValue.valueChanges
      .map(val => {
        return {
          type: 'NUMBER_INPUT',
          payload: Number.parseInt(val, 10)
        };
      });

    const clear$ = this.clear$.asObservable()
      .map( () => {
        return {
          type: 'RESET_STATE'
        };
      });

    this.runEffects$({
      key: keySelect$
    });

    return Observable.merge(
      initState$,
      keySelect$,
      qualifierInput$,
      booleanSelect$,
      numberInput$,
      clear$
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}

function reducer(actions: Observable<any>): Observable<ProgramCondition> {
  return actions.scan( (state, action) => {
      switch (action.type) {
        case 'INIT_STATE': {
          return cloneDeep(action.payload);
        }
        case 'SELECT_KEY': {
          if (action.payload.type === 'number') {
            return Object.assign({}, {
              key: action.payload,
              value: 0,
              type: action.payload.type,
              qualifier: 'greaterThan'
            });
          } else if (action.payload.type === 'boolean') {
            return Object.assign({}, {
              key: action.payload,
              value: true,
              type: action.payload.type,
            });
          }
          return state;
        }
        case 'INPUT_QUALIFIER': {
          if (state.type !== 'number') {
            return state;
          }
          return Object.assign({}, state, {
            qualifier: action.payload
          });
        }
        case 'BOOLEAN_SELECT': {
          if (state.type !== 'boolean') {
            return state;
          }
          return Object.assign({}, state, {
            value: action.payload
          });
        }

        case 'NUMBER_INPUT': {
          if (state.type !== 'number') {
            return state;
          }
          return Object.assign({}, state, {
            value: parseInt(action.payload, 10)
          });
        }

        case 'RESET_STATE': {
          return Object.assign({}, {
            key: undefined,
            value: undefined,
            type: undefined,
          });
        }
        default: {
          return state;
        }
      }
  }, {});
}
