import { Injectable } from '@angular/core';
import { MasterScreener } from './models/master-screener';
import { ApplicationFacingProgram } from './models/program';
import { Key } from './models/key';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './core/services/auth.service'
import { cloneDeep } from 'lodash';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/multicast';

@Injectable()
export class DataService {
  private screeners$: Observable<MasterScreener[]>;
  private keys$: Observable<Key[]>;

  private cachedScreeners: MasterScreener[] = [];

  constructor(private http: Http, private authService: AuthService) {}

  private getCredentials(): Headers{
    if (this.authService.credentials === undefined) {
      throw new Error('undefined credentials in data service');
    }
    const headers = new Headers();
    headers.append("Authorization", "Basic " + this.authService.credentials);
    return headers;
  }

  getKeys() {
    const options = new RequestOptions({headers: this.getCredentials()})
    return this.keys$ = this.http.get('/protected/key/', options)
      .map(res => res.json().keys)
      .catch(this.loadError);
  }

  // load every screener again naive, but it works at this point TODO: rewrite to improve scalability
  loadAllScreeners() {
    const options = new RequestOptions({headers: this.getCredentials()})
    if (this.screeners$ === undefined) {
      this.screeners$ = this.http.get('/protected/master_screener/', options)
      .map(res => res.json().response)
      .catch(this.loadError);
    }
    return this.screeners$;
  }


  loadError(error: Response | any) {
    console.error(error);
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
    //this.loadAllScreeners();
    const options = new RequestOptions({headers: this.getCredentials()})
    return this.http.get('/protected/master_screener/', options)
      .map(res => res.json().response)
      .map((screeners: MasterScreener[]) => {
        const sorted = screeners.sort((a, b) => a.meta.screener.version - b.meta.screener.version)
        return sorted[sorted.length - 1]
      });
  }

  // attn: this will perform an http call
  loadVersionMetaData(): Observable<number[]> {
    if(this.screeners$ === undefined) {
      this.loadAllScreeners();
    }

    return this.screeners$
      .switchMap(x => x)
      .reduce((accum: number[], screener: MasterScreener) => accum.concat(screener.version), []);
  }

  saveScreener(screener: MasterScreener) {
    const headers = this.getCredentials()
    headers.append('Content-Type', 'application/json' );
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: screener });
    return this.http.post('/protected/master_screener/', body, options)
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  loadPrograms(): Observable<ApplicationFacingProgram[]> {
    const options = new RequestOptions({headers: this.getCredentials()})
    return this.http.get('/protected/programs/application/', options)
      .map(res => res.json().data)
      .catch(this.loadError)
  }

  updateProgram(program: ApplicationFacingProgram) {
    const headers = this.getCredentials()
    headers.append('Content-Type', 'application/json' );
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: program });
    return this.http.put('/protected/programs/', body, options)
      .map(res => res.json().created)
      .catch(this.loadError)
      .toPromise();
  }

  createProgram(program: ApplicationFacingProgram) {
    const headers = this.getCredentials()
    headers.append('Content-Type', 'application/json' );
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: program });
    return this.http.post('/protected/programs/', body, options)
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  deleteProgram(program: ApplicationFacingProgram) {
    const options = new RequestOptions({headers: this.getCredentials()})
    return this.http.delete(`/protected/programs/${program.guid}`, options)
      .map(res => res.json().removed)
      .catch(this.loadError)
      .toPromise()
  }

  // updateKey is really more like createKey
  updateKey(key: Key) {
    const headers = this.getCredentials()
    headers.append('Content-Type', 'application/json' );
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ key: key });
    return this.http.post(`/protected/key/`, body, options)
      .map(res => res.json().update)
      .catch(this.loadError)
  }
}