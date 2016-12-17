import { Component, ViewEncapsulation } from '@angular/core';
import { MasterScreenerService } from './user/master-screener/master-screener.service';
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
  providers: [MasterScreenerService]
})
export class AppComponent {}
