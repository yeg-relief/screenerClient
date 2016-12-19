import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as fromEditQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-label',
  templateUrl: './edit-question-label.component.html',
  styleUrls: ['./edit-question-label.component.css']
})
export class EditQuestionLabelComponent {
  @Input() label: string;
  internalLabel: string;
  constructor(private store: Store<fromRoot.State>) { }

  saveInput($event) {
    this.store.dispatch(new fromEditQuestion.EditQuestionChangeLabel($event));
    this.internalLabel = $event;
  }

  changeLabel() {
    this.label = this.internalLabel;
  }
}
