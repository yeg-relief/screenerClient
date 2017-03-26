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

  private getCredentials(): RequestOptions{
    return this.authService.getCredentials();
  }

  getKeys() {
    const creds = this.getCredentials();
    return this.keys$ = this.http.get('/protected/key/', creds)
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
    const creds = this.getCredentials();
    return this.http.get('/protected/program/', creds)
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
          return pp;
        })
        return p;
      }, [])
      .catch(this.loadError)
  }

  updateProgram(program: ApplicationFacingProgram) {
    const creds = this.getCredentials();
    creds.headers.append('Content-Type', 'application/json' );
    const body = JSON.stringify({ data: program });
    return this.http.put('/protected/program/', body, creds)
      .map(res => res.json().created)
      .catch(this.loadError)
      .toPromise();
  }

  createProgram(program: ApplicationFacingProgram) {
    const creds = this.getCredentials();
    creds.headers.append('Content-Type', 'application/json' );
    const body = JSON.stringify({ data: program });
    return this.http.post('/protected/program/', body, creds)
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  deleteProgram(program: ApplicationFacingProgram) {
    const creds = this.getCredentials();
    return this.http.delete(`/protected/program/${program.guid}`, creds)
      .map(res => res.json())
      // object is an es response, the array is the remaining programs
      .map( (res: [boolean, object, Array<ApplicationFacingProgram>]) => res[2])
      .catch(this.loadError)
      .toPromise()
  }

  // updateKey is really more like createKey
  updateKey(key: Key) {
    const k = [key];
    const creds = this.getCredentials();
    creds.headers.append('Content-Type', 'application/json' );
    const body = JSON.stringify({ key: key });
    return this.http.post(`/protected/key/`, body, creds)
      .map(res => res.json().update)
      .catch(this.loadError)
  }
}