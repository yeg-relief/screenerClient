import { Component, OnInit } from '@angular/core';
import { ApplicationFacingProgram } from '../../models/program';
import { cloneDeep } from 'lodash';
import 'rxjs/add/operator/take';
import { ProgramEditGuardService } from './route-guard';
@Component({
  templateUrl: './program-edit.component.html',
  styleUrls: ['./program-edit.component.css']
})
export class ProgramEditComponent implements OnInit {
  program: ApplicationFacingProgram = {
    guid: '',
    user: {
      guid: '',
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

  constructor(private service: ProgramEditGuardService) { }

  ngOnInit() {
    // clone it so we can maintain a local state and just mutate etc
    this.service.program$.take(1).subscribe(storeProgram => this.program = cloneDeep(storeProgram));
    this.saveInProgress = false;
    this.touched = false;
    this.selectedView = this.views[0].value;
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
}
