import { Component, OnInit, } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../core/reducers';
import { MasterScreenerActionsTypes } from '../../core/actions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  keyToggle: Subject<boolean>;
  questionToggle: Subject<boolean>;
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.keyToggle = new Subject<boolean>();
    this.questionToggle = new Subject<boolean>();
    this.keyToggle.next(true);
    this.questionToggle.next(true);
    this.store.dispatch({
      type: MasterScreenerActionsTypes.LOAD_META_DATA
    });
  }

}
