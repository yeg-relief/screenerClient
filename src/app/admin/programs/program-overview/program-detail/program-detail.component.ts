import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ApplicationFacingProgram } from '../../../models/program';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {
  @Input() program: ApplicationFacingProgram;
  @Output() delete = new EventEmitter<string>()
  selectedView: string;

  views = [
    { value: 'user' },
    { value: 'application'}
  ];

  constructor(public dialog: MdDialog) { }

  ngOnInit() {
    this.selectedView = this.views[0].value;
  }

  viewChange($event) {
    const index = this.views.findIndex(view => view.value === $event);
    if (index >= 0) {
      this.selectedView = this.views[index].value;
    }
  }

  openQueryDialog() {
    if ( this.program === undefined ) return;
  }
}
