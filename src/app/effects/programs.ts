import { ProgramService } from '../services/index';
import { ProgramActions } from '../actions/index';
import { Program } from '../models/index';
import { Injectable } from '@angular/core';
import { Effect, StateUpdates, toPayload } from '@ngrx/effects';
import { AppState } from '../reducers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/map';

@Injectable()
export class ProgramEffects{
  constructor(
    private updates$: StateUpdates<AppState>,
    private programActions: ProgramActions,
    private dataService: ProgramService
  ){ }
  
  @Effect() loadProgramsOnInit$ = Observable.of(this.programActions.loadPrograms());
  
  @Effect() loadPrograms = this.updates$ 
    .whenAction(ProgramActions.LOAD_PROGRAMS)
    .switchMapTo( this.dataService.loadPrograms())
    .map( (programs:Program[]) => {return this.programActions.loadProgramsSuccess(programs)})
}