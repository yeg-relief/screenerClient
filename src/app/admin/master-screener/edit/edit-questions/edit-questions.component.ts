import { Component, OnInit, Input } from '@angular/core';
import { QuestionControlService } from
  '../../../../user/master-screener/questions/question-control.service';
import { FormGroup  } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Question } from '../../../../shared/models';

@Component({
  selector: 'app-edit-questions',
  templateUrl: './edit-questions.component.html',
  styleUrls: ['./edit-questions.component.css'],
  providers: [QuestionControlService]
})
export class EditQuestionsComponent implements OnInit {
  form: FormGroup;
  @Input() questions: Question[];
  constructor(private questionControlService: QuestionControlService) { }

  ngOnInit() {
    this.questionControlService.toFormGroup(Observable.of(this.questions))
      .subscribe( form => this.form = form )
      .unsubscribe();
  }

  addControls(questions) {
    this.questionControlService.addQuestions(questions, this.form);
  }

  removeControls(questions) {
    this.questionControlService.removeQuestions(questions, this.form);
  }

}
