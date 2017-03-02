import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
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

interface Action {
  type: string;
  payload: any;
}


@Component({
  selector: 'app-condition-edit',
  templateUrl: './condition-edit.component.html',
  styleUrls: ['./condition-edit.component.css']
})
export class ConditionEditComponent implements OnInit, OnDestroy {
  @Input() condition: Observable<ProgramCondition>;
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
  qualifierInput = new FormControl(this.qualifierOptions[0].value);

  booleanValueOptions = [true, false];
  booleanValueSelect = new FormControl(this.booleanValueOptions[0]);
  inputNumberValue = new FormControl(0, Validators.pattern('^\\d+$'));

  state$: Observable<ProgramCondition>;

  form: FormGroup;

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.form = new FormGroup({
      key: this.keySelect
    });

    this.keys$ = this.store.let(fromRoot.allLoadedKeys).take(1)
      .do(keys => console.log(keys))
      .map(keys => {
        const sentKey = {
          name: 'select a key',
          type: undefined
        };
        return [sentKey, ...keys];
      })
      .multicast(new ReplaySubject(1)).refCount();

    this.state$ = this.dispatch$()
      .let(this.reducer.bind(this))
      .do(_ => console.log(_))
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
      .filter(action => action.payload.type === 'integer' )
      .filter(() => !this.form.contains('inputNumberValue'))
      .do(() => this.form.addControl('inputNumberValue', this.inputNumberValue))
      .do(() => this.qualifierInput.setValue(this.qualifierOptions[0].value))
      .do(() => this.inputNumberValue.setValue(0));

    // numberKey -> numberKey
    const changeNumberKey$ = drivers.key
      .filter(action => action.payload !== undefined)
      .filter(action => action.payload.type === 'integer')
      .filter(() => this.form.contains('inputNumberValue'))
      .do(() => this.inputNumberValue.setValue(0))
      // this is not working... use html encoding or whatever it's called? &<number>;
      .do(() => this.qualifierInput.setValue(this.qualifierOptions[0].value));

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
      .do(() => this.booleanValueSelect.setValue(this.booleanValueOptions[0]));

    const updateKeyDisplayOnChange$ = drivers.inputChange
      .filter((action) => action.payload.key !== undefined)
      .do((action) => this.keySelect.setValue(action.payload.key.name));

    // query editor has cleared a selected key
    const clearKeyDisplay$ = drivers.inputChange
      .filter(action => action.payload.key === undefined)
      .do((_) => this.keySelect.setValue('select a key'));

    Observable.merge(
      addNumberControl$,
      removeNumberControl$,
      changeNumberKey$,
      changeBooleanControl$,
      updateKeyDisplayOnChange$,
      clearKeyDisplay$
    )
      .takeUntil(this.destroy$)
      .subscribe();
  }

  dispatch$() {
    const initState$ = this.condition
      .map(condition => {
        return {
          type: 'INIT_STATE',
          payload: condition
        };
      }).multicast(new ReplaySubject(1)).refCount();

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
      })
     // .do(_ => console.log(_))

    const booleanSelect$ = this.booleanValueSelect.valueChanges
      .map(boolValue => {
        if (typeof boolValue === 'string' && boolValue === 'false') {
          boolValue = false;
        }
        
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
      })
      //.do(_ => console.log(_))

    const clear$ = this.clear$.asObservable()
      .map(() => {
        return {
          type: 'RESET_STATE'
        };
      });

    this.runEffects$({
      inputChange: initState$,
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

  reducer(actions: Observable<any>): Observable<ProgramCondition> {
    return actions.scan((state, action) => {
      switch (action.type) {
        case 'INIT_STATE': {
          const condition = _.cloneDeep(action.payload);
          if (Object.keys(condition).length === 0 && condition.constructor === Object) {
            return Object.assign({}, state, condition);
          }
          this.setForm(condition);
          return Object.assign({}, state, condition);

        }
        case 'SELECT_KEY': {
          if (action.payload.type === 'integer') {
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
          if (state.type !== 'integer') {
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
          if (state.type !== 'integer') {
            console.log("RETURN STATE")
            return state;
          }
          console.log(`value: ${parseInt(action.payload, 10)}`)
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

  setForm(condition: ProgramCondition) {
    if(condition.key.type === 'integer'){
      this.inputNumberValue.setValue(condition.value);
      const qualifierIndex = this.qualifierOptions.findIndex(qualifier => qualifier.value === condition.qualifier);
      this.qualifierInput.setValue(this.qualifierOptions[qualifierIndex].value);
    } else if (condition.key.type === 'boolean') {
      const booleanIndex = this.booleanValueOptions.findIndex(qualifier => qualifier === condition.value);
      this.booleanValueSelect.setValue(this.booleanValueOptions[booleanIndex]);
    }
  }
}