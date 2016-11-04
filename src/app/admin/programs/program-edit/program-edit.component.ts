import { Component, OnInit } from '@angular/core';
import { ApplicationFacingProgram } from '../../models/program';
import { cloneDeep } from 'lodash';
import 'rxjs/add/operator/take';
import { ProgramEditGuardService } from './route-guard';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { Key } from '../../models/key';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/concatMap';

@Component({
  templateUrl: './program-edit.component.html',
  styleUrls: ['./program-edit.component.css']
})
export class ProgramEditComponent implements OnInit {
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
  // keys
  currentKey = {
    name: '',
    type: ''
  };
  numberOptions = [
    {
      display: '>', value: 'greaterThan'
    },
    {
      display: '>=', value: 'greaterThanOrEqual'
    },
    {
      display: '=', value: 'equal'
    },
    {
      display: '<', value: 'lessThanOrEqual'
    },
    {
      display: '<', value: 'lessThan'
    }
  ];

  booleanOptions = [
    {
      display: 'true', value: true
    },
    {
      display: 'false', value: false
    }
  ];

  selectedNumberOption: string;
  selectedBooleanOption: string;

  newCondition = {
    key: {
      name: '',
      type: ''
    },
    value: undefined,
    type: undefined,
    qualifier: undefined
  };

  constructor(private service: ProgramEditGuardService, private store: Store<fromRoot.State> ) { }

  ngOnInit() {
    // clone it so we can maintain a local state and just mutate etc
    this.service.program$.take(1).subscribe(storeProgram => this.program = cloneDeep(storeProgram));
    this.saveInProgress = false;
    this.touched = false;
    this.selectedView = this.views[0].value;
    this.keys$ = this.store.let(fromRoot.getKeys);
    this.currentKey.name = 'empty';
    this.currentKey.type = undefined;
    this.selectedNumberOption = '';
    this.selectedBooleanOption = '';
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

  isEmpty() {
    return this.currentKey.name === 'empty';
  }

  isSelected(key: string) {
    return key === this.currentKey.name;
  }

  selectChange(value) {
    this.keys$
      .take(1)
      .concatMap(keys => keys)
      .find(key => key.name === value)
      .subscribe(key => this.currentKey = key);
  }
}
