import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { UserFacingProgram } from '../../../models';

@Component({
  selector: 'app-user-facing-program',
  templateUrl: './user-facing-program.component.html',
  styleUrls: ['./user-facing-program.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFacingProgramComponent implements OnInit {
  @Input() program: UserFacingProgram;
  constructor() { }

  ngOnInit() {
  }
}
