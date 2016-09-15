import { Injectable } from '@angular/core';
import { Effect, StateUpdates } from '@ngrx/effects';
import { AppState } from '../reducers';
import { AddProgramActions } from '../actions';
import { KeyService } from '../services/index';
import { Key } from '../models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/map';

@Injectable()
export class AddProgramEffects{
  constructor(
    private updates$: StateUpdates<AppState>,
    private addProgramActions: AddProgramActions,
    private keyService: KeyService
  ){}
  
  @Effect() loadKeys$ = this.updates$ 
    .whenAction(AddProgramActions.LOAD_KEYS)
    .switchMapTo( this.keyService.loadKeys() )
    .map( (keys:Key[]) => {return this.addProgramActions.loadKeysSuccess(keys)})

}