import { Component, OnInit, Input } from '@angular/core';
import { QuestionControlService } from
  '../../../../user/master-screener/questions/question-control.service';
import { FormGroup  } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Question } from '../../../../shared/models';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

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
    this.form = this.questionControlService.toFormGroup(this.questions);
  }

  addControls(questions) {
    console.log('add controls called');
    this.questionControlService.addQuestions(questions, this.form);
  }

  removeControls(questions) {
    console.log('remove controls called');
    this.questionControlService.removeQuestions(questions, this.form);
  }
}
