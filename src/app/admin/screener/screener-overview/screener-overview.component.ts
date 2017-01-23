import { Component, OnInit } from '@angular/core';
import { ScreenerModel } from '../screener-model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { cloneDeep } from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionControlService } from
  '../../../user/master-screener/questions/question-control.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/multicast';
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
  private adminForm: FormGroup;
  constructor(private model: ScreenerModel, private qcs: QuestionControlService, private fb: FormBuilder) { }

  ngOnInit() {
    const intialized = screener => {
      this.loading = false;
      this.state$ = this.model.state$;
      this.initialState = cloneDeep(screener);
      this.form = this.qcs.toFormGroup(screener.questions);
      this.adminControl().subscribe(thing => this.adminForm = thing);

      this.adminForm.valueChanges.subscribe(val => console.log(val))
    }
    this.model.load().take(1).subscribe(
      screener => intialized(screener),
      error => console.error('ERROR IN SCREENER OVERVIEW')      
    )
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
    console.log('add controls called');
    this.qcs.addQuestions(questions, this.form);
  }

  removeControls(questions) {
    console.log('remove controls called');
    this.qcs.removeQuestions(questions, this.form);
  }

  handleFilter(term) {
    console.log(term);
  }



  adminControl(){
    return this.state$.take(1)
      .map(screener => screener.questions)
      .switchMap(x => x)
      .reduce<any>( (rawAdminGroup, question) => {
        const keyGroup = {};
        keyGroup['label'] = [question.label, [Validators.required, Validators.minLength(5)]];
        keyGroup['controlType'] = [question.controlType, [Validators.required]];
        keyGroup['key'] = [question.key, [Validators.required]];
        keyGroup['expandable'] = [question.expandable, [Validators.required]]
        return (<any>Object).assign({}, rawAdminGroup, keyGroup);
      }, {})
      .map( group => this.fb.group(group) )
      .do( () => console.log('***********************8'))
      .do ( thing => console.log(thing.value) )
      .do( () => console.log('***********************8'))
      .multicast( new ReplaySubject<any>(1)).refCount()
  }
}
