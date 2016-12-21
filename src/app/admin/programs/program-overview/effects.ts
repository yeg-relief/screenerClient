import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataService } from '../../data.service';
import * as programOverview from './actions';
import { ApplicationFacingProgram } from '../../models/program';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class ProgramOverviewEffects {

  @Effect() loadPrograms$ = this.actions$
    .ofType(programOverview.ProgramOverviewActionsTypes.LOAD_PROGRAMS)
    .do( () => console.log('LOAD PROGRAMS CALLED'))
    .switchMap(() => this.data.loadPrograms())
    .do( programs => console.log(programs))
    .map(programs => new programOverview.LoadProgramsSuccess(programs));

  @Effect() updateProgram$ = this.actions$
    .ofType(programOverview.ProgramOverviewActionsTypes.UPDATE_PROGRAM)
    .map(action => action.payload)
    .switchMap(program => this.data.updateProgram(program))
    .map(programs => new programOverview.UpdateProgramSuccess(programs));

  @Effect() createProgram$ = this.actions$
    .ofType(programOverview.ProgramOverviewActionsTypes.CREATE_PROGRAM)
    .map(action => action.payload)
    .switchMap(program => this.data.createProgram(program))
    .map(programs => new programOverview.CreateProgramSuccess(programs));

  @Effect() deleteProgram$ = this.actions$
    .ofType(programOverview.ProgramOverviewActionsTypes.DELETE_PROGRAM)
    .map(action => action.payload)
    .switchMap(program => this.data.deleteProgram(program))
    .map(programs => new programOverview.DeleteProgramSuccess(programs));

  constructor(
    private data: DataService,
    private actions$: Actions,
  ) { }
}
