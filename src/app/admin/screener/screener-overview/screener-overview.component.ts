import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/services/auth.service';
import * as fromRoot from '../../reducer';
import * as actions  from '../store/screener-actions';
import { 
  Question, ID, QuestionType, 
  QUESTION_TYPE_CONSTANT, QUESTION_TYPE_CONDITIONAL 
} from '../../models';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/multicast';

import { isConditionalQuestion, State } from '../store/screener-reducer';

@Component({
  selector: 'app-screener-overview',
  templateUrl: './screener-overview.component.html',
  styleUrls: ['./screener-overview.component.css'],
})
export class ScreenerOverviewComponent implements OnInit {
  private form$: Observable<FormGroup>;
  private constantQuestions$: Observable<ID[]>;
  private conditionalQuestions$: Observable<ID[]>;
  private conditionalQuestions$$: Observable<ID[]>;
  private selectedConstantID$: Observable<ID>;
  private selectedConditionalID$: Observable<ID>;
  private loading$: Observable<boolean>;
  private error$: Observable<string>;

  private constant_type: QuestionType = QUESTION_TYPE_CONSTANT;
  private conditional_type: QuestionType = QUESTION_TYPE_CONDITIONAL;
  private reloadConstantQuestions = new BehaviorSubject('');
  private reloadConditionalQuestions = new BehaviorSubject('');

  constructor(private store: Store<fromRoot.State>, private auth: AuthService) { }

  ngOnInit() {
    this.store.dispatch(new actions.LoadData(this.auth.getCredentials()));


    this.form$ = this.store.let(fromRoot.getForm).multicast( new ReplaySubject(1) ).refCount();

    this.constantQuestions$ = this.reloadConstantQuestions.withLatestFrom(this.form$)
      .map( ([_, form]) => { 
        const state = <State>{ form: form };
        const ids = Object.keys(form.value);
        return ids.filter(id => form.get(id) !== null)
          .filter(id => isConditionalQuestion(id, state) === false )
          .sort( (a, b) => form.get([a, 'index']).value - form.get([b, 'index']).value);
      })

    this.selectedConstantID$ = this.store.let(fromRoot.getSelectedConstantID)
      .multicast( new ReplaySubject(1) ).refCount();

    this.conditionalQuestions$ = this.selectedConstantID$.withLatestFrom(this.form$)
      .filter( ([selectedConstantID, form, ]) => form.get(selectedConstantID) !== null)
      .filter( ([ selectedConstant, form,]) => Array.isArray(form.get([selectedConstant, 'conditionalQuestions']).value))
      .map( ([selectedConstant, form,]) => [form.get([selectedConstant, 'conditionalQuestions']).value, form])
      .map( ([conditionalIDs, form]) => conditionalIDs.sort( (a, b) => form.get([a, 'index']).value - form.get([b, 'index']).value ) )

    this.conditionalQuestions$$ = this.reloadConditionalQuestions
      .mergeMap(_ => this.conditionalQuestions$)

    

    this.selectedConditionalID$ = this.store.let(fromRoot.getSelectedConditionalID);

    this.loading$ = this.store.let(fromRoot.isScreenerLoading);

    this.error$ = this.store.let(fromRoot.getScreenerError);
    
    // we have to force an initial load of the constant questions.
    this.loading$
      .filter(loading => loading === false)
      .take(1)
      .subscribe( _ => {
        setTimeout( () => { 
          if (this.reloadConstantQuestions !== undefined) this.reloadConstantQuestions.next(''); 
        }, 0);
      })
    
  }

  handleSelect(id: ID) { this.store.dispatch(new actions.SelectQuestion(id)) }

  handleAddQuestion(payload: {[key:string]: QuestionType | ID }) {
    const type = payload['type'], host_id = payload['host_id'];

    
    if (type === QUESTION_TYPE_CONSTANT && host_id === undefined) { 
      this.store.dispatch(new actions.AddQuestion({}));
      setTimeout( () => { 
        if (this.reloadConstantQuestions !== undefined) this.reloadConstantQuestions.next(''); 
      }, 0)
      return; 
    }

    if (type === QUESTION_TYPE_CONDITIONAL && host_id !== undefined) {
      this.store.dispatch(new actions.AddConditionalQuestion(host_id));
      setTimeout( () => { 
        if (this.reloadConditionalQuestions !== undefined) this.reloadConditionalQuestions.next(''); 
      }, 0)
    }
  }

  handleSelectConditional(id: ID) {
    this.store.dispatch(new actions.SelectConditionalQuestion(id));
  }

  ngOnDestroy() {}

}