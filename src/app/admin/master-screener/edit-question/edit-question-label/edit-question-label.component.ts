import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-label',
  templateUrl: './edit-question-label.component.html',
  styleUrls: ['./edit-question-label.component.css']
})
export class EditQuestionLabelComponent implements OnInit {
  @Input() label: string;
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  changeLabel($event) {
    this.store.dispatch(new editQuestion.EditQuestionChangeLabel($event));
  }
}
