import { Component, OnInit, Input } from '@angular/core';
import { ApplicationFacingProgram } from '../../../models/program';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {
  @Input() program: ApplicationFacingProgram;
  selectedView: string;

  views = [
    {
      value: 'user'
    },
    {
      value: 'application'
    }
  ];

  constructor() { }

  ngOnInit() {
    this.selectedView = this.views[0].value;
  }

  viewChange($event) {
    const index = this.views.findIndex(view => view.value === $event);
    if (index >= 0) {
      this.selectedView = this.views[index].value;
    }
  }
}
