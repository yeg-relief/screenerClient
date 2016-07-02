import { Component, EventEmitter, OnInit } from '@angular/core';
import { MasterScreenerComponent } from './master-screener';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ForWidth } from './for-width.directive';
import { WidthState } from './app.responsive.service';
import { Subscription } from 'rxjs/Subscription';
import { NavbarComponent } from './navbar/navbar.component' 


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
  `],
  providers: [WidthState, NavbarComponent]
})
export class AppComponent implements OnInit{
  private widthEmitter: EventEmitter<any>;
  
  constructor(private router:Router, private widthState: WidthState) {}
  
  ngOnInit(){
    this.widthEmitter = this.widthState.subject;
  }
  
  windowResize(event){
    //console.log(`in app component: ${event.width} ${event.message}`)
    this.widthEmitter.emit(event);
  }
}
