import { Component, OnInit, Input } from '@angular/core';
import { UserFacingProgram } from '../../../../shared/models';


@Component({
  selector: 'app-program-detail-control',
  templateUrl: './program-detail-control.component.html',
  styleUrls: ['./program-detail-control.component.css']
})
export class ProgramDetailControlComponent implements OnInit {

  @Input() program: UserFacingProgram;

  constructor() { }

  ngOnInit() {
  }

}
