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
  private questions$: Observable<any>;
  constructor(public model: ScreenerModel, private qcs: QuestionControlService, private fb: FormBuilder) { }

  ngOnInit() {
    this.model.init = true;
    // unwanted bootstrapping, ie, this load call is required
    this.model.load()
      .map(screener => screener.form)
      .multicast( new ReplaySubject<any>(1) ).refCount().subscribe();
    // this form we update with controls etc
    this.adminForm = this.model.publicform$;
    this.state$ = this.model.state$.map(state => state.screener).multicast(new ReplaySubject<1>()).refCount();

    this.questions$ = this.model.questions$.map(questions => questions.sort( (a, b) => a.index - b.index) )
      .do( () => console.log('~~~~~~~~ QUESITON UPDATE ~~~~~~~~~~~~~'))
      .do(x => console.log(x))
      .multicast(new ReplaySubject<1>()).refCount()

    this.state$.subscribe();
  }

  handleSave() {
    this.model.publicform$
      .take(1)
      .do(() => console.log('handle save called'))
      .map( form => {
        console.log('~~~~~~~~~~~~~~~~~~~~')
        console.log(form.value);
        console.log(form)
        console.log('++++++++++++++++++++')
        return {
          version: 15,
          questions: Object.keys(form.value).map(key => form.value[key])
        }
      })
      .let(this.model.save.bind(this.model))
      .subscribe();
  }
}
