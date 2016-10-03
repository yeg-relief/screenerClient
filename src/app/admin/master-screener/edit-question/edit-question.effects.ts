import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import  * as editQuestion from './edit-question.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';

@Injectable()
export class EditQuestionEffects {

  @Effect() initEditQuestion$ = this.actions$
    .ofType(editQuestion.EditQuestionActionTypes.INIT_EDIT)
    .switchMap( () => this.store.let(fromRoot.findEditQuestion))
    .map(question => new editQuestion.EditQuestionLoad(question));

  @Effect() findUnusedKeys = this.actions$
    .ofType(editQuestion.EditQuestionActionTypes.INIT_EDIT)
    .switchMap( () => this.store.let(fromRoot.findUnusedKeys))
    .map(keys => new editQuestion.EditQuestionLoadUnusedKeys(keys));

  constructor(
    private store: Store<fromRoot.State>,
    private actions$: Actions
  ) { }
}
