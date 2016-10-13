import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Question } from '../../../shared/models';
import { verifyQuestion } from './verify-question';
import * as fromRoot from '../../reducer';
import  * as editQuestion from './edit-question.actions';
import * as edit from '../edit/edit.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/do';

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

  @Effect() saveQuestion$ = this.actions$
    .ofType(editQuestion.EditQuestionActionTypes.SAVE_QUESTION)
    .map<Question>(action => action.payload)
    .switchMap((question: Question) => {
      return Observable.combineLatest(
        verifyQuestion(question),
        Observable.of(question)
        );
      }
    )
    .map(([errors, question]) => {
      if (errors.length === 0) {
        return new edit.AddQuestion(question);
      }
      return new editQuestion.SaveQuestionFailure(errors);
    });

  constructor(
    private store: Store<fromRoot.State>,
    private actions$: Actions
  ) { }
}
