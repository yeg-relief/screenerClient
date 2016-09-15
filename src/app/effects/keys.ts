import { KeyService } from '../services/index';
import { KeyActions } from '../actions';
import { Key } from '../models';
import { Injectable } from '@angular/core';
import { Effect, StateUpdates } from '@ngrx/effects';
import { AppState } from '../reducers';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class KeyEffects{
  constructor(
    private updates$: StateUpdates<AppState>,
    private keyActions: KeyActions,
    private keyService: KeyService
  ){}
  
  @Effect() loadKeysOnInit$ = Observable.of(this.keyActions.loadKeys());
  
  @Effect() loadKeys$ = this.updates$ 
    .whenAction(KeyActions.LOAD_KEYS)
    .switchMapTo( this.keyService.loadKeys() )
    .map( (keys:Key[]) => {return this.keyActions.loadKeysSuccess(keys)})

}