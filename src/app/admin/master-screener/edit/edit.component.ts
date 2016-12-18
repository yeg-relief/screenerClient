import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MasterScreener } from '../../models/master-screener';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/multicast';
@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  workingScreener$: Observable<MasterScreener>;
  saving$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>, private route: ActivatedRoute) { }

  ngOnInit() {
    this.workingScreener$ = this.store.let(fromRoot.getPresentEditScreener)
      .multicast(new ReplaySubject(1)).refCount();
    this.saving$ = this.store.let(fromRoot.getEditScreenerSaving);
  }

}
