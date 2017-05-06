import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { MasterScreenerService } from '../master-screener.service';
import { QuestionControlService } from './question-control.service';
import { Question } from '../../../admin/models';
import { Animations } from '../../../shared/animations';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations'

@Component({
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  providers: [QuestionControlService],
  animations: [
    Animations.flyinHalf
  ]
})
export class QuestionsComponent implements OnInit, OnDestroy {
  form: FormGroup;
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
    if (data.error !== undefined) {
      this.errorMessage = 'unable to load data from server, please try later.';
    } 
    this.questions = data.questions || [];
    this.conditionalQuestions = data.conditionalQuestions || [];
    try {
      this.form = this.questionControlService.toFormGroup(this.questions);
    } catch (error) {
      console.error(error);
      this.errorMessage = 'internal program error, please contact admin.';
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timeout);
  }

  onSubmit() {
    this.timeout = setTimeout(() => this.loading = true, 60);
    this.masterScreenerService.loadResults(this.form.value)
      .then(results => this.masterScreenerService.results = [...results])
      .then(() => this.router.navigateByUrl('/master-screener/results'))
      .catch(() => this.errorMessage = 'unable to load results, try later.');
  }

  idsToKeys(ids) {
    return this.conditionalQuestions.filter(q => ids.includes(q.id)).map(q => q.key);
  }

  addControls(conditional_ids: string[]) {
    this.idsToKeys(conditional_ids).forEach(key => this.form.addControl(key, new FormControl()));
  }

  removeControls(conditional_ids: string[]) {
    this.idsToKeys(conditional_ids).forEach(key => this.form.removeControl(key));
  }

  gatherConditionals(question: Question) {
    if (!question.expandable || question.conditionalQuestions.length === 0) {
      return [];
    }
    const conditionals = question.conditionalQuestions;
    return this.conditionalQuestions.filter(q => conditionals.includes(q.id));
  }
}
