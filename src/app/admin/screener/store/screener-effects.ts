import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { ScreenerActionTypes } from './screener-actions';
import { AuthService } from '../../core/services/auth.service'
import { Screener } from '../../models';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';

const TIMEOUT = 20000;
const URL = '/protected/screener';

@Injectable()
export class ScreenerEffects {
  constructor(
    private http: Http,
    private actions$: Actions,
    private authService: AuthService
  ) { }

  

  @Effect() loadData$ = this.actions$
      .ofType(ScreenerActionTypes.LOAD_DATA)
      .map(action => action.payload)
      .switchMap(requestOptions => 
        this.http.get(URL, requestOptions)
          .map(res => ({ type: ScreenerActionTypes.LOAD_DATA_SUCCESS, payload: res.json().response }))
          .retry(2)
          .timeout(TIMEOUT)
          .catch(() => Observable.of({ type: ScreenerActionTypes.LOAD_DATA_FAILURE }))
      );


  @Effect() saveData$ = this.actions$
      .ofType(ScreenerActionTypes.SAVE_DATA)
      .map(action => [action.payload.screener, action.payload.credentials])
      .switchMap( ([payload, options]) => {
        return this.http.post(URL, payload, options)
          .map(res => ({ type: ScreenerActionTypes.SAVE_DATA_SUCCESS, payload: res.json().response }))
          .timeout(TIMEOUT)
          .catch((e) => Observable.of({ type: ScreenerActionTypes.SAVE_DATA_FAILURE, payload: e.message }));
      })
      .map(action => {
        return action.payload.type === ScreenerActionTypes.SAVE_DATA_SUCCESS ?
          { type: ScreenerActionTypes.LOAD_DATA_SUCCESS, payload: action.payload } : action;
      })
}