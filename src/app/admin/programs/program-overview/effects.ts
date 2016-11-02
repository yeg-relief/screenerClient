import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataService } from '../../data.service';
import * as programOverview from './actions';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class ProgramOverviewEffects {

  @Effect() loadPrograms$ = this.actions$
  .ofType(programOverview.ProgramOverviewActionsTypes.LOAD_PROGRAMS)
  .switchMap(() => this.data.loadPrograms())
  // can put some logic here to deal with error loads
  .map(programs => new programOverview.LoadProgramsSuccess(programs));

  constructor(
    private data: DataService,
    private actions$: Actions
  ) { }
}
