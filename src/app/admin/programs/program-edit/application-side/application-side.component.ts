import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Key } from '../../../models/key';
import { ProgramCondition, ApplicationFacingProgram, ProgramQuery } from '../../../models/program';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/multicast';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash';


interface State {
  queries: ProgramQuery[];
  editQuery: ProgramQuery;
};

interface Action {
  type: string;
  payload: any;
}


@Component({
  selector: 'app-application-side',
  templateUrl: './application-side.component.html',
  styleUrls: ['./application-side.component.css']
})
export class ApplicationSideComponent implements OnInit, OnDestroy {

  @Output() saveQueries = new EventEmitter<ProgramQuery[]>();

  @Input() program: ApplicationFacingProgram;
  guid: string;
  addQuery: boolean = false;
  state$: Observable<State>;
  editQuery$: Observable<ProgramQuery>;
  saveQuery$ = new Subject<ProgramQuery>();
  cancel$ = new Subject<boolean>();
  edit$ = new Subject<ProgramQuery>();
  delete$ = new Subject<ProgramQuery>();
  destroy$ = new Subject();

  constructor() { }

  ngOnInit() {
    this.state$ = this.dispatch$()
      .let(reducer)
      .do(state => this.saveQueries.emit(state.queries))
      .takeUntil(this.destroy$)
      .multicast(new ReplaySubject(1)).refCount();

    this.editQuery$ = this.state$.map(state => state.editQuery)
      .takeUntil(this.destroy$)
      .multicast(new ReplaySubject(1)).refCount();
  }

  dispatch$() {
    const initState$ = Observable.of(_.cloneDeep(this.program))
      .map(program => {
        return {
          type: 'INIT_STATE',
          payload: {
            queries: <ProgramQuery[]>program.application,
            guid: program.guid
          }
        };
      });

    const onQuerySave$ = this.saveQuery$
      .filter(query => query.conditions !== undefined && query.id !== undefined)
      .filter(query => query.conditions.length > 0)
      .map(query => {
        return {
          type: 'SAVE_QUERY',
          payload: query
        };
      })
      .do(() => this.addQuery = false);

    const onEdit$ = this.edit$
      .map(query => {
        return {
          type: 'EDIT_QUERY',
          payload: query
        };
      })
      .do(() => this.addQuery = true);

    const onCancel$ = this.cancel$
      .map(() => {
        return {
          type: 'CANCEL_EDIT',
        };
      })
      .do(() => this.addQuery = false);

    const onDelete$ = this.delete$
      .map(query => {
        return {
          type: 'DELETE_QUERY',
          payload: query
        };
      });

    return Observable.merge(
      initState$,
      onQuerySave$,
      onEdit$,
      onCancel$,
      onDelete$
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}

function reducer(actions: Observable<any>): Observable<State> {
  return actions.scan( (state, action: Action) => {
    switch (action.type) {
      case 'INIT_STATE': {
        return Object.assign({}, {
          queries: [...action.payload.queries],
          editQuery: {
            guid: action.payload.guid,
            id: 'new',
            conditions: []
          }
        });
      }
      // can clean up some code here (return statements)
      case 'SAVE_QUERY': {
        const query = action.payload;
        // if it's new query then give temp id and make sure it doesn't have 
        // conditions duplicate to another query
        if (query.id === 'new') {
          query.id = `temp-${Math.random().toString(10)}`;
          return Object.assign({}, state, {
            queries: _.uniqWith([action.payload, ...state.queries], queryComparator),
            editQuery: {
              guid: state.editQuery.guid,
              id: 'new',
              conditions: []
            }
          });
        }
        // this is not a new query
        const index = state.queries.findIndex(programQuery => programQuery.id === query.id);
        if (index >= 0) {
          const queries = state.queries;
          queries.splice(index, 1, action.payload);
          return Object.assign({}, state, {
            queries: _.uniqWith([action.payload, ...state.queries], queryComparator),
            editQuery: {
              guid: state.editQuery.guid,
              id: 'new',
              conditions: []
            }
          });
        }
        return state;
      }
      case 'EDIT_QUERY': {
        return Object.assign({}, state, {
          editQuery: _.cloneDeep(action.payload)
        });
      }
      case 'CANCEL_EDIT': {
        return Object.assign({}, state, {
          editQuery: {
            guid: state.editQuery.guid,
            id: 'new',
            conditions: []
          }
        });
      }
      case 'DELETE_QUERY': {
        return Object.assign({}, state, {
          queries: state.queries.filter(programQuery => programQuery.id !== action.payload.id)
        });
      }
      default: {
        return state;
      }
    }
  }, {});
}

function queryComparator(q1, q2): boolean {
  return JSON.stringify(q1.conditions) === JSON.stringify(q2.conditions);
}
