import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router} from '@angular/router';


@Component({
  selector: 'ycb-navbar',
  templateUrl: 'app/navbar/navbar.component.html',
  directives: [ROUTER_DIRECTIVES],
  styleUrls: ['app/navbar/navbar.component.css']
})
export class NavbarComponent implements OnInit{
  ngOnInit(){
    
  }
}
