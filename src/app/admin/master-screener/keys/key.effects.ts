import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Key } from '../../models/key';
import { DataService } from '../../data.service';
import  * as key from './key.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

@Injectable()
export class KeyEffects {

  @Effect() initKeys$ = this.actions$
    .ofType(key.KeyActionsTypes.LOAD_KEYS)
    .switchMap( () => this.data.loadKeys() )
    .map((keys: Key[]) => new key.LoadKeysSuccess(keys));


  constructor(
    // DataService is provided via the admin module
    private data: DataService,
    private actions$: Actions
  ) { }
}
