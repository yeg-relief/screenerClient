import { Injectable } from '@angular/core';
import { MasterScreener } from './models/master-screener';
import { ApplicationFacingProgram } from './models/program';
import { Key } from './models/key';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './core/services/auth.service'
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

  loadPrograms(): Observable<ApplicationFacingProgram[]> {
    const options = new RequestOptions({headers: this.getCredentials()})
    return this.http.get('/protected/program/', options)
      .map( res => res.json())
      .reduce( (accum, obj) => {
        const programs = obj.programs;
        const queries = obj.queries;
        const p: ApplicationFacingProgram[] = programs.map( program => {
          const pp: ApplicationFacingProgram = (<any>Object).assign({}, {
            guid: program.guid,
            application: queries.filter(query => query.guid === program.guid),
            user: program
          })
          console.log(pp);
          return pp;
        })
        return p;
      }, [])
      .do(_ => console.error(_))
      .catch(this.loadError)
  }

  updateProgram(program: ApplicationFacingProgram) {
    const headers = this.getCredentials()
    headers.append('Content-Type', 'application/json' );
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: program });
    return this.http.put('/protected/program/', body, options)
      .map(res => res.json().created)
      .catch(this.loadError)
      .toPromise();
  }

  createProgram(program: ApplicationFacingProgram) {
    const headers = this.getCredentials()
    headers.append('Content-Type', 'application/json' );
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: program });
    return this.http.post('/protected/program/', body, options)
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  deleteProgram(program: ApplicationFacingProgram) {
    const options = new RequestOptions({headers: this.getCredentials()})
    return this.http.delete(`/protected/program/${program.guid}`, options)
      .map(res => res.json())
      .catch(this.loadError)
      .toPromise()
  }

  // updateKey is really more like createKey
  updateKey(key: Key) {
    const k = [key];
    const headers = this.getCredentials()
    headers.append('Content-Type', 'application/json' );
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ key: key });
    return this.http.post(`/protected/key/`, body, options)
      .map(res => res.json().update)
      .catch(this.loadError)
  }
}