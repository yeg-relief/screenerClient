import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup  } from '@angular/forms';
import { MasterScreenerService } from '../master-screener.service';
import { QuestionControlService } from './question-control.service';
import { Question } from '../../../shared';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/take';

@Component({
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  providers: [QuestionControlService]
})
export class QuestionsComponent implements OnInit, OnDestroy {
  // having problems passing form through async pipe... 
  // resolving form in `then` statement and using a flag to indicate form is resolved
  form: ReplaySubject<FormGroup>;
  questions: Question[] = [];
  conditionalQuestions: Question[] = [];
  errorMessage = '';
  timeout;
  loading = false;

  constructor(
    public masterScreenerService: MasterScreenerService,
    private questionControlService: QuestionControlService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const data = this.route.snapshot.data['questions'];
    if (data.error) {
      this.errorMessage = 'unable to load data from server, please try later.';
    } else if(Array.isArray(data)){
      this.form = new ReplaySubject<FormGroup>(1);
      this.questions = data[0].sort( (a, b) => a.index - b.index );
      this.conditionalQuestions = data[1];
      try {
        this.form.next( this.questionControlService.toFormGroup(this.questions) );
      } catch (error) {
        console.error(error);
        this.errorMessage = 'internal program error, please contact admin.';
      }
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timeout);
  }


  onSubmit() {
    this.timeout = setTimeout( () => this.loading = true, 60);
    let value;
    this.form.take(1).subscribe(val => value = val.value)
    console.log(value);
    this.masterScreenerService.loadResults(value)
      .then( results => this.masterScreenerService.results = [...results] )
      .then(() => this.router.navigateByUrl('/master-screener/results'))
      .catch( () => this.errorMessage = 'unable to load results, try later.');
}

  addControls($event) {
    let form;
    this.form.take(1).subscribe(f => form = f);
    const conditionalQuestions = this.conditionalQuestions.filter( q => $event.find(id => q.id === id) );
    this.questionControlService.addQuestions(conditionalQuestions, form);
    this.form.next( form );
  }

  removeControls($event) {
    let form;
    this.form.take(1).subscribe(f => form = f);
    const conditionalQuestions = this.conditionalQuestions.filter( q => $event.find(id => q.id === id) ).sort( (a, b) => a.index - b.index);
    this.questionControlService.removeQuestions(conditionalQuestions, form);
    this.form.next( form );
  }

  gatherConditionals(question) {
    if (!question.expandable || !Array.isArray(question.conditionalQuestions) || question.conditionalQuestions.length === 0){
      return [];
    }
    const conditionals = question.conditionalQuestions;
    return this.conditionalQuestions.filter( q => conditionals.find(id => id === q.id))
  }
}
