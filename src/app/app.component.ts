import { Component, EventEmitter, OnInit } from '@angular/core';
import { MediaListener } from './media-listener.directive';
import { NavbarComponent } from './navbar/navbar.component'; 
import { Store } from '@ngrx/store';
import { AppState } from './reducers';


@Component({
  selector: 'my-app',
  templateUrl:'app/app.component.html',
  directives: [NavbarComponent, MediaListener]
})
export class AppComponent implements OnInit{
  
  constructor(private store: Store<AppState>) {}
  ngOnInit(){}
}
