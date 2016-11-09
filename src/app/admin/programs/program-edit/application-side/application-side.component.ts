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
import { cloneDeep } from 'lodash';

interface State {
  queries: ProgramQuery[];
  editQuery: ProgramQuery;
};


@Component({
  selector: 'app-application-side',
  templateUrl: './application-side.component.html',
  styleUrls: ['./application-side.component.css']
})
export class ApplicationSideComponent implements OnInit, OnDestroy {
  // going to get rid of this
  @Output() saveCondition = new EventEmitter<ProgramCondition>();
  @Input() keys: Key[];
  @Input() program: ApplicationFacingProgram;
  guid: string;
  addQuery: boolean = false;
  state$: Observable<State>;
  editQuery$: Observable<ProgramQuery>;
  destroy$ = new Subject();

  constructor() { }

  ngOnInit() {
    this.state$ = this.dispatch$()
      .do(action => console.log(`action.type = ${action.type}, action.payload = ${action.payload}`))
      .let(reducer)
      .do(state => console.log(state))
      .takeUntil(this.destroy$)
      .multicast(new ReplaySubject(1)).refCount();

    this.editQuery$ = this.state$.map(state => state.editQuery).takeUntil(this.destroy$);
  }

  dispatch$() {
    const initState$ = Observable.of(cloneDeep(this.program))
      .map(program => {
        return {
          type: 'INIT_STATE',
          payload: {
            queries: <ProgramQuery[]>program.application,
            guid: program.guid
          }
        };
      });

    return Observable.merge(
      initState$
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
          queries: [...action.payload.queries],
          editQuery: {
            guid: action.payload.guid,
            id: 'new',
            conditions: []
          }
        });
      }
      default: {
        return state;
      }
    }
  }, {});
}
