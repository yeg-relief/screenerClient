import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as programOverview from '../program-overview/actions';
import * as programEdit from './actions';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';

@Injectable()
export class ProgramEditEffects {

  @Effect() savedProgramUpdate$ = this.actions$
    .ofType(programOverview.ProgramOverviewActionsTypes.UPDATE_PROGRAM_SUCCESS)
    // cheap hack in order to ensure that proper results load on navigating back to overview
    .delay(2000)
    .do(() => this.router.navigateByUrl('/admin/programs/overview'))
    .map(() => new programEdit.SaveSuccess({}));

  @Effect() savedProgramCreate$ = this.actions$
    .ofType(programOverview.ProgramOverviewActionsTypes.CREATE_PROGRAM_SUCCESS)
    // cheap hack in order to ensure that proper results load on navigating back to overview
    .delay(2000)
    .do(() => this.router.navigateByUrl('/admin/programs/overview'))
    .map(() => new programEdit.SaveSuccess({}));

  constructor(
    private actions$: Actions,
    private router: Router
  ) { }
}
