import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Question } from '../../../shared/models';
import { Key } from '../../models/key';
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
    .map(question => new editQuestion.EditQuestionLoad(<Question>question));

  @Effect() findUnusedKeys = this.actions$
    .ofType(editQuestion.EditQuestionActionTypes.INIT_EDIT)
    .switchMap( () => this.store.let(fromRoot.findUnusedKeys))
    .map(keys => new editQuestion.EditQuestionLoadUnusedKeys(<Key[]>keys))

  @Effect() saveQuestion$ = this.actions$
    .ofType(editQuestion.EditQuestionActionTypes.SAVE_QUESTION)
    .map(action => action.payload)
    .switchMap((question: Question) => {
      return Observable.combineLatest(
        verifyQuestion(question),
        Observable.of(question)
        );
      }
    )
    .map(([errors, question]) => {
      if (errors.length === 0) {
        this.store.dispatch(new editQuestion.SaveQuestionSuccess(question));
        return new editQuestion.SaveQuestionSuccess(question);
      }
      return new editQuestion.SaveQuestionFailure(errors);
    })
    .map(action => {
      if (action.type === editQuestion.EditQuestionActionTypes.SAVE_QUESTION_SUCCESS) {
        const question = <Question>action.payload;
        return new edit.AddQuestion(question);
      }
      return action;
    });

  @Effect() updateQuestion$ = this.actions$
    .ofType(editQuestion.EditQuestionActionTypes.UPDATE_QUESTION)
    .map(action => action.payload)
    .switchMap(payload => {
      const editedVersion = <Question>payload.editedVersion;
      const originalKey = <Question>payload.originalKey;
      return Observable.combineLatest(
        verifyQuestion(editedVersion),
        Observable.of(originalKey),
        Observable.of(editedVersion)
      );
    })
    .map(([errors, originalKey, editedVersion]) => {
      if (errors.length === 0) {
        const payload = {
          originalKey: originalKey,
          editedVersion: editedVersion
        };
        this.store.dispatch(new editQuestion.UpdateQuestionSuccess(payload));
        return new editQuestion.UpdateQuestionSuccess(payload);
      }
      return new editQuestion.UpdateQuestionFailure(errors);
    })
    .map(action => {
      if (action.type === editQuestion.EditQuestionActionTypes.UPDATE_QUESTION_SUCCESS) {
        return new edit.EditQuestion(action.payload);
      }
      return action;
    });

  @Effect() addConditional$ = this.actions$
    .ofType(editQuestion.EditQuestionActionTypes.ADD_CONDITIONAL)
    .map(action => action.payload)
    .switchMap(payload => {
      const questionKey = <string>payload.questionKey;
      const conditional = <Question>payload.conditional;
      return Observable.combineLatest(
        verifyQuestion(conditional),
        Observable.of(questionKey),
        Observable.of(conditional)
      );
    })
    .map(([errors, expandableQuestionKey, conditionalQuestion]) => {
      if (errors.length === 0) {
        const payload = {
          questionKey: expandableQuestionKey,
          conditional: conditionalQuestion
        };
        this.store.dispatch(new edit.AddConditional(payload));
        return new editQuestion.UpdateQuestionSuccess(payload);
      }
      return new editQuestion.UpdateQuestionFailure(errors);
    });

  constructor(
    private store: Store<fromRoot.State>,
    private actions$: Actions
  ) { }
}
