import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editScreener from '../edit.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
@Component({
  selector: 'app-edit-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class EditControlsComponent implements OnInit {
  unsavedEdits$: Observable<boolean>;
  saving$: Observable<boolean>;
  version: number;
  constructor(private store: Store<fromRoot.State>, private route: ActivatedRoute) { }

  ngOnInit() {
    this.version = this.route.snapshot.params['version'];
    this.unsavedEdits$ = this.store.let(fromRoot.unsavedEdits);
    this.saving$ = this.store.let(fromRoot.getEditScreenerSaving);
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

  handleSave() {
    const self = this;
    this.store.let(fromRoot.getPresentEditScreener)
    .take(1)
    .subscribe(
      (presentScreener) => {
        console.log(presentScreener);
        self.store.dispatch(new editScreener.SaveScreener(presentScreener));
      },
      (error) => console.log(error)
    );
  }
}
