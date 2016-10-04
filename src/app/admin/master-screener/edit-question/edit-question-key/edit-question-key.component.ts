import { Component, OnInit, Input } from '@angular/core';
import { Key } from '../../../models/key';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-key',
  templateUrl: './edit-question-key.component.html',
  styleUrls: ['./edit-question-key.component.css']
})
export class EditQuestionKeyComponent implements OnInit {
  @Input() unusedKeys: Key[];
  @Input() currentKey: string;

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  selectChange(value) {
    this.store.dispatch(new editQuestion.EditQuestionChangeKey(value));

  }

  isSelected(key: string) {
    return key === this.currentKey;
  }

  isEmpty() {
    return this.currentKey === 'empty';
  }
}
