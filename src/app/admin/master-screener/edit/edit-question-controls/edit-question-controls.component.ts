import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../../../../shared/models';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import { EditScreenerActionsTypes } from '../edit.actions';

@Component({
  selector: 'app-edit-question-controls',
  templateUrl: './edit-question-controls.component.html',
  styleUrls: ['./edit-question-controls.component.css']
})
export class EditQuestionControlsComponent implements OnInit {
  @Input() question: Question;
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  onDelete() {
    this.store.dispatch({
      type: EditScreenerActionsTypes.REMOVE_QUESTION,
      payload: this.question
    });
  }
}
