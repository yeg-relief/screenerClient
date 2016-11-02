import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserFacingProgram } from '../../../shared/models';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';

@Component({
  selector: 'app-program-overview',
  templateUrl: './program-overview.component.html',
  styleUrls: ['./program-overview.component.css']
})
export class ProgramOverviewComponent implements OnInit {
  private programs$: Observable<UserFacingProgram[]>;
  private loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.programs$ = this.store.let(fromRoot.getLoadedPrograms);
    // this is not semantic because it will be false when all programs are loaded
    this.loading$ = this.store.let(fromRoot.areProgramsLoaded);
  }

}
