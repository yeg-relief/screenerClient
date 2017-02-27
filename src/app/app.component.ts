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
    <main id="main-outlet" [ngClass]="backgroundClass">
      <router-outlet></router-outlet>
    <main>

  `,
  styles: [
    `
      #main-outlet {
        min-height: 93vh;
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
    `,
    `
      @media(max-width: 600px) {
        .background {
          background-image: url(assets/17_01_27_SkylineIllustration_2.svg);
          background-position: center center;
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
    `,
    `
      .backgroundcolor {
        background-color: lightgoldenrodyellow;
      }
    `

  ]
})
export class AppComponent implements OnInit {

  backgroundClass = {
    background: true,
    backgroundcolor: false 
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
      .filter(url => url !== "don't care")
      .debounceTime(60)
      .map( url => url.substring(0, 7) === '/admin/' )
      .subscribe( val => {
        this.backgroundClass.background = !val;
        this.backgroundClass.backgroundcolor = val;
      });
  }
}
