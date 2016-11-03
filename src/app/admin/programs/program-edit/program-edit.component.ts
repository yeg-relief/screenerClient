import { Component, OnInit } from '@angular/core';
import { UserFacingProgram } from '../../../shared/models';
import { cloneDeep } from 'lodash';
import 'rxjs/add/operator/take';
import { ProgramEditGuardService } from './route-guard';
@Component({
  templateUrl: './program-edit.component.html',
  styleUrls: ['./program-edit.component.css']
})
export class ProgramEditComponent implements OnInit {
  program: UserFacingProgram = {
    guid: '',
    description: {
      guid: '',
      title: '',
      details: '',
      externalLink: ''
    },
    created: '',
    tags: []
  };
  newTag = '';

  errors = [];

  PROGRAM_ERRORS = {
    TITLE: 'empty title',
    DESCRIPTION: 'empty description'
  };

  constructor(private service: ProgramEditGuardService) { }

  ngOnInit() {
    // clone it so we can maintain a local state and just mutate etc
    this.service.program$.take(1).subscribe(storeProgram => this.program = cloneDeep(storeProgram));
  }

  titleChange(value) {
    this.program.description.title = value;
  }

  detailChange(value) {
    this.program.description.details = value;
  }

  linkChange(value) {
    this.program.description.externalLink = value;
  }

  newTagChange(value) {
    this.newTag = value;
  }

  deleteTag(value) {
    const index = this.program.tags.findIndex(tag => tag === value);
    if (index >= 0) {
      this.program.tags.splice(index, 1);
    }
  }

  addTag() {
    const index = this.program.tags.findIndex(tag => tag === this.newTag);
    if (this.newTag !== '' && index < 0) {
      this.program.tags.push(this.newTag);
      this.newTag = '';
    }
  }

  verifyProgram(): boolean {
    let valid = true;
    const descriptionErrorIndex = this.errors.findIndex(error => error === this.PROGRAM_ERRORS.DESCRIPTION);
    const titleErrorIndex = this.errors.findIndex(error => error === this.PROGRAM_ERRORS.TITLE);
    if (this.program.description.title === '') {
      if (titleErrorIndex < 0) {
        this.errors.push(this.PROGRAM_ERRORS.TITLE);
      }
      valid = false;
    } else {
      if (titleErrorIndex >= 0) {
        this.errors.splice(titleErrorIndex, 1);
      }
    }

    if (this.program.description.details === '') {
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
    if (valid) {
      if (this.program.guid === '') {
        this.service.createProgram(this.program);
      } else {
        this.service.updateProgram(this.program);
      }
    }
  }
}
