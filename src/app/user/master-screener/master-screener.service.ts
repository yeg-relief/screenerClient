import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import { Question, UserFacingProgram } from '../../shared';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup } from '@angular/forms';


@Injectable()
export class MasterScreenerService {
  // results are set in QuestionsComponent.onSubmit()
  // poor design?
  results = [];
  constructor(private http: Http) { }

  loadQuestions(): Observable<Question[]> {
    return this.http.get('/api/questions/latest')
            .map(res => res.json().response)
            .catch(this.loadError);
  }

  loadResults(form: Object) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: form});
    return this.http.post('/api/user_master_screener/', body, options)
            .map(res => res.json().response)
            .catch(this.loadError)
            .toPromise();
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
}
