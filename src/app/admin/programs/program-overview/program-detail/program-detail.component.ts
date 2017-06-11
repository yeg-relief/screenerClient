import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ApplicationFacingProgram } from '../../../models/program';
import { MdDialog, MdDialogRef } from '@angular/material';
import { QueryDialogComponent } from './query-dialog/query-dialog.component';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {
  @Input() program: ApplicationFacingProgram;
  @Output() update = new EventEmitter<ApplicationFacingProgram>();
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

    let dialogRef = this.dialog.open(QueryDialogComponent, {
      width: '100vw',
      height: '95vh',
      data: this.program
    })
    dialogRef.afterClosed().take(1).subscribe(_ => {
      if (dialogRef._containerInstance.dialogConfig.data !== undefined){
        this.program.application = dialogRef._containerInstance.dialogConfig.data;
        this.update.emit(this.program);
      }
      
    })
  }
}
