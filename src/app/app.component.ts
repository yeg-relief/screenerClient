import { Component } from '@angular/core';
import { MasterScreenerComponent } from './master-screener';
import { 
  ROUTER_DIRECTIVES, Router, Event,  
  NavigationStart, NavigationEnd, 
  NavigationCancel, NavigationError} from '@angular/router';
import {ForWidth} from './for-width.directive';



@Component({
  selector: 'my-app',
  templateUrl:'app/app.component.html',
  directives: [MasterScreenerComponent, ROUTER_DIRECTIVES, ForWidth],
  styles: [`
  @media(min-width: 20em){
    input[type='textbox']{
      width: 100%;
      margin-left: 5%;
      margin-right: 2%;
    }
  }
    input[type='textbox'] {
    font-family: inherit;
    font-size: inherit;
    display: block;
    height: 100%;
    padding: .5rem;
    color: navy;
    border: 1px solid black;
    max-width: 100%;
  }

  #search{
    width:100%;
  }
  `]
})
export class AppComponent{
  
  constructor(private router:Router) {
    router.events.subscribe( event => {
      if(event instanceof NavigationStart){
        console.log(`navigations start: ${event}`)
      }
      if(event instanceof NavigationEnd){
        console.log(`navigations end: ${event}`)
      }
      if(event instanceof NavigationCancel){
        console.log(`navigations cancel: ${event}`)
      }
      if(event instanceof NavigationError){
        console.log(`navigations error: ${event}`)
      }
      console.log(this.router.url);
    });
  }
  
  test(val){
    console.log(`from component: ${val}`);
  }
}
