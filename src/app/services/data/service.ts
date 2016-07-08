import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { fakeData } from './fake-data';
import { controlReducer, assign } from '../../MasterScreener/question/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/toArray';
import { 
  MasterScreener, GeneralQuestionGroup, 
  ControlMap
} from '../../MasterScreener/question/index';

// new imports
import { Question } from '../../models';


@Injectable()
export class DataService {
  private masterScreenerUrl: string = 'api/masterscreener/';
  
  constructor(private http: Http){}
  
  private _pullData(): Observable<any>{
    return Observable.from(fakeData());
  }
  
  getMasterScreener(): Observable<any>{
    const masterScreener: MasterScreener = {
      controls: {},
      questionGroups: new Array<GeneralQuestionGroup>()
    }
    return this._pullData()
           .reduce( (screener: any, questionGroup: any) => {                            
              masterScreener.questionGroups.push(questionGroup);
              const cntrl: ControlMap = controlReducer(questionGroup);
              assign(masterScreener.controls, cntrl);
              return masterScreener;
           }, masterScreener)
  }
  
  getQuestions(): Observable<Question[]>{
    return this._pullData().toArray();
  }
}


