import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApplicationFacingProgram, ProgramQuery } from '../../models/program';
import { Key } from '../../models/key';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/merge';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromOverview from '../program-overview/actions';
import { cloneDeep } from 'lodash';
import { ActivatedRoute } from '@angular/router';

interface Action {
  type: string;
  payload: any;
}

@Component({
  templateUrl: './program-edit.component.html',
  styleUrls: ['./program-edit.component.css']
})
export class ProgramEditComponent implements OnInit, OnDestroy {
  // all keys in memory
  keys$: Observable<Key[]>;
  // a new query coming from /application-side/application-side.component
  query$ = new Subject<ProgramQuery>();
  // button for adding a tag
  tagAdd = new Subject();
  // emit in OnDestroy to unsubscribe 'main' observable
  destroy$ = new Subject<boolean>();
  // md-input control for program title
  title = new FormControl('', Validators.required);
  // text-area control for program details
  details = new FormControl('', Validators.required);
  // md-input control for program link
  link = new FormControl('');
  // md-input control for a tag name
  tag = new FormControl('');
  // url regex is not currently used
  // urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  // program is being uploaded
  saving$ = new BehaviorSubject<boolean>(false);
  // controls if user is editing the title, description etc or adding queries 
  view = new FormControl('user');
  views = ['user', 'application'];
  view$ = this.view.valueChanges.multicast(new Subject()).refCount();
  // program submission button
  submit$ = new Subject();
  // program being edited
  state$: Observable<ApplicationFacingProgram>;
  // remove a tag
  removeTag$ = new Subject<string>();
  // used primarily to enable/disable save button
  form: FormGroup;
  // save updated queries from application side
  updatedQueries$ = new Subject<ProgramQuery[]>();

  hide = false;

  constructor(private store: Store<fromRoot.State>, private route: ActivatedRoute) { }

  ngOnInit() {
    this.state$ = this.dispatch$()
      .let(reducer)
      .takeUntil(this.destroy$)
      .multicast(new ReplaySubject(1)).refCount();

    this.submit$
      .asObservable()
      .withLatestFrom(this.state$)
      .filter(() => this.form.valid)
      .do(() => this.saving$.next(true))
      .takeUntil(this.destroy$)
      .do(([_, program]) => {
        if (program.guid === 'new') {
          this.store.dispatch(new fromOverview.CreateProgram(program));
        } else {
          this.store.dispatch(new fromOverview.UpdateProgram(program));
        }
      })
      .catch(error => Observable.of('error encountered'))
      .subscribe({
        next: val => console.log(val),
        error: err => console.error(err),
        complete: () => console.log('submit complete')
      });

    this.view$
      .takeUntil(this.destroy$)
      .subscribe({
        next: view => {
          if (view !== 'application') {
            this.hide = false;
          } else {
            this.hide = true;
          }
        },
        complete: () => console.log('view subscription complete')
      });
  }

  // called in dispatch$ via program$ subscription
  // sets all the formcontrols to reflect values in memory upon startup
  setControls(program: ApplicationFacingProgram) {
    this.title.setValue(program.user.title);
    this.details.setValue(program.user.details);
    this.link.setValue(program.user.externalLink);
    this.form = new FormGroup({
      title: this.title,
      details: this.details,
    });
  }

  dispatch$() {
    const guid = this.route.snapshot.params['guid'];
    const initialState$ = fromRoot.findProgram(this.store, guid)
      // get rid of object reference
      .map(program => cloneDeep(program))
      .do(program => this.setControls(program))
      // sideEffects executed once
      .multicast(new ReplaySubject(1)).refCount();

    const title$ = this.title.valueChanges.map(title => {
      return {
        type: 'UPDATE_TITLE',
        payload: title
      };
    });

    const updateDetails$ = this.details.valueChanges.map(details => {
      return {
        type: 'UPDATE_DETAILS',
        payload: details
      };
    });

    const updateLink$ = this.link.valueChanges.map(link => {
      return {
        type: 'UPDATE_LINK',
        payload: link
      };
    });

    const initState$ = initialState$.map(p => {
      return {
        type: 'INIT_STATE',
        payload: p
      };
    });

    const tagAdd$ = this.tagAdd.asObservable().withLatestFrom(this.tag.valueChanges)
      .do(() => this.tag.reset(''))
      .map(([_, tag]) => {
        return {
          type: 'ADD_TAG',
          payload: tag
        };
      })
      .multicast(new Subject()).refCount();

    const removeTag = this.removeTag$.map(tag => {
      return {
        type: 'REMOVE_TAG',
        payload: tag
      };
    });

    const onUpdateQueries$ = this.updatedQueries$
      .map(queries => {
        return {
          type: 'UPDATE_QUERIES',
          payload: queries
        };
      });

    return Observable.merge(
      // initState$ must be first to ensure there is an initial state
      initState$,
      title$,
      updateDetails$,
      updateLink$,
      tagAdd$,
      removeTag,
      onUpdateQueries$
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}

function reducer(actions: Observable<any>): Observable<ApplicationFacingProgram> {
  return actions.scan((state, action) => {
    ;
    switch (action.type) {
      case 'INIT_STATE': {
        return Object.assign({}, state, action.payload);
      }
      case 'UPDATE_DETAILS': {
        state.user.details = action.payload;
        return state;
      }
      case 'UPDATE_LINK': {
        state.user.externalLink = action.payload;
        return state;
      }
      case 'UPDATE_TITLE': {
        state.user.title = action.payload;
        return state;
      }
      case 'ADD_TAG': {
        if (state.user.tags.findIndex(programTag => action.payload === programTag) < 0) {
          state.user.tags.push(action.payload);
        }
        return state;
      }
      case 'REMOVE_TAG': {
        const index = state.user.tags.findIndex(programTag => action.payload === programTag);
        if (index >= 0) {
          state.user.tags.splice(index, 1);
        }
        return state;
      }
      case 'UPDATE_QUERIES': {
        return Object.assign({}, state, {
          application: [...action.payload]
        });
      }
      default: {
        return state;
      }
    }
  }, {});
}
