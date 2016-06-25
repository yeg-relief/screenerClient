import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { fakeData } from './fake-data';
import { MasterScreener, GeneralQuestionGroup, ControlMap } from '../question/types';
import { controlReducer, assign } from '../question/functions';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/reduce';

@Injectable()
export class DataService {
  private masterScreenerUrl: string = 'api/masterscreener/';
  
  constructor(private http: Http){}
  
  private _pullData(): Observable<any>{
    return Observable.from(fakeData());
  }
  
  getMasterScreener(): Observable<any>{
    const masterScreener: any = {
      controls: {},
      questionGroups: new Array<GeneralQuestionGroup>()
    }
    return this._pullData()
           .reduce( (screener: any, questionGroup: any) => {                            
              masterScreener.questionGroups.push(questionGroup);
              // error here
              const cntrl: ControlMap = controlReducer(questionGroup);
              assign(masterScreener.controls, cntrl);
              return masterScreener;
           }, masterScreener)
  }
  
  
  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }
}