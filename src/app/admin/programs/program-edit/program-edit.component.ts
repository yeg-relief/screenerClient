import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApplicationFacingProgram, ProgramQuery } from '../../models/program';
import { Key } from '../../models/key';
import { ProgramEditGuardService } from './route-guard';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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
import { uniqWith } from 'lodash';
import { FormControl, Validators, FormGroup } from '@angular/forms';

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
  title: FormControl;
  // text-area control for program details
  details: FormControl;
  // md-input control for program link
  link: FormControl;
  // md-input control for a tag name
  tag = new FormControl('');
  // url regex is not currently used
  // urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  // program is being uploaded
  saving$ = new BehaviorSubject<boolean>(false);
  // controls if user is editing the title, description etc or adding queries 
  view = new FormControl('user');
  views = ['user', 'application'];
  // multicasted observable used in template
  view$ = this.view.valueChanges.startWith('user').multicast(new Subject()).refCount();
  // program submission button
  submit$ = new Subject();

  state$: Observable<ApplicationFacingProgram>;

  // remove a tag
  removeTag$ = new Subject<string>();

  form: FormGroup;

  constructor(
    private service: ProgramEditGuardService,
    private store: Store<fromRoot.State>
  ) { }

  // set up logic for componenent
  ngOnInit() {
    this.view.valueChanges.subscribe(view => console.log(view));
    // the program being edited or created... loaded from memory
    let seedProgram: ApplicationFacingProgram;
    this.service.program$.take(1)
      .do(program => this.setControls(program))
      .do(program => seedProgram = program)
      .subscribe();
    // the keys the user can search... loaded from memory
    this.keys$ = this.store.let(fromRoot.getPresentKeys);

    const tagAdd$ = this.tagAdd.asObservable().withLatestFrom(this.tag.valueChanges)
      .map<string>( ([_, tag]) => tag);

    // changes in all inputs
    this.state$ = Observable.combineLatest(
      this.title.valueChanges.startWith(this.title.value),
      this.details.valueChanges.startWith(this.details.value),
      tagAdd$.startWith('-1'),
      this.link.valueChanges.startWith(this.link.value),
      this.removeTag$.asObservable().startWith('')
    )
    // update the program we're working on with each change
    .scan( (accum, [title, details, tag, link, remove]) => {
      accum = <ApplicationFacingProgram>accum;
      accum.user.description.title = title;
      accum.user.description.details = details;
      if (tag !== '-1') {
        accum.user.tags = [tag, ...accum.user.tags];
      }

      if (remove !== '') {
        const tagIndex = accum.user.tags.findIndex(programTag => programTag === remove);
        if (tagIndex >= 0) {
          accum.user.tags.splice(tagIndex, 1);
        }
      }
      accum.user.description.externalLink = link;
      return accum;
    }, seedProgram)
    .startWith(seedProgram)
    .let(deDuplicateProgramTags)
    .let(deDuplicateQueries)
    // share observable
    .multicast(new Subject()).refCount();

    this.submit$.withLatestFrom(this.state$)
      // only submit if the form is valid
      .filter(() => this.form.valid)
      .takeUntil(this.destroy$)
      .do(() => this.saving$.next(true))
      .map( ([_, program]) => program)
      // there is no logic to stop user from uploading duplicate programs
      .do(program => {
        if (program.guid === 'new') {
          this.service.createProgram(program);
        } else {
          this.service.updateProgram(program);
        }
      })
      .subscribe(program => console.log(program));

  }

  setControls(program: ApplicationFacingProgram) {
    this.title = new FormControl(program.user.description.title, Validators.required);
    this.details = new FormControl(program.user.description.details, Validators.required);
    this.link = new FormControl(program.user.description.externalLink);
    this.form = new FormGroup({
      title: this.title,
      details: this.details,
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}

function queryComparator(q1, q2): boolean {
  return JSON.stringify(q1) === JSON.stringify(q2);
}

// don't allow for setting duplicate tags
function deDuplicateProgramTags(program: Observable<ApplicationFacingProgram>): Observable<ApplicationFacingProgram> {
  return program.map( (p: ApplicationFacingProgram) => {
    p.user.tags = uniqWith(p.user.tags);
    return p;
  });
}

// don't allow for duplicate queries
function deDuplicateQueries(program: Observable<ApplicationFacingProgram>): Observable<ApplicationFacingProgram> {
  return program.map( (p: ApplicationFacingProgram) => {
    p.application = uniqWith(p.application, queryComparator);
    return p;
  });
}
