import { Component, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-root',
  template: `
    <app-toolbar></app-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      main {
        height: 100vh;
        width: 100vw;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
