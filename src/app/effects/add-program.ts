import { Injectable } from '@angular/core';
import { Effect, StateUpdates } from '@ngrx/effects';
import { AppState } from '../reducers';
import { AddProgramActions, ProgramActions } from '../actions';
import { KeyService, ProgramService } from '../services/index';
import { Key, Program } from '../models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class AddProgramEffects{
  constructor(
    private updates$: StateUpdates<AppState>,
    private addProgramActions: AddProgramActions,
    private keyService: KeyService, 
    private programService: ProgramService, 
    private programActions: ProgramActions
  ){}
  
  @Effect() loadKeys$ = this.updates$ 
    .whenAction(AddProgramActions.LOAD_KEYS)
    .switchMapTo( this.keyService.loadKeys() )
    .map( (keys:Key[]) => this.addProgramActions.loadKeysSuccess(keys))
    
  @Effect() upload = this.updates$
    .whenAction(AddProgramActions.UPLOAD_PROGRAM)
    .map(update => update.state.addProgram.program)
    .switchMap(program => this.programService.uploadProgram(program, 300))
    .map(program => {
      return {
        type: AddProgramActions.UPLOAD_PROGRAM_SUCCESS
      }
    })     
}