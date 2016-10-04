import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css']
})
export class QuestionDetailsComponent implements OnInit {
  @Output() detailClick = new EventEmitter<string[]>();
  questionDetails$: Observable<any>;
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.questionDetails$ = this.store.let(fromRoot.getQuestionDetails);
  }

  handleClick(open: string[]) {
    console.log([].concat(open));
    this.detailClick.emit(open);
  }

}
