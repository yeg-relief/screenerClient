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


interface State {
  query: ProgramQuery;
  selectedCondition: ProgramCondition;
}

@Component({
  selector: 'app-query-edit',
  templateUrl: './query-edit.component.html',
  styleUrls: ['./query-edit.component.css']
})
export class QueryEditComponent implements OnInit, OnDestroy {
  @Input() query: ProgramQuery;
  destroy$ = new Subject();
  state$: Observable<State>;
  commitCondition = new Subject<ProgramCondition>();
  constructor() { }

  ngOnInit() {
    this.state$ = this.dispatch$()
      .do(action => console.log(`action.type = ${action.type}, action.payload = ${action.payload}`))
      .let(reducer)
      .do(state => console.log(state))
      .takeUntil(this.destroy$)
      .multicast(new ReplaySubject(1)).refCount();
  }

  dispatch$() {
    const initState$ = Observable.of(cloneDeep(this.query))
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

    return Observable.merge(
      initState$,
      committedCondition$
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
        query.conditions = [action.payload, ...state.query.conditions];
        return Object.assign({}, state, {
          query: query
        });
      }
      default: {
        return state;
      }
    }
  }, {});
}
