import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  template: `
    <app-toolbar></app-toolbar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      main {
        background-image: url(assets/17_01_27_SkylineIllustration_2.svg);
        background-position: center bottom;
        background-repeat: no-repeat;
        background-size: contain;
        height: 94vh;
        width: 100vw;
      }
    `
  ],
})
export class AppComponent {}
