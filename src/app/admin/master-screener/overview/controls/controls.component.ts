import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import { MasterScreenerActionsTypes } from '../../master-screener.actions';

@Component({
  selector: 'app-overview-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewControlsComponent implements OnInit, OnDestroy {
  @Input() keyToggle: Subject<boolean>;
  @Input() questionToggle: Subject<boolean>;
  @Input() versions: number[];
  @Input() loading: boolean;
  @Input() error: string;
  workingVersion$: Observable<number>;
  sub: any;

  private selectedVersion: number = undefined;
  constructor(private router: Router, private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.workingVersion$ = this.store.let(fromRoot.getWorkingNumber);
    this.sub = this.workingVersion$.subscribe(
      (version) => {
        this.selectedVersion = version;
      }
    );
  }

  keyChange(change) {
    this.keyToggle.next(change);
  }

  questionChange(change) {
    this.questionToggle.next(change);
  }

  isSelected(version: number) {
    return version === this.selectedVersion;
  }

  selectChange(updatedVersion: number) {
    this.selectedVersion = updatedVersion;
    console.log(this.selectedVersion);
    this.store.dispatch({
      type: MasterScreenerActionsTypes.LOAD_MASTER_SCREENER_VERSION,
      payload: this.selectedVersion
    });
  }

  editSelectedVersion() {
    if (typeof this.selectedVersion === 'undefined') {
      return;
    }
    this.router.navigateByUrl('/admin/master-screener/edit/version/' + this.selectedVersion);
  }

  checkForUndefined() {
    return typeof this.selectedVersion === 'undefined';
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
