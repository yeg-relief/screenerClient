import { Component, OnInit, Input } from '@angular/core';
import { ApplicationFacingProgram } from '../../../models/program';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {
  @Input() program: ApplicationFacingProgram;

  constructor() { }

  ngOnInit() {
  }

}
