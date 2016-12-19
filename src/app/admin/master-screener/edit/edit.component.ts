import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromEdit from './edit.actions';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MasterScreener } from '../../models/master-screener';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/multicast';
@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
  workingScreener$: Observable<MasterScreener>;
  saving$: Observable<boolean>;
  subscription: Subscription;
  constructor(private store: Store<fromRoot.State>, private route: ActivatedRoute) { }

  ngOnInit() {

    this.subscription = this.route.data.map(data => data['screener'])
      .subscribe(screener => {
        this.store.dispatch(new fromEdit.InitEdit(screener.version))
        this.store.dispatch(new fromEdit.LoadScreener(screener))
      })

    console.log('IN EDIT COMPONENT')
    console.log('========================')
    this.store.select(s => s.editScreener).subscribe(screener => console.log(screener));
    console.log('======================')


    this.workingScreener$ = this.store.let(fromRoot.getPresentEditScreener)
      .multicast(new ReplaySubject(1)).refCount();
    this.saving$ = this.store.let(fromRoot.getEditScreenerSaving);
  }

  ngOnDestroy() {
    if (!this.subscription.closed){
      this.subscription.unsubscribe();
    }
  }

}
