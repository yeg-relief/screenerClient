import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-question-errors',
  templateUrl: './question-errors.component.html',
  styleUrls: ['./question-errors.component.css']
})
export class QuestionErrorsComponent implements OnInit {
  @Output() errorClick = new EventEmitter<string[]>();
  questionErrors$: Observable<any>;
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.questionErrors$ = this.store.let(fromRoot.getQuestionErrors);
  }

  handleClick(open: string[]) {
    this.errorClick.emit(open);
  }

}
