import { Component } from '@angular/core';
import { MasterScreenerComponent } from './master-screener';
import { 
  ROUTER_DIRECTIVES, Router, Event,  
  NavigationStart, NavigationEnd, 
  NavigationCancel, NavigationError} from '@angular/router';



@Component({
  selector: 'my-app',
  templateUrl:'app/app.component.html',
  directives: [MasterScreenerComponent, ROUTER_DIRECTIVES],
  styles: ['app/app.component.css']
})
export class AppComponent{
  
  constructor(private router:Router) {
    router.events.subscribe( event => {
      if(event instanceof NavigationStart){
        if(event.url === '/'){
          
        }
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
}
