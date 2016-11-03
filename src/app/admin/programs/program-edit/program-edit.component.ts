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

  saveInProgress: boolean;
  touched: boolean;

  constructor(private service: ProgramEditGuardService) { }

  ngOnInit() {
    // clone it so we can maintain a local state and just mutate etc
    this.service.program$.take(1).subscribe(storeProgram => this.program = cloneDeep(storeProgram));
    this.saveInProgress = false;
    this.touched = false;
  }

  titleChange(value) {
    this.program.description.title = value;
    this.touched = true;
  }

  detailChange(value) {
    this.program.description.details = value;
    this.touched = true;
  }

  linkChange(value) {
    this.program.description.externalLink = value;
    this.touched = true;
  }

  newTagChange(value) {
    this.newTag = value;
    this.touched = true;
  }

  deleteTag(value) {
    const index = this.program.tags.findIndex(tag => tag === value);
    if (index >= 0) {
      this.program.tags.splice(index, 1);
    }
    this.touched = true;
  }

  addTag() {
    const index = this.program.tags.findIndex(tag => tag === this.newTag);
    if (this.newTag !== '' && index < 0) {
      this.program.tags.push(this.newTag);
      this.newTag = '';
    }
    this.touched = true;
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
    if (valid && this.touched) {
      this.saveInProgress = true;
      console.log(this.saveInProgress);
      if (this.program.guid === 'new') {
        this.service.createProgram(this.program);
      } else {
        this.service.updateProgram(this.program);
      }
    }
  }
}
