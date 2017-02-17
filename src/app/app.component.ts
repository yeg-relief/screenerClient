import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/multicast';


@Component({
  selector: 'app-root',
  template: `
    <app-toolbar></app-toolbar>
    <main [ngClass]="backgroundClass">
      <router-outlet></router-outlet>
    <main>

  `,
  styles: [
    `
      main {
        height: 94vh;
        width: 100vw;
        overflow-x: hidden;
      }
    `,
    `
      .background {
        background-image: url(assets/17_01_27_SkylineIllustration_2.svg);
        background-position: center bottom;
        background-repeat: no-repeat;
        background-size: contain;
      }
    `

  ]
})
export class AppComponent implements OnInit {

  backgroundClass = {
    background: true,
  }

  constructor(private router: Router){}

  ngOnInit() {

    this.router.events
      .map(event => {
        if (event instanceof NavigationEnd) {
          return this.router.url;
        }
        return "don't care";
      })
      .debounceTime(60)
      .map( url => url.substring(0, 7) === '/admin/' )
      .subscribe( val => this.backgroundClass.background = !val );
  }
}
