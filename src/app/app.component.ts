import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ROUTER_DIRECTIVES } from '@angular/router'
@Component({
  selector: 'my-app',
  templateUrl:'app/app.component.html',
  directives: [NavbarComponent, ROUTER_DIRECTIVES]
})
export class AppComponent{
  
  constructor() {}
}
