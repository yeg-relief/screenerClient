import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApplicationFacingProgram } from '../../models/program';
import { Store } from '@ngrx/store';
import { DataService } from '../../data.service';
import * as fromRoot from '../../reducer';
import * as programOverview from './actions';
import * as fromKeys from '../../master-screener/keys/key.actions';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-program-overview',
  templateUrl: './program-overview.component.html',
  styleUrls: ['./program-overview.component.css']
})
export class ProgramOverviewComponent implements OnInit {
  private programs$: Observable<ApplicationFacingProgram[]>;
  private loading$: Observable<boolean>;
  state$: Observable<any>
  constructor(private store: Store<fromRoot.State>, private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    const programs = this.route.snapshot.data['programs'];
    if (programs !== undefined && Array.isArray(programs)){
      this.store.dispatch(new programOverview.LoadProgramsSuccess(programs));
      this.store.dispatch(new fromKeys.LoadKeys({}));
    }
    this.programs$ = this.store.let(fromRoot.getLoadedPrograms);
    // this is not semantic because it will be false when all programs are loaded
    this.loading$ = this.store.let(fromRoot.areProgramsLoaded);
  }

}
