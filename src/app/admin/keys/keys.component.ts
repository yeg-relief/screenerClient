import { Component, OnInit } from '@angular/core';

@Component({
  template:
  `
    <md-card class="col col-12 flex flex-column overview-wrapper">
      <router-outlet></router-outlet>
    </md-card>
  `,
  styles: [`
    md-card {
      height: 80vh;
      overflow-x: hidden;
      overflow-y: auto;
      font-family: 'Roboto Mono', monospace;
    }
  `]
})
export class KeysComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
