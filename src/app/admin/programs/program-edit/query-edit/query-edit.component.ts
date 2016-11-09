import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Key } from '../../../models/key';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import { ProgramQuery, ProgramCondition } from '../../../models/program';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/withLatestFrom';

interface State {
  query: ProgramQuery;
  editCondition: ProgramCondition;
};

@Component({
  selector: 'app-query-edit',
  templateUrl: './query-edit.component.html',
  styleUrls: ['./query-edit.component.css']
})
export class QueryEditComponent implements OnInit, OnDestroy {
  @Input() query: ProgramQuery;
  destroy$ = new Subject();
  keys$: Observable<Key[]>;
  keySelect = new FormControl('select a key', Validators.pattern('^((?!(select a key)).)*$'));
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

  state$: Observable<State>;

  form: FormGroup;

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.form = new FormGroup({
      key: this.keySelect
    });

    this.keys$ = this.store.let(fromRoot.getPresentKeys).take(1)
      .multicast(new ReplaySubject(1)).refCount();

    this.state$ = this.dispatch$()
      .do(action => console.log(`action.type = ${action.type}, action.payload = ${action.payload}`))
      .let(reducer)
      .do(state => console.log(state))
      .takeUntil(this.destroy$)
      .multicast(new ReplaySubject(1)).refCount();

   this.state$.subscribe(state => console.log(state));
  }

  runEffects$(drivers) {
    const addNumberControl$ = drivers.key
      .filter(key => key.type === 'number')
      .filter(() => !this.form.contains('inputNumberValue'))
      .do(() => this.form.addControl('inputNumberValue', this.inputNumberValue))
      .do(() => this.qualifierInput.setValue(this.qualifierOptions[0].display));

    const removeNumberControl$ = drivers.key
      .filter(key => key.type === 'boolean')
      .filter(() => this.form.contains('inputNumberValue'))
      .do(() => this.form.removeControl('inputNumberValue'));

    Observable.merge(
      addNumberControl$,
      removeNumberControl$
    )
    .takeUntil(this.destroy$)
    .subscribe();
  }

  dispatch$() {
    const initState$ = Observable.of(cloneDeep(this.query))
      .map(query => {
        return {
          type: 'INIT_STATE',
          payload: query
        };
      });

    const keySelect$ = this.keySelect.valueChanges.withLatestFrom(this.keys$)
      .map(([newKeyName, keys]) => keys.find(applicationKey => newKeyName === applicationKey.name))
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

    this.runEffects$({
      key: keySelect$
    });

    return Observable.merge(
      initState$,
      keySelect$,
      qualifierInput$,
      booleanSelect$,
      numberInput$
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}

function reducer(actions: Observable<any>): Observable<State> {
  return actions.scan( (state, action) => {;
      switch (action.type) {
        case 'INIT_STATE': {
          return Object.assign({}, {
            query: {
              guid: action.payload.guid,
              id: action.payload.id,
              conditions: [...action.payload.conditions]
            },
            editCondition: {}
          });
        }
        case 'SELECT_KEY': {
          if (action.payload.type === 'number') {
            return Object.assign({}, state, {
              editCondition: {
                key: action.payload,
                value: 0,
                type: action.payload.type,
                qualifier: 'greaterThan'
              }
            });
          } else if (action.payload.type === 'boolean') {
            return Object.assign({}, state, {
              editCondition: {
                key: action.payload,
                value: true,
                type: action.payload.type,
              }
            });
          }
          return state;
        }
        case 'INPUT_QUALIFIER': {
          if (state.editCondition.type !== 'number') {
            return state;
          }
          const newCondition = Object.assign({}, state.editCondition, {
            qualifier: action.payload
          });
          return Object.assign({}, state, {
            editCondition: newCondition
          });
        }
        case 'BOOLEAN_SELECT': {
          if (state.editCondition.type !== 'boolean') {
            return state;
          }
          const newCondition = Object.assign({}, state.editCondition, {
            value: action.payload
          });
          return Object.assign({}, state, {
            editCondition: newCondition
          });
        }

        case 'NUMBER_INPUT': {
          if (state.editCondition.type !== 'number') {
            return state;
          }
          const newCondition = Object.assign({}, state.editCondition, {
            value: action.payload
          });
          return Object.assign({}, state, {
            editCondition: newCondition
          });
        }
        default: {
          return state;
        }
      }
  }, {});
}
