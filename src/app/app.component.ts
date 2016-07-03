import { Component, EventEmitter, OnInit } from '@angular/core';
import { MediaListener } from './media-listener.directive';
import { Subscription } from 'rxjs/Subscription';
import { NavbarComponent } from './navbar/navbar.component' 
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Store } from '@ngrx/store';
import { SMALL, MEDIUM, LARGE  } from './reducers/index';


interface AppState {
  screen: string;
}



@Component({
  selector: 'my-app',
  templateUrl:'app/app.component.html',
  directives: [NavbarComponent, MediaListener, ROUTER_DIRECTIVES]
})
export class AppComponent implements OnInit{
  private widthEmitter: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(private store: Store<AppState>) {}
  
  ngOnInit(){}

  windowResize(event){
    this.widthEmitter.emit(event);
  }
}
