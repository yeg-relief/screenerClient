import { Injectable } from '@angular/core';
import { ProgramQuery, ApplicationFacingProgram, ProgramCondition } from '../../../models/program';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/merge';

@Injectable()
export class QueryEditService {
  queries: ReplaySubject<ProgramQuery[]>;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.queries = new ReplaySubject();
  }

  watchUrlForState(): Observable<any> {
    return Observable.merge(
      this.route.queryParams.map(paramMap => paramMap.queryState).startWith(this.route.queryParamMap['queryState']),
      this.queries
    ).scan( (state, update) => {
      if (update instanceof Array)
        state.queries = [...update];
      else if (typeof update === 'string')
        state.mode = update;
      return state;
    }, { mode: '', queries: [] })
  }

  queryById(input$: Observable<string>): Observable<ProgramQuery> {
    return Observable.zip(
      input$,
      this.queries
    )
    .map( ([id, queries]) => queries.find(q => q.id === id))
    .filter(x => x !== undefined)
  }

  setById(input$: Observable<[string, ProgramQuery]>): Observable<ProgramQuery> {
    return Observable.zip(
      input$,
      this.queries
    ).map( ([ [id, update], queries ] ) => {
      let record = queries.find(q => q.id === id)
      if (record) {
        record = update;
      } else {
        queries = [...queries, update];
      }
      this.queries.next(queries)
      return record;
    })
  }

  getEditQuery(): Observable<ProgramQuery> {
    return this.watchUrlForState()
      .debounceTime(200)
      .filter(state => state.mode === 'edit')
      .map(state => state.queries.find(q => q.id === this.route.snapshot.queryParams['queryID']))
      .filter(x => x != null)
      .startWith({
        id: this.generateRandomString(),
        guid: 'fake',
        conditions: []
      })
  }

  getBlankQuery(guid: string): Observable<ProgramQuery> {
    return Observable.of(<ProgramQuery>{
      id: this.generateRandomString(),
      guid,
      conditions: []
    });
  }

  generateRandomString(): string {
    const LENGTH = 26;
    const lowerCaseCharSet = "abcdefghijklmnopqrstuvwxyz"
    const charSet = lowerCaseCharSet
      .concat(lowerCaseCharSet.toUpperCase())
      .concat("1234567890")

    const generateCharacters = () => {
      const arr = new Array(LENGTH);
      for(let i = 0; i < arr.length; i++){
        arr[i] = charSet[Math.floor(Math.random() * charSet.length)];
      }
      return arr;
    }
    
    return generateCharacters().join('');
  }

}
