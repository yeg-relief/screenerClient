import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { ApplicationFacingProgram } from '../../models/program';
import { Store } from '@ngrx/store';
import { DataService } from '../../data.service';
import * as fromRoot from '../../reducer';
import * as fromKeys from '../../keys/actions';
import * as programOverview from './actions';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-program-overview',
  templateUrl: './program-overview.component.html',
  styleUrls: ['./program-overview.component.css']
})
export class ProgramOverviewComponent implements OnInit {
  private programs$: Observable<ApplicationFacingProgram[]>;
  private loading$: Observable<boolean>;
  private filter = new BehaviorSubject<FilterMessage>(new FilterMessage({type: '', value: ''}));
  constructor(private store: Store<fromRoot.State>, private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    const programs = this.route.snapshot.data['programs'];
    if (programs !== undefined && Array.isArray(programs)) {
      this.store.dispatch(new programOverview.LoadProgramsSuccess(programs[0]));
      this.store.dispatch(new fromKeys._LoadKeysSuccess(programs[1]));
    }

    const initialState = {
      filter: new FilterMessage({ type: '', value: '' }),
      programs: []
    }

    this.programs$ = Observable.merge(
      this.store.let(fromRoot.getLoadedPrograms),
      this.filter
    )
      .scan((state: ProgramState, update: FilterMessage | ApplicationFacingProgram[]) => {
        if (update instanceof FilterMessage) {
          state.filter = new FilterMessage(update)
          return state;
        } else if (Array.isArray(update)) {
          state.programs = [...update].sort(programComparator);
          return state;
        }

        return initialState;
      }, initialState)
      .let(applyFilter)
      .multicast(new ReplaySubject<any>(1)).refCount();

    this.loading$ = this.store.let(fromRoot.areProgramsLoaded);
  }

  handleFilter($event){
    this.filter.next( new FilterMessage($event) );
  }
}

class ProgramState {
  filter: FilterMessage;
  programs: ApplicationFacingProgram[];

  constructor(filter: FilterMessage, programs: ApplicationFacingProgram[]) {
    this.filter = filter;
    this.programs = programs;
  }
}

class FilterMessage {
  type: '' | 'tag' | 'title'| 'none' = '';
  value: string = '';

  constructor(update) {
    this.type = update.type;
    this.value = update.value;
  }
}

function programComparator(a: ApplicationFacingProgram, b: ApplicationFacingProgram): number {
  const titleA = a.user.title.toUpperCase();
  const titleB = b.user.title.toUpperCase();

  if (titleA < titleB) return -1;

  if (titleB < titleA) return 1;

  return 0;
}


function applyFilter(source: Observable<ProgramState>): Observable<ApplicationFacingProgram[]> {
  return source
    .switchMap((state: ProgramState) => {
      const programs = state.programs;
      switch (state.filter.type) {
        case '': {
          return Observable.of(programs);
        }

        case 'tag': {
          const filterTag = state.filter.value;
          
          return Observable.from(programs)
            .filter(program => program.user.tags.find(tag => tag === filterTag) !== undefined)
            .toArray();
        }

        case 'title': {
          if (state.filter.value === ''){
            return Observable.of([]);
          }


          const regexp = new RegExp(state.filter.value);

          return Observable.from(programs)
            .filter(program => regexp.test(program.user.title))
            .toArray();
        }

        case 'none': {
          return Observable.of(programs);
        }

        default: {
          return Observable.of(programs);
        }
      }
    })
}