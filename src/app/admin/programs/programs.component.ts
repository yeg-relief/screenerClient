import { Component, OnInit } from '@angular/core';
import { ProgramModelService } from './services/program-model.service'

@Component({
  template:
  `
    <div class="col col-12 flex flex-column overview-wrapper">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .overview-wrapper {}


  `],
  providers: [
    ProgramModelService
  ]
})
export class ProgramsComponent implements OnInit {

  constructor(public model: ProgramModelService) { }

  ngOnInit() {
  }

}
