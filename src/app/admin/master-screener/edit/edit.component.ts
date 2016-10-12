import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { MasterScreener } from '../../models/master-screener';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  workingScreener$: Observable<MasterScreener>;
  saving$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.workingScreener$ = this.store.let(fromRoot.getPresentEditScreener);
    this.saving$ = this.store.let(fromRoot.getEditScreenerSaving);
  }

}
