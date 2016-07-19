import { DataService } from '../services/index';
import { MasterScreenerEditActions } from '../actions';
import { MasterScreener, Question } from '../models';
import { Injectable } from '@angular/core';
import { Effect, StateUpdates, toPayload } from '@ngrx/effects';
import { AppState } from '../reducers';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class MasterScreenerEditEffects{
  constructor(
    private updates$: StateUpdates<AppState>,
    private masterScreenerEditActions: MasterScreenerEditActions,
    private dataService: DataService
  ){ }
  
  @Effect() loadQuestionsOnInit$ = Observable.of(this.masterScreenerEditActions.loadQuestions());
  
  @Effect() loadQuestions$ = this.updates$ 
    .whenAction(MasterScreenerEditActions.LOAD_QUESTIONS)
    .switchMapTo( this.dataService.getQuestions())
    .map( (questions:Question[]) => {return this.masterScreenerEditActions.loadQuestionsSuccess(questions)})
}