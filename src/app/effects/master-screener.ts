import { DataService, EditorService } from '../services/index';
import { MasterScreenerActions } from '../actions';
import { MasterScreener, Question } from '../models';
import { Injectable } from '@angular/core';
import { Effect, StateUpdates, toPayload } from '@ngrx/effects';
import { AppState } from '../reducers';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap'
@Injectable()
export class MasterScreenerEffects{
  constructor(
    private updates$: StateUpdates<AppState>,
    private masterScreenerActions: MasterScreenerActions,
    private dataService: DataService,
    private editorService: EditorService
  ){ }
  
  @Effect() loadQuestionsOnInit$ = Observable.of(this.masterScreenerActions.loadQuestions());
  
  @Effect() loadQuestions$ = this.updates$ 
    .whenAction(MasterScreenerActions.LOAD_QUESTIONS)
    .switchMapTo( this.dataService.getQuestions())
    .map( (questions:Question[]) => {return this.masterScreenerActions.loadQuestionsSuccess(questions)})
    
  @Effect() loadResults$ = this.updates$ 
    .whenAction(MasterScreenerActions.SUBMIT)
    .switchMapTo( this.dataService.getResults())
    .map( (results:any[]) => {return this.masterScreenerActions.submitSuccess(results)})
    
  @Effect() updateQuestions$ = this.updates$
    .whenAction(MasterScreenerActions.UPDATE_QUESTIONS)
    .switchMap( (update) => this.editorService.updateMasterScreener(update.action.payload) )
    .map( (questions:Question[]) => {return this.masterScreenerActions.updateQuestionsSuccess(questions)})
}