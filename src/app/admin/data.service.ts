import { Injectable } from '@angular/core';
import { MasterScreener } from './models/master-screener';
import { ApplicationFacingProgram } from './models/program';
import { Key } from './models/key';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/reduce';

@Injectable()
export class DataService {
  private screeners$: Observable<MasterScreener[]>;
  private keys$: Observable<Key[]>;

  constructor(private http: Http) {
    this.loadAllScreeners();
    this.loadKeys();
  }

  private loadKeys() {
    this.keys$ = this.http.get('/api/keys/')
      .map(res => res.json().keys)
      /*
      .do( () => console.log('IN DATA SERVICE KEYS'))
      .do(keys => console.log(keys))
      .do( () => console.log('================'))
      .multicast(new ReplaySubject(1)).refCount()
      */
      .catch(this.loadError);
  }

  // load every screener again naive, but it works at this point TODO: rewrite to improve scalability
  private loadAllScreeners() {
    this.screeners$ = this.http.get('/api/master_screener/')
      .map(res => res.json().response)
      //.multicast(new ReplaySubject(1)).refCount()
      .catch(this.loadError);
  }

  // attn: this will perform an http call
  loadScreener(version: number): Observable<MasterScreener> {
    return this.screeners$
      .do(() => console.log(`loadScreener(${version}) called`))
      .switchMap(x => x)
      .filter((screener: MasterScreener) => screener.version === version)
  }


  loadError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.message || JSON.stringify(body);
      errMsg = err;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  // attn: this will perform an http call
  loadLatestScreener(): Observable<MasterScreener> {
    console.log('LOAD LATEST SCREENER CALLED')
    this.loadAllScreeners();
    return this.http.get('/api/master_screener/')
      .map(res => res.json().response)
      .map((screeners: MasterScreener[]) => {
        console.log(screeners);
        const sorted = screeners.sort((a, b) => a.version - b.version)
        return sorted[sorted.length - 1]
      });
  }

  // attn: this will perform an http call
  loadVersionMetaData(): Observable<number[]> {
    return this.screeners$
      .switchMap(x => x)
      .reduce((accum: number[], screener: MasterScreener) => accum.concat(screener.version), []);
  }

  // attn: this will perform an http call
  getKeys(): Observable<Key[]> {
    return this.keys$;
  }

  saveScreener(screener: MasterScreener) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: screener });
    return this.http.post('/api/master_screener/', body, options)
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  loadPrograms(): Observable<ApplicationFacingProgram[]> {
    return this.http.get('/api/programs/')
      .map(res => res.json().programs)
      .reduce((accum, program) => accum.concat(program.application), [])
      .catch(this.loadError)
  }

  updateProgram(program: ApplicationFacingProgram) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: program });
    return this.http.post('/api/programs/', body, options)
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  createProgram(program: ApplicationFacingProgram) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: program });
    return this.http.post('/api/programs/', body, options)
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  deleteProgram(program: ApplicationFacingProgram) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(`/api/programs/${program.guid}`, options)
      .map(res => res.json().removed)
      .catch(this.loadError)
      .toPromise()
  }

  // not implemented server side as of yet... not really implemented here either jajajaja
  updateKey(key: Key) {
    return this.keys$;
  }

  // not implemented server side as of yet... not really implemented here either jajajaja
  delete(key: Key) {
    return this.keys$;
  }
}