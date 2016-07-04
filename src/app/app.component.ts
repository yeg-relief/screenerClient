import { Component, EventEmitter, OnInit } from '@angular/core';
import { MediaListener } from './media-listener.directive';
import { NavbarComponent } from './navbar/navbar.component'; 
import { Store } from '@ngrx/store';
import { AppState } from './reducers';
import { ROUTER_DIRECTIVES } from '@angular/router';


@Component({
  selector: 'my-app',
  templateUrl:'app/app.component.html',
  directives: [NavbarComponent, MediaListener, ROUTER_DIRECTIVES]
})
export class AppComponent implements OnInit{
  
  constructor(private store: Store<AppState>) {}
  ngOnInit(){}
}
