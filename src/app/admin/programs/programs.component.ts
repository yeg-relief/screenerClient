import { Component, OnInit } from '@angular/core';

@Component({
  template:
  `
    <div class="col col-12 flex flex-column overview-wrapper">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .overview-wrapper {}


  `]
})
export class ProgramsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
