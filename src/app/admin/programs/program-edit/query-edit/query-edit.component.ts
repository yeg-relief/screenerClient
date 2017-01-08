import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProgramQuery, ProgramCondition } from '../../../models/program';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMapTo';

interface State {
  query: ProgramQuery;
  selectedCondition: ProgramCondition;
}

interface Action {
  type: string;
  payload: any;
}


@Component({
  selector: 'app-query-edit',
  templateUrl: './query-edit.component.html',
  styleUrls: ['./query-edit.component.css']
})
export class QueryEditComponent implements OnInit, OnDestroy {
  @Input() query: Observable<ProgramQuery>;
  @Input() save: Subject<ProgramQuery>;
  @Input() cancel: Subject<boolean>;
  destroy$ = new Subject();
  delete$ = new Subject<ProgramCondition>();
  state$: Observable<State>;
  select$ = new Subject<ProgramCondition>();
  commitCondition = new Subject<ProgramCondition>();
  editCondition: Observable<ProgramCondition>;
  onSave$ = new Subject();
  saveEnabled = false;
  constructor() { }

  ngOnInit() {
    this.state$ = this.dispatch$()
      .do( (action: Action) => console.log(`action.type = ${action.type}, action.payload = ${action.payload}`))
      .let(reducer)
      .do(state => console.log(state))
      .do(state => {
        // gross code
        if (state.query.conditions !== undefined) {
          if (state.query.conditions.length > 0 ) {
            this.saveEnabled = true;
          } else {
            this.saveEnabled = false;
          }
        }
      })
      .takeUntil(this.destroy$)
      .multicast(new ReplaySubject(1)).refCount();

    this.editCondition = this.state$.map(state => state.selectedCondition)
      .takeUntil(this.destroy$)
      .multicast(new ReplaySubject(1)).refCount();
  }

  dispatch$() {
    const initState$ = this.query
      .map(query => {
        return {
          type: 'INIT_STATE',
          payload: query
        };
      });

    const committedCondition$ = this.commitCondition.asObservable()
      .map(condition => {
        return {
          type: 'COMMIT_CONDITION',
          payload: condition
        };
      });

    const selectCondition$ = this.select$.asObservable()
      .map(condition => {
        console.log('===========================')
        console.log(condition)
        console.log('============================')
        return {
          type: 'SELECT_CONDITION',
          payload: condition
        };
      });

    const deleteCondition$ = this.delete$.asObservable()
      .map(condition => {
        return {
          type: 'DELETE_CONDITION',
          payload: condition
        };
      });

   // effect refactor 
    const handleSave$ = this.onSave$.asObservable()
      .switchMap(_ => this.state$.map(state => state.query))
      .filter(query => query.conditions !== undefined)
      .filter(query => query.conditions.length > 0)
      .do(query => this.save.next(query))
      .takeUntil(this.destroy$)
      .subscribe();

    const handleCancel$ = this.cancel
      .map(() => {
        return {
          type: 'CANCEL_EDIT',
        };
      });

    return Observable.merge(
      initState$,
      committedCondition$,
      selectCondition$,
      deleteCondition$,
      handleCancel$
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}

function reducer(actions: Observable<any>): Observable<State> {
  return actions.scan( (state, action) => {
    switch (action.type) {
      case 'INIT_STATE': {
        return Object.assign({}, {
          query: action.payload,
          selectedCondition: {}
        });
      }
      case 'COMMIT_CONDITION': {
        const query = state.query;
        let conditionIndex = query.conditions.findIndex(queryCondition => action.payload.key.name === queryCondition.key.name);
        if (conditionIndex < 0) {
          query.conditions = [action.payload, ...state.query.conditions];
        } else {
          query.conditions.splice(conditionIndex, 1, cloneDeep(action.payload));
        }
        return Object.assign({}, state, {
          query: query,
        });
      }
      case 'SELECT_CONDITION': {
        return Object.assign({}, state, {
          selectedCondition: cloneDeep(action.payload)
        });
      }
      case 'DELETE_CONDITION': {
        const condIndex = state.query.conditions.findIndex(queryCondition => action.payload.key.name === queryCondition.key.name);
        if (condIndex >= 0) {
          state.query.conditions.splice(condIndex, 1);
        }
        if (state.selectedCondition.key !== undefined &&
            state.selectedCondition.key.name === action.payload.key.name) {
          state.selectedCondition = {};
        }
        return state;
      }
      case 'CANCEL_EDIT': {
        return Object.assign({}, {
          query: [],
          selectedCondition: {}
        });
      }
      default: {
        return state;
      }
    }
  }, {});
}

