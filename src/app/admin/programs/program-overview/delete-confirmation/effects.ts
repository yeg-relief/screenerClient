import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as programOverview from '../actions';
import * as programDelete from './actions';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class ProgramDeleteEffects {

  @Effect() savedProgramUpdate$ = this.actions$
    .ofType(programOverview.ProgramOverviewActionsTypes.DELETE_PROGRAM_SUCCESS)
    .delay(200)
    .do(() => this.router.navigateByUrl('/admin/programs/overview'))
    .map(() => new programDelete.DeleteSuccess({}));

  constructor(
    private actions$: Actions,
    private router: Router
  ) { }
}
