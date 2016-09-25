import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/reducers';
import { MasterScreenerActionsTypes } from '../../../core/actions';
import { MasterScreenerMetaData } from '../../../core/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  @Input() keyToggle: Subject<boolean>;
  @Input() questionToggle: Subject<boolean>;
  versions$: Observable<number[]>;

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.versions$ = this.store.let(fromRoot.getVersions);
  }

  keyChange(change) {
    this.keyToggle.next(change);
  }

  questionChange(change) {
    this.questionToggle.next(change);
  }

  notEight(version: number) {
    return version !== 8 ? 'anything' : 'false';
  }
}
