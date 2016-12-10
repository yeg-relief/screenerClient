import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/observable/throw';
import { Question, UserFacingProgram } from '../../shared';
import { Http, Response } from '@angular/http';

@Injectable()
export class MasterScreenerService {
  private readonly url: string = '/api/questions';
  constructor(private http: Http) { }

  loadQuestions(): Observable<Question[]> {
    return this.http.get(`${this.url}/latest`)
            .map(res => res.json().response)
            .multicast(new ReplaySubject(1)).refCount()
            .catch(this.loadError);
  }

/*
  fetchResults(responsePayload: string): boolean {
    //this.results = this.results.concat(this.mockResults);
    return true;
  }

  loadResults() {
    // return Observable.from(this.results).delay(400).toArray();
    //return Observable.from(this.mockResults).delay(400).toArray();
  }
*/  
  loadError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.message || JSON.stringify(body);
      errMsg = `${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
