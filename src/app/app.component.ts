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
  directives: [MasterScreenerComponent, NavbarComponent, ROUTER_DIRECTIVES, ForWidth],
  providers: [WidthState]
})
export class AppComponent implements OnInit{
  private widthEmitter: EventEmitter<any>;
  
  constructor(private router:Router, private widthState: WidthState) {}
  
  ngOnInit(){
    this.widthEmitter = this.widthState.subject;
  }

  windowResize(event){
    this.widthEmitter.emit(event);
  }
  
  windowInit(event){
    this.widthState.buildBehavior(event.width);
  }
}
