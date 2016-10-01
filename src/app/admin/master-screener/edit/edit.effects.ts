import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { MasterScreener } from '../../models/master-screener';
import { DataService } from '../../data.service';
import { EditScreenerActionsTypes } from './edit.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Injectable()
export class EditScreenerEffects {

  @Effect() initEdit$ = this.actions$
    .ofType(EditScreenerActionsTypes.INIT_EDIT)
    .map<number>(action => action.payload)
    .switchMap<MasterScreener>( (version: number) => {
      return <Observable<MasterScreener>>this.data.loadScreener(version);
    })
    .switchMap((screener: MasterScreener) => {
      return Observable.of({
        type: EditScreenerActionsTypes.LOAD_SCREENER,
        payload: screener
      });
    });


  constructor(
    // DataService is provided via the admin module
    private data: DataService,
    private actions$: Actions
  ) { }
}
