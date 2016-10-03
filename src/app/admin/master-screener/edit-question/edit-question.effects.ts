import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Question } from '../../../shared/models';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import  * as editQuestion from './edit-question.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

@Injectable()
export class EditQuestionEffects {

  @Effect() initEditQuestion$ = this.actions$
    .ofType(editQuestion.EditQuestionActionTypes.INIT_EDIT)
    .switchMap(action => this.store.let(fromRoot.findEditQuestion))
    .map(question => new editQuestion.EditQuestionLoad(question))

  constructor(
    private store: Store<fromRoot.State>,
    private actions$: Actions
  ) { }
}
