import { MasterScreenerComponent } from '../master-screener';
import { HomeComponent } from '../home';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { WidthState } from '../app.responsive.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core'


@Component({
  selector: 'ycb-navbar',
  templateUrl:'app/navbar/navbar.component.html',
  directives: [MasterScreenerComponent, HomeComponent, ROUTER_DIRECTIVES]
})
export class NavbarComponent implements OnInit{
  private width: number;
  constructor(){}
  
  ngOnInit(){}
}
