import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { fakeData } from './fake-data';
import { fakeResults } from './fake-results';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/toArray';


// new imports
import { Question } from '../../models';


@Injectable()
export class DataService {
  private masterScreenerUrl: string = 'api/masterscreener/';
  
  // eventually we'll need to use http service could remove, but i'll just keep it for later
  constructor(private http: Http){}
  
  private _pullData(): Observable<any>{
    return Observable.from(fakeData());
  }
   
  getQuestions(): Observable<Question[]>{
    return this._pullData().toArray();
  }
  
  getResults(): Observable<any[]>{
    return Observable.from(fakeResults()).toArray();
  }
}


