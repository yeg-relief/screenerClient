import { Component, OnInit } from '@angular/core';
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
export class QuestionsComponent implements OnInit {
  // having problems passing form through async pipe... 
  // resolving form in `then` statement and using a flag to indicate form is resolved
  form: FormGroup;
  formResolved = false;
  questions: Question[] = [];
  errorMessage = '';

  constructor(
    private masterScreenerService: MasterScreenerService,
    private questionControlService: QuestionControlService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const data = this.route.snapshot.data['questions'];
    if (data.error) {
      // gross object reference data.error.msg or something would be better
      this.errorMessage = 'unable to load data from server, please try later.';
    } else {
      this.questions = data;
      try {
        this.form = this.questionControlService.toFormGroup(this.questions);
      } catch (error) {
        console.error(error);
        this.errorMessage = 'internal program error, please contact admin.';
      }
    }
    
  }


  onSubmit() {
    console.log(JSON.stringify(this.form.value));
    //this.masterScreenerService.fetchResults(this.payLoad);
    //this.router.navigateByUrl('/master-screener/results');
  }

  addControls($event) {
    this.questionControlService.addQuestions($event.questions, $event.form);
  }

  removeControls($event) {
    this.questionControlService.removeQuestions($event.questions, $event.form);
  }
}
