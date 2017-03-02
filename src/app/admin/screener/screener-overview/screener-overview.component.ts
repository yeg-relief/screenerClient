import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as actions  from '../store/screener-actions';
import { 
  Question, ID, QuestionType, 
  QUESTION_TYPE_CONSTANT, QUESTION_TYPE_CONDITIONAL 
} from '../../models';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/multicast';

@Component({
  selector: 'app-screener-overview',
  templateUrl: './screener-overview.component.html',
  styleUrls: ['./screener-overview.component.css'],
})
export class ScreenerOverviewComponent implements OnInit {
  private form$: Observable<FormGroup>;
  private constantQuestions$: Observable<Question[]>;
  private conditionalQuestion$: Observable<Question[]>;
  private selectedConstantID$: Observable<ID>;
  private selectedConditionalID$: Observable<ID>;
  private loading$: Observable<boolean>;
  private error$: Observable<string>;
  private constant_type: QuestionType = QUESTION_TYPE_CONSTANT;
  private conditional_type: QuestionType = QUESTION_TYPE_CONDITIONAL;
  
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.store.dispatch(new actions.LoadData({}));


    this.form$ = this.store.let(fromRoot.getForm).multicast( new ReplaySubject(1) ).refCount();

    this.constantQuestions$ =  this.store.let(fromRoot.getConstantQuestions);

    this.conditionalQuestion$ = this.store.let(fromRoot.getConditionalQuestions);

    this.selectedConstantID$ = this.store.let(fromRoot.getSelectedConstantID);
    
    this.selectedConditionalID$ = this.store.let(fromRoot.getSelectedConditionalID);

    this.loading$ = this.store.let(fromRoot.isScreenerLoading);

    this.error$ = this.store.let(fromRoot.getScreenerError);
  }

  handleSelect(id: ID) { this.store.dispatch(new actions.SelectQuestion(id)) }

  handleAddQuestion(payload: {[key:string]: QuestionType | ID }) {
    const type = payload['type'], host_id = payload['host_id'];

    
    if (type === QUESTION_TYPE_CONSTANT && host_id === undefined) { 
      this.store.dispatch(new actions.AddQuestion({}));
      return; 
    }

    if (type === QUESTION_TYPE_CONDITIONAL && host_id !== undefined) {
      this.store.dispatch(new actions.AddConditionalQuestion(host_id));
    }
  }

  ngOnDestroy() {}

}