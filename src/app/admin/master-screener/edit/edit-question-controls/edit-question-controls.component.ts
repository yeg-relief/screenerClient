import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../../../shared/models';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editScreener from '../edit.actions';

@Component({
  selector: 'app-edit-question-controls',
  templateUrl: './edit-question-controls.component.html',
  styleUrls: ['./edit-question-controls.component.css']
})
export class EditQuestionControlsComponent implements OnInit {
  @Input() question: Question;
  version: number;
  constructor(private store: Store<fromRoot.State>, private route: ActivatedRoute) { }

  ngOnInit() {
    this.version = this.route.snapshot.params['version'];
  }

  onDelete() {
    this.store.dispatch(new editScreener.RemoveQuestion(this.question));
  }
}
