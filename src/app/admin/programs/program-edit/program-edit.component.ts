import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApplicationFacingProgram } from '../../models/program';
import { cloneDeep } from 'lodash';
import 'rxjs/add/operator/take';
import { ProgramEditGuardService } from './route-guard';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Key } from '../../models/key';
import { ProgramCondition } from '../../models/program';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/from';

@Component({
  templateUrl: './program-edit.component.html',
  styleUrls: ['./program-edit.component.css']
})
export class ProgramEditComponent implements OnInit, OnDestroy {
  keys$: Observable<Key[]>;
  program: ApplicationFacingProgram = {
    guid: 'new',
    user: {
      guid: 'new',
      description: {
        guid: '',
        title: '',
        details: '',
        externalLink: ''
      },
      created: '',
      tags: []
    },
    application: []
  };
  newTag = '';
  newCondition$ = new Subject<ProgramCondition>();
  destroy$ = new Subject<boolean>();
  errors = [];

  PROGRAM_ERRORS = {
    TITLE: 'empty title',
    DESCRIPTION: 'empty description'
  };

  saveInProgress: boolean;
  touched: boolean;

  selectedView: string;

  views = [
    {
      value: 'user'
    },
    {
      value: 'application'
    }
  ];

  constructor(private service: ProgramEditGuardService, private store: Store<fromRoot.State> ) { }

  ngOnInit() {
    // clone it so we can maintain a local state and just mutate etc
    this.service.program$.take(1).subscribe(storeProgram => this.program = cloneDeep(storeProgram));
    this.saveInProgress = false;
    this.touched = false;
    this.selectedView = this.views[0].value;
    this.keys$ = this.store.let(fromRoot.getPresentKeys);    
    this.newCondition$
      .scan( (accum, editCondition) => {
        const duplicate = accum.find(programCondition => JSON.stringify(programCondition) === JSON.stringify(editCondition));
        if (duplicate === undefined) {
          accum.push(editCondition);
        }
        return accum;
      }, [])
      .takeUntil(this.destroy$)
      .do(() => this.touched = true)
      .subscribe({
        next: (conditions: ProgramCondition[]) => this.program.application = [...conditions],
        complete: () => console.log('completed')
      });

      // inject already present values... sloppy?
      Observable.from(this.program.application).subscribe(val => this.newCondition$.next(val)).unsubscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  titleChange(value) {
    this.program.user.description.title = value;
    this.touched = true;
  }

  detailChange(value) {
    this.program.user.description.details = value;
    this.touched = true;
  }

  linkChange(value) {
    this.program.user.description.externalLink = value;
    this.touched = true;
  }

  newTagChange(value) {
    this.newTag = value;
  }

  deleteTag(value) {
    const index = this.program.user.tags.findIndex(tag => tag === value);
    if (index >= 0) {
      this.program.user.tags.splice(index, 1);
    }
    this.touched = true;
  }

  addTag() {
    const index = this.program.user.tags.findIndex(tag => tag === this.newTag);
    if (this.newTag !== '' && index < 0) {
      this.program.user.tags.push(this.newTag);
      this.newTag = '';
    }
    this.touched = true;
  }

  verifyProgram(): boolean {
    let valid = true;
    const descriptionErrorIndex = this.errors.findIndex(error => error === this.PROGRAM_ERRORS.DESCRIPTION);
    const titleErrorIndex = this.errors.findIndex(error => error === this.PROGRAM_ERRORS.TITLE);
    if (this.program.user.description.title === '') {
      if (titleErrorIndex < 0) {
        this.errors.push(this.PROGRAM_ERRORS.TITLE);
      }
      valid = false;
    } else {
      if (titleErrorIndex >= 0) {
        this.errors.splice(titleErrorIndex, 1);
      }
    }

    if (this.program.user.description.details === '') {
      if (descriptionErrorIndex < 0) {
        this.errors.push(this.PROGRAM_ERRORS.DESCRIPTION);
      }
      valid = false;
    } else {
      if (descriptionErrorIndex >= 0) {
        this.errors.splice(descriptionErrorIndex, 1);
      }
    }
    return valid;
  }

  saveProgram() {
    const valid = this.verifyProgram();
    if (valid && this.touched) {
      this.saveInProgress = true;
      if (this.program.guid === 'new') {
        this.service.createProgram(this.program);
      } else {
        this.service.updateProgram(this.program);
      }
    }
  }

  viewChange($event) {
    const index = this.views.findIndex(view => view.value === $event);
    if (index >= 0) {
      this.selectedView = this.views[index].value;
    }
  }

  handleApplicationSave($event) {
    console.log($event);
  }
}
