import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editScreener from '../edit.actions';

@Component({
  selector: 'app-edit-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class EditControlsComponent implements OnInit {

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  handleUndo() {
    this.store.dispatch( new editScreener.UndoEdit({}));
  }

  handleRedo() {
    this.store.dispatch( new editScreener.RedoEdit({}) );
  }

  handleClear() {
    this.store.dispatch( new editScreener.ClearQuestions({}));
  }
}
