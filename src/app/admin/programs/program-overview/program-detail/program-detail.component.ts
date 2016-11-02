import { Component, OnInit, Input } from '@angular/core';
import { UserFacingProgram } from '../../../../shared/models';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {
  @Input() program: UserFacingProgram;

  constructor() { }

  ngOnInit() {
  }

}
