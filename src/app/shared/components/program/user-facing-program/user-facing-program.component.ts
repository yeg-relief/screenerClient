import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { UserFacingProgram } from '../../../models';
import { MdDialog } from '@angular/material';
import { DetailModalComponent } from '../detail-modal/detail-modal.component';
@Component({
  selector: 'app-user-facing-program',
  templateUrl: './user-facing-program.component.html',
  styleUrls: ['./user-facing-program.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFacingProgramComponent implements OnInit {
  @Input() program: UserFacingProgram;
  constructor(public dialog: MdDialog,) { }

  ngOnInit() {
    this.program.tags.sort( (a, b) => a.localeCompare(b));
  }

  openModal() {
    this.dialog.open(DetailModalComponent, {
      data: {
        title: this.program.title,
        details: this.program.details,
      },
      width: '75vw',
      height: '50vh'
    })
  }
}
