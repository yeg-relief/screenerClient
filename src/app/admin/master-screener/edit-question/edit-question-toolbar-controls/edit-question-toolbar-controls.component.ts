import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-toolbar-controls',
  templateUrl: './edit-question-toolbar-controls.component.html',
  styleUrls: ['./edit-question-toolbar-controls.component.css']
})
export class EditQuestionToolbarControlsComponent implements OnInit {

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  handleUndo() {
    this.store.dispatch(new editQuestion.UndoEdit({}));
  }

  handleRedo() {
    this.store.dispatch(new editQuestion.RedoEdit({}));
  }
}
