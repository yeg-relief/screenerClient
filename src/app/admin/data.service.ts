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
    this.keys$ = this.http.get('/protected/keys/')
      .map(res => res.json().keys)
      .catch(this.loadError);
  }

  // load every screener again naive, but it works at this point TODO: rewrite to improve scalability
  private loadAllScreeners() {
    this.screeners$ = this.http.get('/protected/master_screener/')
      .map(res => res.json().response)
      .catch(this.loadError);
  }

  // attn: this will perform an http call
  loadScreener(version: number): Observable<MasterScreener> {
    const initialScreener = {
      version: 0,
      questions: [],
      meta: {
        questions: {
          totalCount: 0,
        },
        screener: {
          version: 0,
          created: 0,
        }
      }
    }



    if (version === 0) {
      return Observable.of(initialScreener);
    }

    return this.screeners$
      .do(() => console.log(`loadScreener(${version}) called`))
      .switchMap(x => x)
      .filter((screener: MasterScreener) => screener.version === version)
      .catch(this.loadError)
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
    return this.http.get('/protected/master_screener/')
      .map(res => res.json().response)
      .map((screeners: MasterScreener[]) => {
        const sorted = screeners.sort((a, b) => a.meta.screener.version - b.meta.screener.version)
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
    return this.http.post('/protected/master_screener/', body, options)
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  loadPrograms(): Observable<ApplicationFacingProgram[]> {
    return this.http.get('/protected/programs/application/')
      .map(res => res.json().data)
      .catch(this.loadError)
  }

  updateProgram(program: ApplicationFacingProgram) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: program });
    console.log('UPDATE PROGRAM CALLED');
    console.log(body);
    return this.http.put('/protected/programs/', body, options)
      .do(res => console.log(res))
      .map(res => res.json().created)
      .catch(this.loadError)
      .toPromise();
  }

  createProgram(program: ApplicationFacingProgram) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: program });
    return this.http.post('/protected/programs/', body, options)
      .do(() => console.log(program))
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  deleteProgram(program: ApplicationFacingProgram) {
    return this.http.delete(`/protected/programs/${program.guid}`)
      .do(res => console.log(res))
      .map(res => res.json().removed)
      .catch(this.loadError)
      .toPromise()
  }

  // not implemented server side as of yet... not really implemented here either jajajaja
  updateKey(keys: Key[]) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ keys: keys });
    return this.http.post(`/protected/keys/`, body, options)
      .map(res => res.json().update)
      .catch(this.loadError)
  }

  deleteKey(key: Key) {
    return this.http.delete(`/protected/keys/${key.name}`)
      .do(res => console.log(res))
      .map(res => res.json().success)
      .catch(this.loadError)
      .toPromise()
  }
}