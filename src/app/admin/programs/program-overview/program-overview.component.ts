import { Component, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/shareReplay';
import { ApplicationFacingProgram } from '../../models/program';
import { Store } from '@ngrx/store';
import { DataService } from '../../data.service';
import * as fromRoot from '../../reducer';
import * as fromKeys from '../../keys/actions';
import * as programOverview from './actions';
import { ActivatedRoute } from '@angular/router'
import { Animations } from '../../../shared/animations';
import { FilterService, PageService } from './services'; 
import  * as helpers from './helpers';

@Component({
  selector: 'app-program-overview',
  templateUrl: './program-overview.component.html',
  styleUrls: ['./program-overview.component.css'],
  animations: [
    Animations.fadeinAndOut, 
    Animations.routeAnimation
  ],
  providers: [ FilterService, PageService ]
})
export class ProgramOverviewComponent implements OnInit {
  programs$: Observable<ApplicationFacingProgram[]>;
  loading$: Observable<boolean>;
  pageMetaData$: Observable<helpers.PageMetaData>;
  programUpdate$ = new EventEmitter<ApplicationFacingProgram>();
  currentPage = 0;

  constructor(
    private store: Store<fromRoot.State>, 
    private dataService: DataService, 
    private route: ActivatedRoute,
    private filterService: FilterService,
    private pageService: PageService) { }

  ngOnInit() {
    const programs = this.route.snapshot.data['programs'];
    if (programs !== undefined && Array.isArray(programs)) {
      this.store.dispatch(new programOverview.LoadProgramsSuccess(programs[0]));
      this.store.dispatch(new fromKeys._LoadKeysSuccess(programs[1]));
      this.pageService.setState(helpers.pageMetaDataFactory(programs[0]));
    }

    this.programs$ = Observable.merge(
      this.store.let(fromRoot.getLoadedPrograms),
      this.filterService.form.valueChanges.distinctUntilChanged().map(update => new helpers.FilterMessage(update)),
      this.pageService.valueChanges.map(config => new helpers.PageMetaData(config)),
      this.programUpdate$
    )
      .let(helpers.updateState)
      .let(helpers.applyFilter)
      //.let(helpers.applyPagination)
      //.do( ([page, update]) => update ? this.pageService.setState(update) : null)
      //.map( ([page, _]) => page.pageContent)
      .map(state => state.programs)
      .shareReplay();

    this.loading$ = this.store.let(fromRoot.areProgramsLoaded);
    this.pageMetaData$ = this.pageService.valueChanges;
  }

  handleUpdate($event) {
    this.programUpdate$.emit($event);
  }
}