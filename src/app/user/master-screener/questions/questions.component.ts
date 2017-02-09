import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup  } from '@angular/forms';
import { MasterScreenerService } from '../master-screener.service';
import { QuestionControlService } from './question-control.service';
import { Question } from '../../../shared';

@Component({
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  providers: [QuestionControlService]
})
export class QuestionsComponent implements OnInit, OnDestroy {
  // having problems passing form through async pipe... 
  // resolving form in `then` statement and using a flag to indicate form is resolved
  form: FormGroup;
  questions: Question[] = [];
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
      // gross object reference data.error.msg or something would be better
      this.errorMessage = 'unable to load data from server, please try later.';
    } else if(Array.isArray(data)){
      this.questions = data[0].sort( (a, b) => a.index - b.index );
      const conditionalQuestions = data[1];
      for (const q of this.questions) {
        if ( q.expandable && Array.isArray(q.conditonalQuestions) ) {
          q.conditonalQuestions = q.conditonalQuestions.map(id => conditionalQuestions.find(q => q.id === id))
                                   .filter(question => question !== undefined)
                                   .sort( (a, b) => a.index - b.index )
        }
      }

      try {
        this.form = this.questionControlService.toFormGroup(this.questions);
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
    this.masterScreenerService.loadResults(this.form.value)
      .then( results => this.masterScreenerService.results = [].concat(results))
      .then(() => this.router.navigateByUrl('/master-screener/results'))
      .catch( () => this.errorMessage = 'unable to load results, try later.');
  }

  addControls($event) {
    this.questionControlService.addQuestions($event, this.form);
  }

  removeControls($event) {
    this.questionControlService.removeQuestions($event, this.form);
  }
}
