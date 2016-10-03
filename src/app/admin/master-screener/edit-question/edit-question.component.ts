import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { Question } from '../../../shared/models';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  editQuestion$: Observable<Question>;
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.editQuestion$ = this.store.let(fromRoot.getPresentQuestionEdit);
  }

}
