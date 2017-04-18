import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
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
    return this.http.get('/api/screener/')
            .map(res => res.json())
            .catch(e => this.handleError(e));
  }

  loadResults(form: Object) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: form});
    return this.http.post('/api/notification/', body, options)
            .map(res => res.json().response)
            .catch(this.loadError)
            .toPromise();
  }
  

  handleError(error: Response | any): Observable<any> {
    let errMsg: string;
    if (error instanceof Response) {
      let body;
      try {
        body = error.json();
      } catch (e) {
        body = ''
      }
      const err = body.message || JSON.stringify(body);
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw({ error : errMsg });
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
    console.log('IN LOAD ERROR');
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
