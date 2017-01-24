import { Component, OnInit } from '@angular/core';
import { ScreenerModel } from '../screener-model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { cloneDeep } from 'lodash';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { QuestionControlService } from
  '../../../user/master-screener/questions/question-control.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/zip';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'app-screener-overview',
  templateUrl: './screener-overview.component.html',
  styleUrls: ['./screener-overview.component.css'],
  providers: [ QuestionControlService ]
})
export class ScreenerOverviewComponent implements OnInit {
  private state$: Observable<any>
  private loading = true;
  private initialState;
  private form: FormGroup;
  private adminForm: Observable<FormGroup>;
  constructor(public model: ScreenerModel, private qcs: QuestionControlService, private fb: FormBuilder) { }

  ngOnInit() {
    console.log('ScreenerOverviewComponent INIT CALLED')

    this.model.init = true;
    console.log(this.model.init)
    this.adminForm = this.model.load()
      .map(screener => screener.form)
      .multicast( new ReplaySubject<any>(1) ).refCount()
    this.adminForm.subscribe();
    this.state$ = this.model.state$.map(state => state.screener).multicast(new ReplaySubject<1>()).refCount();

    this.state$.subscribe();
  }

  revert() {
    this.model.dispatch.next(this.initialState);
  }



  deleteQuestion(index) {
    this.state$
      .take(1)
      .map(screener => screener.questions.splice(index, 1))
      .subscribe(screener => this.model.dispatch.next(screener));
  }

  swapQuestions(indexA, indexB){
    this.state$
      .take(1)
      .map(screener => {
        const a = screener.questions[indexA];
        const b = screener.questions[indexB];
        screener.questions[indexA] = b;
        screener.questions[indexB] = a;
        return screener;
      })
      .subscribe(screener => this.model.dispatch.next(screener));
  }

  addControls(questions) {

    this.qcs.addQuestions(questions, this.form);
  }

  removeControls(questions) {

    this.qcs.removeQuestions(questions, this.form);
  }

  handleFilter(term) {
    console.log(term);
  }

  handleSave() {
    Observable.zip(
      this.state$.take(1),
      this.adminForm
    )
    .do( ([_, adminForm]) => console.log(adminForm.valid))
    .map( ([state, form]) => {
      return {
        version: state.version + 1,
        questions: Object.keys(form.value).map(key => form.value[key])
      }
    }).do(thing => console.log(thing))
    .let(this.model.save.bind(this.model))
    .subscribe();
  }


  
}
